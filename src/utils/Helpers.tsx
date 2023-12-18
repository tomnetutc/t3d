import { Option, GroupedOption, weekOption, GroupedOptions, DataRow, ActivityOption, YearlyActivityData } from "../components/Types";
import { csv } from "d3";
import { DSVRowString } from "d3-dsv";
import firebase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import firebaseConfig from "../firebaseConfig";


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
                this.data = await csv('https://raw.githubusercontent.com/tomnetutc/t3_datahub/main/public/df.csv');
            } catch (error) {
                console.error('Error loading data:', error);
                throw error;
            }
        }
        return this.data;
    }
}

export const getTotalRowsForYear = async (year: string) => {
    try {
        const data = await DataProvider.getInstance().loadData();
        return data.filter(row => row.year === year).length;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
};

export function filterCriteria(selectedOptions: Option[], year: string, weekOption: weekOption) {
    return function (row: DSVRowString<string>) {
        if (year && row['year'] !== year) return false;

        if (weekOption.value !== "All") {
            if (row[weekOption.id] !== weekOption.val) return false;
        }

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



export const fetchAndFilterData = async (selectedOptions: Option[], year: string, weekOption: weekOption) => {
    try {
        const data = await DataProvider.getInstance().loadData();
        return data.filter(filterCriteria(selectedOptions, year, weekOption));
    } catch (error) {
        console.error('Error fetching and filtering data:', error);
        return [];
    }
};

export const fetchAndFilterDataForBtwYearAnalysis = async (selectedOptions: Option[], weekOption: weekOption) => {
    try {
        const data = await DataProvider.getInstance().loadData();
        return data.filter(filterCriteria(selectedOptions, "", weekOption));
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

export const calculateYearlyActivityAverages = (data: DataRow[], selectedActivity: ActivityOption): any[] => {
    const yearlyData: Record<string, YearlyActivityData> = {};

    data.forEach(row => {
        const year = row.year;
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
    });

    return Object.entries(yearlyData).map(([year, { inHome, outHome, count }]) => ({
        year,
        inHomeAvg: (inHome / count).toFixed(1),
        outHomeAvg: (outHome / count).toFixed(1)
    }));
};


export const BubbleMapValueToRange = (value: number, minData: number, maxData: number, minSize: number, maxSize: number) => {
    const logRatio = (Math.log(value) - Math.log(minData)) / (Math.log(maxData) - Math.log(minData));

    const size = logRatio * (maxSize - minSize) + minSize;
    return Math.max(minSize, Math.min(size, maxSize));
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
        value: "Employed",
        label: "Employed",
        id: "employed",
        val: "1.0",
        groupId: "Employment",
    },
    {
        value: "Unemployed",
        label: "Unemployed",
        id: "employed",
        val: "0.0",
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
        label: "Employment status",
        options: EmploymentStatusOptions.map((obj) => ({
            ...obj,
            groupName: "Employment status",
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
        val: "0.0",
        groupId: "Week",
    },
    {
        value: "Weekend",
        label: "Weekend",
        id: "weekday",
        val: "1.0",
        groupId: "Week",
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
        label: "Data Codes (other)",
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

export function tracking() {
    const websiteDocRef = doc(db, "websites", "FV2dPUi6VGoHSjRtDCLB");

    //   const unique_counter = document.getElementById("visit-count");
    //   const total_counter = document.getElementById("total-count");

    const getUniqueCount = async () => {
        const docSnap = await getDoc(websiteDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            //   if (data) {
            //     setValue(data.uniqueCount);
            //   }
        }
    };

    const getTotalCount = async () => {
        const docSnap = await getDoc(websiteDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            //   if (data) {
            //     setTotal(data.totalCount);
            //   }
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

    //   const setValue = (num: number) => {
    //     if (unique_counter) {
    //       unique_counter.innerText = `Unique visitors: ${num}`;
    //     }
    //   };

    //   const setTotal = (num: number) => {
    //     if (total_counter) {
    //       total_counter.innerText = `Total visits: ${num}`;
    //     }
    //   };

    if (localStorage.getItem("hasVisited") == null) {
        incrementCountUnique()
            .then(() => {
                localStorage.setItem("hasVisited", "true");
            })
            .catch((err) => console.log(err));
    } else {
        getUniqueCount().catch((err) => console.log(err));
    }

    if (localStorage.getItem("expiry") == null) {
        incrementCountTotal().then(() => {
            localStorage.setItem("expiry", (Date.now() + 60000 * 120).toString());
        });
    } else if (new Date().getTime() > Number(localStorage.getItem("expiry"))) {
        incrementCountTotal().then(() => {
            localStorage.setItem("expiry", (Date.now() + 60000 * 120).toString());
        });
    } else {
        getTotalCount().catch((err) => console.log(err));
    }
}



