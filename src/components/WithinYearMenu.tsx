import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { max } from 'd3';
import { weekOption, YearOption, YearMenuProps } from './Types';
import { WeekOptions, DataProvider } from '../utils/Helpers';
import '../css/menu.scss';
import '../App.css';



const YearMenu: React.FC<YearMenuProps> = ({ onSelectionChange }) => {

    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]);
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
    const [selectedYear, setSelectedYear] = useState<YearOption>({ label: "", value: "" });
    const [isMaxYearLoaded, setIsMaxYearLoaded] = useState(false);

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
            onSelectionChange({ week: weekValue, year: selectedYear.value });
            setIsMaxYearLoaded(false);
        }
    }, [isMaxYearLoaded, weekValue, selectedYear, onSelectionChange]);

    const handleWeekChange = (selectedOption: SingleValue<weekOption>) => {
        if (selectedOption) {
            setWeekValue(selectedOption);
            onSelectionChange({ week: selectedOption, year: selectedYear.value });
        }
    };

    const handleYearChange = (selectedOption: SingleValue<YearOption>) => {
        if (selectedOption) {
            setSelectedYear(selectedOption);
            onSelectionChange({ week: weekValue, year: selectedOption.value });
        }
    };

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