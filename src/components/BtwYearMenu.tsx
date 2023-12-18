import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { weekOption, ActivityOption } from './Types';
import { WeekOptions, ActivityOptions } from '../utils/Helpers';
import '../css/menu.scss';



const BtwYearMenu: React.FC<{ onSelectionChange: (selections: { week: weekOption, activity: ActivityOption }) => void }> = ({ onSelectionChange }) => {

    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]);
    const [activityValue, setActivityValue] = useState<ActivityOption>({ label: "All", value: "All", inHome: "All", outHome: "All" });

    useEffect(() => {
        onSelectionChange({ week: weekValue, activity: activityValue });
    }, [weekValue, activityValue, onSelectionChange]);

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

    const sortedActivityOptions = [...ActivityOptions].sort((a, b) => { // Creating a copy to prevent mutating the original array as it is imported from a different file
        return a.label.localeCompare(b.label);
    });

    const activityDropdownOptions = [
        { label: "All", value: "All", inHome: "All", outHome: "All" },
        ...sortedActivityOptions.map(option => ({
            label: option.label,
            value: option.label,
            inHome: option.inHome,
            outHome: option.outHome
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
        <div className="year-menu-container" style={{ padding: '0 20px' }}>
            <div className='menu-header'>
                <h4 className="fw-bold-menu">Between Year Analysis</h4>
                <div className="dropdowns-container">
                    <label className="segment-label">Day:</label>
                    <Select
                        className="dropdown-select"
                        value={weekValue}
                        onChange={handleWeekChange}
                        options={WeekOptions}
                        isSearchable={false}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={120}
                    />
                    <label className="segment-label">Activity:</label>
                    <Select
                        className="dropdown-select"
                        value={activityValue}
                        onChange={handleActivityChange}
                        options={activityDropdownOptions}
                        isSearchable={false}
                        styles={customStylesForActivityDropdown}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={200}
                    />
                </div>
            </div>
        </div>
    );
};

export default BtwYearMenu;

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