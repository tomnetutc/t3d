import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { max } from 'd3';
import { weekOption, YearOption, YearMenuProps, Option } from './Types';
import { WeekOptions, DataProvider, EmploymentStatusOptions } from '../utils/Helpers';
import '../css/menu.scss';
import '../App.css';



const YearMenu: React.FC<YearMenuProps> = ({ onSelectionChange, callingComponent }) => {

    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]);
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
    const [selectedYear, setSelectedYear] = useState<YearOption>({ label: "", value: "" });
    const [employmentValue, setEmploymentValue] = useState<Option>({ label: "All", value: "All", id: "All", val: "All", groupId: "All" });
    const [isMaxYearLoaded, setIsMaxYearLoaded] = useState(false);

    //This is done to set the default value of week to "Weekday" when the calling component is "Telework"
    useEffect(() => {
        if (callingComponent === "Telework") {
            setWeekValue(WeekOptions[1]);
        }
    }, [callingComponent]);

    useEffect(() => {
        const cacheKey = "YearDataCache";
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const { maxYear, expiry } = JSON.parse(cachedData);
            if (new Date().getTime() < expiry) {
                setYearDropdownOptions(maxYear);
                return;
            }
        }

        async function loadDataAndCache() {
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

        loadDataAndCache();


    }, []);

    function setYearDropdownOptions(maxYear: any) {
        const years = Array.from({ length: maxYear - 2002 }, (v, i) => {
            const year = (2003 + i).toString();
            return { label: year, value: year };
        }).reverse();
        setYearOptions(years);
        setSelectedYear({ label: maxYear.toString(), value: maxYear.toString() }); // Set default to maxYear
        setIsMaxYearLoaded(true);
    }

    const constructSelectionObject = (week: weekOption, year: YearOption, employment: Option | null = null) => {
        const selectionObject: {
            week: weekOption;
            year: string;
            employment?: Option;
        } = { week: week, year: year.value };

        if (callingComponent === 'Telework' && employment) {
            selectionObject.employment = employment;
        }
        return selectionObject;
    };

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
        const menuHeader = document.querySelector('#timeuse-wtn-year-menu-header') as HTMLElement;
        const dropdownsContainer = document.querySelector('#timeuse-wtn-year-dropdowns-container') as HTMLElement;

        if (menuHeader && dropdownsContainer) {
            const menuHeaderRight = menuHeader.getBoundingClientRect().left;
            const dropdownsLeft = dropdownsContainer.getBoundingClientRect().left;
            const width = dropdownsLeft - menuHeaderRight - 270; //Slight offset to account for the title text and character diffences between the two headers

            menuHeader.style.setProperty('--dotted-line-width', `${width}px`);
        }
    }, []);

    useEffect(() => {
        if (isMaxYearLoaded) {
            const selectionObject = constructSelectionObject(weekValue, selectedYear, employmentValue);
            onSelectionChange(selectionObject);
            setIsMaxYearLoaded(false);
        }
    }, [isMaxYearLoaded, weekValue, selectedYear, onSelectionChange]);

    const handleWeekChange = (selectedOption: SingleValue<weekOption>) => {
        if (selectedOption) {
            setWeekValue(selectedOption);
            const selectionObject = constructSelectionObject(selectedOption, selectedYear, employmentValue);
            onSelectionChange(selectionObject);
        }
    };

    const handleYearChange = (selectedOption: SingleValue<YearOption>) => {
        if (selectedOption) {
            setSelectedYear(selectedOption);
            const selectionObject = constructSelectionObject(weekValue, selectedOption, employmentValue);
            onSelectionChange(selectionObject);
        }
    };

    const handleEmploymentChange = (selectedOption: SingleValue<Option>) => {
        if (selectedOption) {
            setEmploymentValue(selectedOption);
            const selectionObject = constructSelectionObject(weekValue, selectedYear, selectedOption);
            onSelectionChange(selectionObject);
        }
    };

    //Only for Telework Emplotment dropdown
    const sortedEmploymentOptions = [...EmploymentStatusOptions].filter(option => option.id != "unemployed") // Creating a copy to prevent mutating the original array as it is imported from a different file
        .sort((a, b) => {
            return a.label.localeCompare(b.label);
        });

    //Only for Telework Emplotment dropdown
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
            <div className='menu-header' id='timeuse-wtn-year-menu-header'>
                <h4 className="fw-bold-menu">Within Year Analysis</h4>
                <div className="dropdowns-container" id='timeuse-wtn-year-dropdowns-container'>
                    <label className="segment-label">Day:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={weekValue}
                        onChange={handleWeekChange}
                        options={WeekOptions}
                        isSearchable={false}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={120}
                    />
                    <label className="segment-label">Year:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        onMenuOpen={scrollToSelectedOption}
                        value={selectedYear}
                        onChange={handleYearChange}
                        options={yearOptions}
                        isSearchable={false}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={170}
                    />
                    {callingComponent === 'Telework' && (
                        <>
                            <label className="segment-label">Employment:</label>
                            <Select
                                className="dropdown-select"
                                classNamePrefix="dropdown-select"
                                onMenuOpen={scrollToSelectedOption} // Assuming this is defined elsewhere
                                value={employmentValue}
                                onChange={handleEmploymentChange}
                                options={employmentDropdownOptions}
                                isSearchable={false}
                                styles={customStyles} // Assuming customStyles is defined elsewhere
                                components={{ DropdownIndicator: CustomDropdownIndicator }} // Assuming CustomDropdownIndicator is defined elsewhere
                                menuPosition={'fixed'}
                                maxMenuHeight={200}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YearMenu;

const CustomDropdownIndicator: React.FC<any> = () => (
    <div className="dropdown-indicator">
        <svg width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
        </svg>
    </div>
);