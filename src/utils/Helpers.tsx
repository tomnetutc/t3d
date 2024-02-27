import { Option, GroupedOption, weekOption, GroupedOptions, DataRow, ActivityOption, YearlyActivityData, TripPurposeOption, TravelModeOption, DayofWeekOption } from "../components/Types";
import { csv } from "d3";
import { DSVRowString } from "d3-dsv";
import firebase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import firebaseConfig from "../firebaseConfig";
import { useEffect } from "react";


export const useDocumentTitle = (pageTitle: string) => {
    useEffect(() => {
        const initialTitle = 'T3 Data Dashboard';
        document.title = `${initialTitle} | ${pageTitle}`;
    }, [pageTitle]);
};

// Singleton class for data management
export class DataProvider {
    private static instance: DataProvider;
    private data: DSVRowString<string>[] | null = null;

    private constructor() { }

    public static getInstance(): DataProvider {
        if (!DataProvider.instance) {
            DataProvider.instance = new DataProvider();
        }
        return DataProvider.instance;
    }

    public async loadData(): Promise<DSVRowString<string>[]> {
        if (this.data === null) {
            try {
                this.data = await csv('https://raw.githubusercontent.com/tomnetutc/t3d/main/public/df_time_use.csv');
            } catch (error) {
                console.error('Error loading data:', error);
                throw error;
            }
        }
        return this.data;
    }
}

