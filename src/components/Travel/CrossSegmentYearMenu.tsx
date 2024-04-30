import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { weekOption, TripPurposeOption, YearOption, TravelModeOption, AnalysisTypeOption } from '../Types';
import { WeekOptions, TripPurposeOptions, DataProvider, TravelModeOptions } from '../../utils/Helpers';
import '../../css/menu.scss';
import '../../App.css';
import { max } from 'd3';
import { Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';



const CrossSegmentYearMenu: React.FC<{ onSelectionChange: (selections: { week: weekOption, optionValue: TripPurposeOption | TravelModeOption, activeOption: string, analysisType: AnalysisTypeOption, startYear: string, endYear: string }) => void }> = ({ onSelectionChange }) => {

    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]);
    const [startYear, setStartYear] = useState<YearOption>({ label: '', value: '' });
    const [endYear, setEndYear] = useState<YearOption>({ label: '', value: '' });
    const [isMaxYearLoaded, setIsMaxYearLoaded] = useState(false);
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
    const [startYearOptions, setStartYearOptions] = useState<YearOption[]>([]);
    const [tripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<TripPurposeOption[]>([]);
    const [travelModeDropdownOptions, setTravelModeDropdownOptions] = useState<TravelModeOption[]>([]);
    const [activityLocationDropdownOptions, setActivityLocationDropdownOptions] = useState<AnalysisTypeOption[]>([]);
    const [activeOptionType, setActiveOptionType] = useState("Trip purpose");
    const [optionValue, setOptionValue] = useState<TripPurposeOption | TravelModeOption>(TripPurposeOptions[0]);
    const [dropdownOptions, setDropdownOptions] = useState<TripPurposeOption[] | TravelModeOption[]>(TripPurposeOptions); // Default to Trip Purpose Options
    const [dropdownLabel, setDropdownLabel] = useState<string>("Trip purpose");
    const [analysisType, setAnalysisType] = useState<AnalysisTypeOption>({ label: "", value: "" });

    useEffect(() => {
        const allTripPurposeOption = TripPurposeOptions.find(option => option.label === "All");

        const sortedTripPurposeOptions = TripPurposeOptions
            .filter(option => option.label !== "All")
            .sort((a, b) => a.label.localeCompare(b.label));

        // Trip Purpose Drodwdown Options
        const tripPurposeDropdownOptions = allTripPurposeOption ? [allTripPurposeOption, ...sortedTripPurposeOptions] : sortedTripPurposeOptions;

        setTripPurposeDropdownOptions(tripPurposeDropdownOptions);

        const allTravelModeOption = TravelModeOptions.find(option => option.label === "All");

        const sortedTravelModeOptions = TravelModeOptions
            .filter(option => option.label !== "All")
            .sort((a, b) => a.label.localeCompare(b.label));

        // Travel Mode Dropdown Options
        const travelModeDropdownOptions = allTravelModeOption ? [allTravelModeOption, ...sortedTravelModeOptions] : sortedTravelModeOptions;

        const analysisTypeDropdownOptions = [
            { label: "Number of trips", value: "NumberTrips" },
            { label: "Travel duration", value: "TravelDuration" }
        ];

        setActivityLocationDropdownOptions(analysisTypeDropdownOptions);
        setTravelModeDropdownOptions(travelModeDropdownOptions);
        setDropdownOptions(tripPurposeDropdownOptions); // Default to Trip Purpose Options
        setOptionValue(tripPurposeDropdownOptions[0]); // Default to "All" option for Trip Purpose
        setAnalysisType(analysisTypeDropdownOptions[0]); //Default to "Number of trips" option for Analysis Type
    }, []);

    function setYearDropdownOptions(maxYear: any) {
        const startYear = 2003;
        const years = Array.from({ length: maxYear - startYear + 1 }, (_, i) => ({
            label: (startYear + i).toString(),
            value: (startYear + i).toString()
        })).reverse();

        // Create a copy of the years array and then reverse it
        const reversedYears = [...years].reverse();

        setYearOptions(years);
        setStartYearOptions(reversedYears);
        setStartYear(years[years.length - 1]);
        setEndYear(years[0]);
        setIsMaxYearLoaded(true);
    }

    async function loadCache() {
        const cacheKey = "YearDataCache";
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const { maxYear, expiry } = JSON.parse(cachedData);
            if (new Date().getTime() < expiry) {
                setYearDropdownOptions(maxYear);
                return;
            }
        }
        await fetchNewDataAndCache(cacheKey);
    }

    async function fetchNewDataAndCache(cacheKey: string) {
        try {
            const data = await DataProvider.getInstance().loadData();
            const maxYear = max(data, (d) => d.year);
            if (maxYear) {
                const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                localStorage.setItem(cacheKey, JSON.stringify({ maxYear, expiry }));
                setYearDropdownOptions(maxYear);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        loadCache();
    }, []);

    useEffect(() => {
        if (isMaxYearLoaded) {
            onSelectionChange({ week: weekValue, optionValue: optionValue, activeOption: activeOptionType, analysisType: analysisType, startYear: startYear.value, endYear: endYear.value });
        } // optionValue: This can now be either a TripPurposeOption or a TravelModeOption
    }, [isMaxYearLoaded, weekValue, optionValue, activeOptionType, analysisType, startYear, endYear, onSelectionChange]);

    const handleStartYearChange = (selectedOption: SingleValue<YearOption>) => {
        if (selectedOption) {
            setStartYear(selectedOption);
        }
    };

    const handleEndYearChange = (selectedOption: SingleValue<YearOption>) => {
        if (selectedOption) {
            setEndYear(selectedOption);
        }
    };

    const handleWeekChange = (selectedOption: SingleValue<weekOption>) => {
        if (selectedOption) {
            setWeekValue(selectedOption);
        }
    };

    const isStartYearOptionDisabled = (option: YearOption): boolean => {
        return endYear.value ? parseInt(option.value) > parseInt(endYear.value) : false;
    };

    const isEndYearOptionDisabled = (option: YearOption): boolean => {
        return startYear.value ? parseInt(option.value) < parseInt(startYear.value) : false;
    };


    // Handle option type change based on the button clicked
    const handleOptionTypeChange = (selectedType: string) => {
        setActiveOptionType(selectedType); // Update active state

        // Update dropdown options and label based on selected type
        if (selectedType === "Trip purpose") {
            setDropdownOptions(tripPurposeDropdownOptions);
            setDropdownLabel("Trip purpose");
            setOptionValue(tripPurposeDropdownOptions[0]);
        } else if (selectedType === "Travel mode") {
            setDropdownOptions(travelModeDropdownOptions);
            setDropdownLabel("Travel mode");
            setOptionValue(travelModeDropdownOptions[0]);
        }

        setWeekValue(WeekOptions[0]); // Reset week value
        setStartYear(yearOptions[yearOptions.length - 1]); // Reset start year
        setEndYear(yearOptions[0]); // Reset end year
    };

    // Handle dropdown value change based on active option type
    const handleDropdownValueChange = (selectedOption: SingleValue<TripPurposeOption | TravelModeOption>) => {
        setOptionValue(selectedOption as TripPurposeOption | TravelModeOption);
    };

    const handleActivityLocationChange = (selectedOption: SingleValue<AnalysisTypeOption>) => {
        setAnalysisType(selectedOption as AnalysisTypeOption);
    };

    const activeButtonStyle = {
        backgroundColor: '#C4F5B0',
        color: 'black',
        borderColor: 'black'
    };

    // Default button style
    const defaultButtonStyle = {
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black'
    };

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1700px)'
    });

    // Scroll to the selected option when the dropdown is opened
    const scrollToSelectedOption = () => {
        setTimeout(() => {
            const selectedEl = document.querySelector(".dropdown-select__option--is-selected");
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
            }
        }, 15);
    };

    // Set the width of the dotted line dynamically
    useEffect(() => {
        const menuHeader = document.querySelector('#travel-csa-year-menu-header') as HTMLElement;
        const dropdownsContainer = document.querySelector('#travel-csa-year-dropdowns-container') as HTMLElement;

        if (menuHeader && dropdownsContainer) {
            const menuHeaderRight = menuHeader.getBoundingClientRect().left;
            const dropdownsLeft = dropdownsContainer.getBoundingClientRect().left;
            const width = dropdownsLeft - menuHeaderRight - 310; //Slight offset to account for the title text and character diffences between the two headers

            menuHeader.style.setProperty('--dotted-line-width', `${width}px`);
        }
    }, [optionValue]);


    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            border: '1px solid #ced4da',
            borderRadius: '0.29rem',
            minHeight: '36px',
            fontSize: '14px',
        }),
        option: (provided: any) => ({
            ...provided,
            fontSize: '13.5px' // Smaller font size for options
        })
    };

    return (
        <div className="year-menu-container" style={{ padding: '5px 20px' }}>
            <div className='btw-menu-header' id='travel-csa-year-menu-header'>
                <div className="title-and-select">
                    <h4 className="fw-bold-menu">Cross Segment Analysis</h4>
                </div>
                <div className="dropdowns-container" id='travel-csa-year-dropdowns-container'>
                    <label className="segment-label">Start year:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={startYear}
                        onChange={handleStartYearChange}
                        options={startYearOptions}
                        isOptionDisabled={isStartYearOptionDisabled}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={170}
                    />
                    <label className="segment-label">End year:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={endYear}
                        onChange={handleEndYearChange}
                        options={yearOptions}
                        isOptionDisabled={isEndYearOptionDisabled}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={170}
                    />
                    <label className="segment-label">Day:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={weekValue}
                        onChange={handleWeekChange}
                        options={WeekOptions}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={120}
                    />
                    <label className="segment-label">{dropdownLabel}:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        value={optionValue as TripPurposeOption | TravelModeOption}
                        onChange={handleDropdownValueChange}
                        options={dropdownOptions}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={200}
                    />

                    {isDesktopOrLaptop && (
                        <>
                            <label className='segment-label'>Metric:</label>
                            <Select
                                className='dropdown-select'
                                classNamePrefix='dropdown-select'
                                onMenuOpen={scrollToSelectedOption}
                                value={analysisType}
                                onChange={handleActivityLocationChange}
                                options={activityLocationDropdownOptions}
                                isSearchable={true}
                                styles={customStyles}
                                components={{ DropdownIndicator: CustomDropdownIndicator }}
                                menuPosition={'fixed'}
                                maxMenuHeight={120}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className="options-container">
                <div className="buttons-container">
                    <Button
                        size="sm"
                        onClick={() => handleOptionTypeChange("Trip purpose")}
                        style={activeOptionType === "Trip purpose" ? activeButtonStyle : defaultButtonStyle}>
                        By trip purpose
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleOptionTypeChange("Travel mode")}
                        style={activeOptionType === "Travel mode" ? activeButtonStyle : defaultButtonStyle}>
                        By travel mode
                    </Button>
                </div>

                {!isDesktopOrLaptop && (
                    <div className="dropdowns-container" style={{ padding: '5px 0 0', justifyContent: "flex-end", alignItems: "center" }}>
                        <label className='segment-label'>Metric:</label>
                        <Select
                            className='dropdown-select'
                            classNamePrefix='dropdown-select'
                            onMenuOpen={scrollToSelectedOption}
                            value={analysisType}
                            onChange={handleActivityLocationChange}
                            options={activityLocationDropdownOptions}
                            isSearchable={true}
                            styles={customStyles}
                            components={{ DropdownIndicator: CustomDropdownIndicator }}
                            menuPosition={'fixed'}
                            maxMenuHeight={120}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrossSegmentYearMenu;

const CustomDropdownIndicator: React.FC<any> = () => (
    <div className="dropdown-indicator">
        <svg width="15" height="15" fill="currentColor" className="bi bi-chevron-down" viewBox="-2 -2 21 21">
            <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
        </svg>
    </div>
);