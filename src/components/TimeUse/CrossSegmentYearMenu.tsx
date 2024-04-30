import React, { useState, useEffect, useRef } from 'react';
import Select, { SingleValue } from 'react-select';
import { useMediaQuery } from 'react-responsive';
import { weekOption, ActivityOption, YearOption, ActivityLocationOption } from '../Types';
import { WeekOptions, ActivityOptions, DataProvider } from '../../utils/Helpers';
import '../../css/menu.scss'
import '../../App.css';
import { max } from 'd3';


const CrossSegmentYearMenu: React.FC<{ onSelectionChange: (selections: { week: weekOption, activity: ActivityOption, activityLocation: ActivityLocationOption, startYear: string, endYear: string }) => void }> = ({ onSelectionChange }) => {

    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]);
    const [activityValue, setActivityValue] = useState<ActivityOption>(ActivityOptions[3]);
    const [activityLocationValue, setActivityLocationValue] = useState<ActivityLocationOption>({ label: "All", value: "All" });
    const [isMaxYearLoaded, setIsMaxYearLoaded] = useState(false);
    const [startYear, setStartYear] = useState<YearOption>({ label: '', value: '' });
    const [endYear, setEndYear] = useState<YearOption>({ label: '', value: '' });
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
    const [startYearOptions, setStartYearOptions] = useState<YearOption[]>([]);
    const [activityDropdownOptions, setActivityDropdownOptions] = useState<ActivityOption[]>([]);

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
            onSelectionChange({ week: weekValue, activity: activityValue, activityLocation: activityLocationValue, startYear: startYear.value, endYear: endYear.value });
        }
    }, [isMaxYearLoaded, weekValue, activityValue, activityLocationValue, startYear, endYear, onSelectionChange]);

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

    const handleActivityChange = (selectedOption: SingleValue<ActivityOption>) => {
        if (selectedOption) {
            setActivityValue(selectedOption);
        }
    };

    const handleActivityLocationChange = (selectedOption: SingleValue<ActivityLocationOption>) => {
        if (selectedOption) {
            setActivityLocationValue(selectedOption);
        }
    };

    const isStartYearOptionDisabled = (option: YearOption): boolean => {
        return endYear.value ? parseInt(option.value) > parseInt(endYear.value) : false;
    };

    const isEndYearOptionDisabled = (option: YearOption): boolean => {
        return startYear.value ? parseInt(option.value) < parseInt(startYear.value) : false;
    };

    const sortedActivityOptions = [...ActivityOptions].sort((a, b) => { // Creating a copy to prevent mutating the original array as it is imported from a different file
        return a.label.localeCompare(b.label);
    });

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
        const menuHeader = document.querySelector('#timeuse-csa-year-menu-header') as HTMLElement;
        const dropdownsContainer = document.querySelector('#timeuse-csa-year-dropdowns-container') as HTMLElement;

        if (menuHeader && dropdownsContainer) {
            const menuHeaderRight = menuHeader.getBoundingClientRect().left;
            const dropdownsLeft = dropdownsContainer.getBoundingClientRect().left;
            const width = dropdownsLeft - menuHeaderRight - 310; //Slight offset to account for the title text and character diffences between the two headers

            menuHeader.style.setProperty('--dotted-line-width', `${width}px`);
        }
    }, [activityValue]);

    useEffect(() => {
        const activityDropdownOptions = [
            ...sortedActivityOptions.map(option => ({
                label: option.label,
                value: option.label,
                inHome: option.inHome,
                outHome: option.outHome
            })),
            { label: "All", value: "All", inHome: "All", outHome: "All" }
        ];

        setActivityDropdownOptions(activityDropdownOptions);
        setActivityValue(activityDropdownOptions[0]);
    }, []);

    // setActivityValue(activityDropdownOptions[0]);

    const activityLocationDropdownOptions = [
        { label: "All", value: "All" },
        { label: "In home", value: "In-home" },
        { label: "Out of home", value: "Out-home" }
    ];

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

    const customStylesForActivityDropdown = {
        control: (provided: any) => ({
            ...provided,
            border: '1px solid #ced4da',
            borderRadius: '0.29rem',
            minHeight: '36px',
            minWidth: '220px',
            fontSize: '14px',
        }),
        option: (provided: any) => ({
            ...provided,
            fontSize: '13.5px' // Smaller font size for options
        })
    };


    return (
        <div className="year-menu-container" style={{ padding: '5px 20px' }}>
            <div className='menu-header' id='timeuse-csa-year-menu-header'>
                <h4 className="fw-bold-menu">Cross Segment Analysis</h4>
                <div className="dropdowns-container" id='timeuse-csa-year-dropdowns-container'>
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
                    <label className="segment-label">Activity:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={activityValue}
                        onChange={handleActivityChange}
                        options={activityDropdownOptions}
                        isSearchable={true}
                        styles={customStylesForActivityDropdown}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={200}
                    />
                    {isDesktopOrLaptop && (
                        <>
                            <label className='segment-label'>Activity location:</label>
                            <Select
                                className='dropdown-select'
                                classNamePrefix='dropdown-select'
                                onMenuOpen={scrollToSelectedOption}
                                value={activityLocationValue}
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
            {!isDesktopOrLaptop && (
                <div className="dropdowns-container" style={{ padding: '5px 0 0', justifyContent: "flex-end", alignItems: "center" }}>
                    <label className='segment-label'>Activity location:</label>
                    <Select
                        className='dropdown-select'
                        classNamePrefix='dropdown-select'
                        onMenuOpen={scrollToSelectedOption}
                        value={activityLocationValue}
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