export const getTotalRowsForYear = async (dataProvider: { loadData: () => Promise<any[]> }, year: string, filterUnemployed: boolean = false) => {
    try {
        const data = await dataProvider.loadData();
        if (filterUnemployed) //Filter the data without the unemployed data for Telework dashboard. This is a conditional argument hence by default it is false and doesn't expect a value
            return data.filter(row => row.year === year && row.unemployed == '0.0').length;

        return data.filter(row => row.year === year).length;

    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
};

export function filterCriteria(selectedOptions: Option[], year: string, weekOption: weekOption, filterUnemployed: boolean = false) {
    return function (row: DSVRowString<string>) {
        if (year && row['year'] !== year) return false;

        if (weekOption.value !== "All") {
            if (row[weekOption.id] !== weekOption.val) return false;
        }

        //Filter the data without the unemployed data for Telework dashboard. This is a conditional argument hence by default it is false and doesn't expect a value
        if (filterUnemployed && row['unemployed'] === "1.0") return false;

        const groupedOptions = selectedOptions.reduce((acc: GroupedOptions, option) => {
            const groupId = option.groupId;
            acc[groupId] = acc[groupId] || [];
            acc[groupId].push(option);
            return acc;
        }, {});

        return Object.values(groupedOptions).every((group: Option[]) => {
            return group.some(option => {
                const column = option.id;
                const value = option.val;
                return row[column] === value;
            });
        });
    };
}

export const fetchAndFilterData = async (dataProvider: { loadData: () => Promise<any[]> }, selectedOptions: Option[], year: string, weekOption: weekOption, filterUnemployed: boolean = false) => {
    try {
        const data = await dataProvider.loadData();
        return data.filter(filterCriteria(selectedOptions, year, weekOption, filterUnemployed));
    } catch (error) {
        console.error('Error fetching and filtering data:', error);
        return [];
    }
    //Added a conditional argument filterunemployed to filter the data without the unemployed data for Telework dashboard. This is a conditional argument hence by default it is false and doesn't expect a value
};

export const fetchAndFilterDataForBtwYearAnalysis = async (dataProvider: { loadData: () => Promise<any[]> }, selectedOptions: Option[], weekOption: weekOption, filterUnemployed: boolean = false) => {
    try {
        const data = await dataProvider.loadData();
        return data.filter(filterCriteria(selectedOptions, "", weekOption, filterUnemployed));
    } catch (error) {
        console.error('Error fetching and filtering data for between year analysis:', error);
        return [];
    }
}

export const calculateActivityAverages = (data: DataRow[]) => {
    return ActivityOptions.map((activity) => {
        const totalInHome = data.reduce((sum, row) => sum + parseFloat(row[activity.inHome] || '0'), 0);
        const totalOutHome = data.reduce((sum, row) => sum + parseFloat(row[activity.outHome] || '0'), 0);
        const averageInHome = totalInHome / data.length;
        const averageOutHome = totalOutHome / data.length;

        return {
            label: activity.label,
            inHome: averageInHome.toFixed(1), // Rounded to 1 decimal place
            outHome: averageOutHome.toFixed(1) // Rounded to 1 decimal place
        };
    });
};

export const calculateYearlyActivityAverages = (data: DataRow[], selectedActivity: ActivityOption, startYear: string, endYear: string): any[] => {
    const yearlyData: Record<string, YearlyActivityData> = {};

    const startYearNum = parseInt(startYear, 10);
    const endYearNum = parseInt(endYear, 10);

    data.forEach(row => {
        const year = row.year;
        const yearNum = parseInt(year, 10);

        if (yearNum >= startYearNum && yearNum <= endYearNum) {

            if (!yearlyData[year]) {
                yearlyData[year] = { inHome: 0, outHome: 0, count: 0 };
            }

            if (selectedActivity.label === "All") {
                ActivityOptions.forEach(activity => {
                    yearlyData[year].inHome += parseFloat(row[activity.inHome] || '0');
                    yearlyData[year].outHome += parseFloat(row[activity.outHome] || '0');
                });
            } else {
                yearlyData[year].inHome += parseFloat(row[selectedActivity.inHome] || '0');
                yearlyData[year].outHome += parseFloat(row[selectedActivity.outHome] || '0');
            }

            yearlyData[year].count += 1;
        }

    });

    return Object.entries(yearlyData).map(([year, { inHome, outHome, count }]) => ({
        year,
        inHomeAvg: (inHome / count).toFixed(1),
        outHomeAvg: (outHome / count).toFixed(1)
    }));
};


// Singleton class for Traveldata management
export class TravelDataProvider {
    private static instance: TravelDataProvider;
    private data: DSVRowString<string>[] | null = null;

    private constructor() { }

    public static getInstance(): TravelDataProvider {
        if (!TravelDataProvider.instance) {
            TravelDataProvider.instance = new TravelDataProvider();
        }
        return TravelDataProvider.instance;
    }

    public async loadData(): Promise<DSVRowString<string>[]> {
        if (this.data === null) {
            try {
                this.data = await csv('https://raw.githubusercontent.com/tomnetutc/t3d/main/public/df_travel.csv');
            } catch (error) {
                console.error('Error loading data:', error);
                throw error;
            }
        }
        return this.data;
    }
}

export const calculateTripAverages = (data: DataRow[]) => {
    return TripPurposeOptions.map((tripPurpose) => {
        const totalNumberTrip = data.reduce((sum, row) => sum + parseFloat(row[tripPurpose.numberTrip] || '0'), 0);
        const totalDurationTrips = data.reduce((sum, row) => sum + parseFloat(row[tripPurpose.durationTrips] || '0'), 0);
        const averageNumberTrip = totalNumberTrip / (data.length == 0 ? 1 : data.length);
        const averageDurationTrips = totalDurationTrips / (data.length == 0 ? 1 : data.length);

        return {
            label: tripPurpose.label,
            numberTrip: averageNumberTrip.toFixed(2), // Rounded to 2 decimal place
            durationTrips: averageDurationTrips.toFixed(1) // Rounded to 1 decimal place
        };
    });
};

export const calculateTravelModeAverages = (data: DataRow[]) => {
    return TravelModeOptions.map((travelMode) => {
        const totalNumberTrip = data.reduce((sum, row) => sum + parseFloat(row[travelMode.numberTrip] || '0'), 0);
        const totalDurationTrips = data.reduce((sum, row) => sum + parseFloat(row[travelMode.durationTrips] || '0'), 0);
        const averageNumberTrip = totalNumberTrip / (data.length == 0 ? 1 : data.length);
        const averageDurationTrips = totalDurationTrips / (data.length == 0 ? 1 : data.length);

        return {
            label: travelMode.label,
            numberTrip: averageNumberTrip.toFixed(2), // Rounded to 2 decimal places
            durationTrips: averageDurationTrips.toFixed(1) // Rounded to 1 decimal place
        };
    });
};

export const GenderOptions: Option[] = [
    {
        value: "Male",
        label: "Male",
        id: "female",
        val: "0.0",
        groupId: "Gender",
    },
    {
        value: "Female",
        label: "Female",
        id: "female",
        val: "1.0",
        groupId: "Gender",
    },

];

export const AgeOptions: Option[] = [
    {
        value: "15 to 19 years",
        label: "15 to 19 years",
        id: "age_15_19",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "20 to 29 years",
        label: "20 to 29 years",
        id: "age_20_29",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "30 to 49 years",
        label: "30 to 49 years",
        id: "age_30_49",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "50 to 64 years",
        label: "50 to 64 years",
        id: "age_50_64",
        val: "1.0",
        groupId: "Age",
    },
    {
        value: "65 years or older",
        label: "65 years or older",
        id: "age_65p",
        val: "1.0",
        groupId: "Age",
    },
];

export const EducationOptions: Option[] = [
    {
        value: "Less than high school",
        label: "Less than high school",
        id: "less_than_hs",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "High school",
        label: "High school",
        id: "hs_grad",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "Some college degree",
        label: "Some college degree",
        id: "some_col_assc_deg",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "Bachelor's degree",
        label: "Bachelor's degree",
        id: "bachelor",
        val: "1.0",
        groupId: "Education",
    },
    {
        value: "Graduate degree(s)",
        label: "Graduate degree(s)",
        id: "grad_sch",
        val: "1.0",
        groupId: "Education",
    },
];

export const RaceOptions: Option[] = [
    {
        value: "Asian",
        label: "Asian",
        id: "asian",
        val: "1.0",
        groupId: "Race",
    },
    {
        value: "Black",
        label: "Black",
        id: "black",
        val: "1.0",
        groupId: "Race",
    },
    {
        value: "White",
        label: "White",
        id: "white",
        val: "1.0",
        groupId: "Race",
    },
    {
        value: "Other",
        label: "Other",
        id: "race_other",
        val: "1.0",
        groupId: "Race",
    },
];

const EmploymentStatusOptions: Option[] = [
    {
        value: "Full-time worker",
        label: "Full-time worker",
        id: "full_time",
        val: "1.0",
        groupId: "Employment",
    },
    {
        value: "Part-time worker",
        label: "Part-time worker",
        id: "part_time",
        val: "1.0",
        groupId: "Employment",
    },
    {
        value: "Non-worker",
        label: "Non-worker",
        id: "unemployed",
        val: "1.0",
        groupId: "Employment",
    },
];

export const IncomeOptions: Option[] = [
    {
        value: "<$35K",
        label: "<$35K",
        id: "inc_up35",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: "$35K to $50K",
        label: "$35K to $50K",
        id: "inc_35_50",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: "$50K to $75K",
        label: "$50K to $75K",
        id: "inc_50_75",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: "$75K to $100K",
        label: "$75K to $100K",
        id: "inc_75_100",
        val: "1.0",
        groupId: "Income",
    },
    {
        value: ">$100K",
        label: ">$100K",
        id: "inc_100p",
        val: "1.0",
        groupId: "Income",
    },
];

export const HouseholdSize: Option[] = [
    {
        value: "One",
        label: "One",
        id: "hhsize_1",
        val: "1.0",
        groupId: "HouseholdSize",
    },
    {
        value: "Two",
        label: "Two",
        id: "hhsize_2",
        val: "1.0",
        groupId: "HouseholdSize",
    },
    {
        value: "Three or more",
        label: "Three or more",
        id: "hhsize_3p",
        val: "1.0",
        groupId: "HouseholdSize",
    },
];

const LocationOptions: Option[] = [
    {
        value: "Urban",
        label: "Urban",
        id: "non_metropolitan",
        val: "0.0",
        groupId: "Location",
    },
    {
        value: "Not urban",
        label: "Not urban",
        id: "non_metropolitan",
        val: "1.0",
        groupId: "Location",
    },
];

export const WorkArrangementOptions: Option[] = [
    {
        value: "Workers with zero work",
        label: "Workers with zero work",
        id: "zero_work",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "In-home only workers",
        label: "In-home only workers",
        id: "only_inhome_worker",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "Multi-site workers",
        label: "Multi-site workers",
        id: "multisite_worker",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "Commuters only",
        label: "Commuters only",
        id: "commuter_only",
        val: "1.0",
        groupId: "Work Arrangement",
    },
    {
        value: "Non-worker",
        label: "Non-worker",
        id: "unemployed",
        val: "1.0",
        groupId: "Work Arrangement",
    },
];

const TimePovertyOptions: Option[] = [
    {
        value: "Time poor",
        label: "Time poor",
        id: "time_poor",
        val: "1.0",
        groupId: "TimePoverty",
    },
    {
        value: "Not time poor",
        label: "Not time poor",
        id: "time_poor",
        val: "0.0",
        groupId: "TimePoverty",
    },
];

const TransportOptions: Option[] = [
    {
        value: "Car",
        label: "Car",
        id: "car_user",
        val: "1.0",
        groupId: "Transport",
    },
    {
        value: "Non-car",
        label: "Non-car",
        id: "car_user",
        val: "0.0",
        groupId: "Transport",
    },
];

const TripMakingOptions: Option[] = [
    {
        value: "One or more trips",
        label: "One or more trips",
        id: "zero_trip",
        val: "0.0",
        groupId: "ZeroTrip",
    },
    {
        value: "Zero trip",
        label: "Zero trip",
        id: "zero_trip",
        val: "1.0",
        groupId: "ZeroTrip",
    },
];

export const groupedOptions: GroupedOption[] = [
    {
        label: "Gender",
        options: GenderOptions.map((obj) => ({
            ...obj,
            groupName: "Gender",
        })),
    },
    {
        label: "Age",
        options: AgeOptions.map((obj) => ({
            ...obj,
            groupName: "Age",
        })),
    },
    {
        label: "Education",
        options: EducationOptions.map((obj) => ({
            ...obj,
            groupName: "Education",
        })),
    },
    {
        label: "Race",
        options: RaceOptions.map((obj) => ({
            ...obj,
            groupName: "Race",
        })),
    },
    {
        label: "Employment",
        options: EmploymentStatusOptions.map((obj) => ({
            ...obj,
            groupName: "Employment",
        })),
    },
    {
        label: "Household income",
        options: IncomeOptions.map((obj) => ({
            ...obj,
            groupName: "Household income",
        })),
    },
    {
        label: "Household size",
        options: HouseholdSize.map((obj) => ({
            ...obj,
            groupName: "Household size",
        })),
    },
    {
        label: "Location",
        options: LocationOptions.map((obj) => ({
            ...obj,
            groupName: "Location",
        })),
    },
    {
        label: "Work arrangement",
        options: WorkArrangementOptions.map((obj) => ({
            ...obj,
            groupName: "Work arrangement",
        })),
    },

    {
        label: "Time poverty status",
        options: TimePovertyOptions.map((obj) => ({
            ...obj,
            groupName: "Time poverty status",
        })),
    },
    {
        label: "Main mode of transportation",
        options: TransportOptions.map((obj) => ({
            ...obj,
            groupName: "Main mode of transportation",
        })),
    },
    {
        label: "Trip making status",
        options: TripMakingOptions.map((obj) => ({
            ...obj,
            groupName: "Trip making status",
        })),
    },
];

export const WeekOptions: weekOption[] = [
    {
        value: "All",
        label: "All",
        id: "weekday",
    },
    {
        value: "Weekday",
        label: "Weekday",
        id: "weekday",
        val: "1.0",
        groupId: "Weekday",
    },
    {
        value: "Weekend",
        label: "Weekend",
        id: "weekday",
        val: "0.0",
        groupId: "Weekend",
    },
];


export const ActivityOptions: ActivityOption[] = [
    {
        inHome: "in_sleep",
        outHome: "out_sleep",
        label: "Sleeping",
    },
    {
        inHome: "in_pcare",
        outHome: "out_pcare",
        label: "Professional / Personal Care Services",
    },
    {
        inHome: "in_hhact",
        outHome: "out_hhact",
        label: "Household Activities and Services",
    },
    {
        inHome: "in_ccare",
        outHome: "out_ccare",
        label: "Child / Adult Care",
    },
    {
        inHome: "in_work",
        outHome: "out_work",
        label: "Work & Work-Related Activities",
    },
    {
        inHome: "in_edu",
        outHome: "out_edu",
        label: "Education",
    },
    {
        inHome: "in_shop",
        outHome: "out_shop",
        label: "Consumer Purchases",
    },
    {
        inHome: "in_gov",
        outHome: "out_gov",
        label: "Government Services & Civic Obligations",
    },
    {
        inHome: "in_eat",
        outHome: "out_eat",
        label: "Eating and Drinking",
    },
    {
        inHome: "in_soc",
        outHome: "out_soc",
        label: "Socializing, Relaxing, and Leisure",
    },
    {
        inHome: "in_rec",
        outHome: "out_rec",
        label: "Sports, Exercise, & Recreation",
    },
    {
        inHome: "in_rel",
        outHome: "out_rel",
        label: "Religious, Spiritual, and Volunteer Activities",
    },
    {
        inHome: "in_phone",
        outHome: "out_phone",
        label: "Telephone Calls",
    },
    {
        inHome: "in_travel",
        outHome: "out_travel",
        label: "Traveling",
    },
    {
        inHome: "in_other",
        outHome: "out_other",
        label: "Other",
    },
];

export const TripPurposeOptions: TripPurposeOption[] = [
    {
        label: "Work",
        value: "Work",
        numberTrip: "tr_work",
        durationTrips: "tr_work_dur",
    },
    {
        label: "Education",
        value: "Education",
        numberTrip: "tr_educ",
        durationTrips: "tr_educ_dur",
    },
    {
        label: "Shopping",
        value: "Shopping",
        numberTrip: "tr_shop",
        durationTrips: "tr_shop_dur",
    },
    {
        label: "Recreational",
        value: "Recreational",
        numberTrip: "tr_rec",
        durationTrips: "tr_rec_dur",
    },
    {
        label: "Social",
        value: "Social",
        numberTrip: "tr_soc",
        durationTrips: "tr_soc_dur",
    },
    {
        label: "Eating/Drinking",
        value: "Eating/Drinking",
        numberTrip: "tr_eat",
        durationTrips: "tr_eat_dur",
    },
    {
        label: "Adult or Child care",
        value: "Adult or Child care",
        numberTrip: "tr_ccare",
        durationTrips: "tr_ccare_dur",
    },
    {
        label: "Other",
        value: "Other",
        numberTrip: "tr_other",
        durationTrips: "tr_other_dur",
    },
    {
        label: "Return to home",
        value: "Return to home",
        numberTrip: "tr_home",
        durationTrips: "tr_home_dur",
    },
    {
        label: "All",
        value: "All",
        numberTrip: "tr_all",
        durationTrips: "tr_all_dur",
    },

];

export const TravelModeOptions: TravelModeOption[] = [
    {
        label: "Car",
        value: "Car",
        numberTrip: "mode_car",
        durationTrips: "mode_car_dur",
    },
    {
        label: "Transit",
        value: "Transit",
        numberTrip: "mode_pt",
        durationTrips: "mode_pt_dur",
    },
    {
        label: "Walk",
        value: "Walk",
        numberTrip: "mode_walk",
        durationTrips: "mode_walk_dur",
    },
    {
        label: "Bike",
        value: "Bike",
        numberTrip: "mode_bike",
        durationTrips: "mode_bike_dur",
    },
    {
        label: "Other",
        value: "Other",
        numberTrip: "mode_other",
        durationTrips: "mode_other_dur",
    },
    {
        label: "All",
        value: "All",
        numberTrip: "mode_all",
        durationTrips: "mode_all_dur",
    },
];

export const DayofWeek: DayofWeekOption[] = [
    {
        label: "Monday",
        value: "Monday",
        id: "day",
        val: "2.0",
        groupId: "Weekday",
    },
    {
        label: "Tuesday",
        value: "Tuesday",
        id: "day",
        val: "3.0",
        groupId: "Weekday",
    },
    {
        label: "Wednesday",
        value: "Wednesday",
        id: "day",
        val: "4.0",
        groupId: "Weekday",
    },
    {
        label: "Thursday",
        value: "Thursday",
        id: "day",
        val: "5.0",
        groupId: "Weekday",
    },
    {
        label: "Friday",
        value: "Friday",
        id: "day",
        val: "6.0",
        groupId: "Weekday",
    },
    {
        label: "Saturday",
        value: "Saturday",
        id: "day",
        val: "7.0",
        groupId: "Weekend",
    },
    {
        label: "Sunday",
        value: "Sunday",
        id: "day",
        val: "1.0",
        groupId: "Weekend",
    },
];


export function hideFlagCounter() {
    const flagCounterImage = document.querySelector('#flag-counter-img') as HTMLImageElement;
    if (flagCounterImage) {
        flagCounterImage.style.display = 'none';
    }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export function tracking(docRefID: string, page: string, expiry: string) {
    const websiteDocRef = doc(db, "t3dashboard", docRefID);

    const unique_counter = document.getElementById("visit-count");
    const total_counter = document.getElementById("total-count");

    const getUniqueCount = async () => {
        const docSnap = await getDoc(websiteDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
                setValue(data.uniqueCount);
            }
        }
    };

    const getTotalCount = async () => {
        const docSnap = await getDoc(websiteDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
                setTotal(data.totalCount);
            }
        }
    };

    const incrementCountUnique = async () => {
        await updateDoc(websiteDocRef, {
            uniqueCount: increment(1)
        });
        await getUniqueCount();
    };

    const incrementCountTotal = async () => {
        await updateDoc(websiteDocRef, {
            totalCount: increment(1)
        });
        await getTotalCount();
    };

    const setValue = (num: number) => {
        if (unique_counter) {
            unique_counter.innerText = `Unique visitors: ${num}`;
        }
    };

    const setTotal = (num: number) => {
        if (total_counter) {
            total_counter.innerText = `Total visits: ${num}`;
        }
    };

    if (localStorage.getItem(page) == null) {
        incrementCountUnique()
            .then(() => {
                localStorage.setItem(page, "true");
            })
            .catch((err) => console.log(err));
    } else {
        getUniqueCount().catch((err) => console.log(err));
    }

    if (localStorage.getItem(expiry) == null) {
        incrementCountTotal().then(() => {
            localStorage.setItem(expiry, (Date.now() + 60000 * 120).toString());
        });
    } else if (new Date().getTime() > Number(localStorage.getItem(expiry))) {
        incrementCountTotal().then(() => {
            localStorage.setItem(expiry, (Date.now() + 60000 * 120).toString());
        });
    } else {
        getTotalCount().catch((err) => console.log(err));
    }
}