import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { weekOption, YearOption, Option } from '../Types';
import { WeekOptions, DataProvider, WorkArrangementOptions, EmploymentStatusOptions } from '../../utils/Helpers';
import '../../css/menu.scss'
import '../../App.css';
import { max } from 'd3';
import { useMediaQuery } from 'react-responsive';


const CrossSegmentYearMenu: React.FC<{ onSelectionChange: (selections: { week: weekOption, workArrangement: Option, employment: Option, startYear: string, endYear: string }) => void }> = ({ onSelectionChange }) => {

    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[1]); // Default to Weekday option
    const [workArrangementValue, setWorkArrangementValue] = useState<Option>(WorkArrangementOptions[3]);
    const [employmentValue, setEmploymentValue] = useState<Option>({ label: "All", value: "All", id: "All", val: "All", groupId: "All" });
    const [isMaxYearLoaded, setIsMaxYearLoaded] = useState(false);
    const [startYear, setStartYear] = useState<YearOption>({ label: '', value: '' });
    const [endYear, setEndYear] = useState<YearOption>({ label: '', value: '' });
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
    const [startYearOptions, setStartYearOptions] = useState<YearOption[]>([]);

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
            onSelectionChange({ week: weekValue, workArrangement: workArrangementValue, employment: employmentValue, startYear: startYear.value, endYear: endYear.value });
        }
    }, [isMaxYearLoaded, weekValue, workArrangementValue, employmentValue, startYear, endYear, onSelectionChange]);

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

    const handleWorkArragementChange = (selectedOption: SingleValue<Option>) => {
        if (selectedOption) {
            setWorkArrangementValue(selectedOption);
        }
    };

    const handleEmploymentChange = (selectedOption: SingleValue<Option>) => {
        if (selectedOption) {
            setEmploymentValue(selectedOption);
        }
    };

    const isStartYearOptionDisabled = (option: YearOption): boolean => {
        return endYear.value ? parseInt(option.value) > parseInt(endYear.value) : false;
    };

    const isEndYearOptionDisabled = (option: YearOption): boolean => {
        return startYear.value ? parseInt(option.value) < parseInt(startYear.value) : false;
    };

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1700px)'
    });

    const sortedWorkArrangementOptions = [...WorkArrangementOptions].filter(option => option.id != "unemployed") // Creating a copy to prevent mutating the original array as it is imported from a different file
        .sort((a, b) => {
            return a.label.localeCompare(b.label);
        });

    const sortedEmploymentOptions = [...EmploymentStatusOptions].filter(option => option.id != "unemployed") // Creating a copy to prevent mutating the original array as it is imported from a different file
        .sort((a, b) => {
            return a.label.localeCompare(b.label);
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
    }, [workArrangementValue]);

    const workArrangementDropdownOptions = [
        ...sortedWorkArrangementOptions.map(option => ({
            label: option.label,
            value: option.label,
            id: option.id,
            val: option.val,
            groupId: option.groupId
        })),
        { label: "All", value: "All", id: "All", val: "All", groupId: "All" }

    ];

    const employmentDropdownOptions = [
        { label: "All", value: "All", id: "All", val: "All", groupId: "All" },
        ...sortedEmploymentOptions.map(option => ({
            label: option.label,
            value: option.label,
            id: option.id,
            val: option.val,
            groupId: option.groupId
        }))
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
                    <label className="segment-label">Work Arrangement:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={workArrangementValue}
                        onChange={handleWorkArragementChange}
                        options={workArrangementDropdownOptions}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={200}
                    />
                    {isDesktopOrLaptop && (
                        <>
                            <label className="segment-label">Employment:</label>
                            <Select
                                className="dropdown-select"
                                classNamePrefix="dropdown-select"
                                onMenuOpen={scrollToSelectedOption}
                                value={employmentValue}
                                onChange={handleEmploymentChange}
                                options={employmentDropdownOptions}
                                isSearchable={true}
                                styles={customStyles}
                                components={{ DropdownIndicator: CustomDropdownIndicator }}
                                menuPosition={'fixed'}
                                maxMenuHeight={200}
                            />
                        </>
                    )}
                </div>
            </div>
            {!isDesktopOrLaptop && (
                <div className="dropdowns-container" style={{ padding: '5px 0 0', justifyContent: "flex-end", alignItems: "center" }}>
                    <label className="segment-label">Employment:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={employmentValue}
                        onChange={handleEmploymentChange}
                        options={employmentDropdownOptions}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={200}
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