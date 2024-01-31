import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import { Option } from './Types';
import { groupedOptions } from '../utils/Helpers';
import '../css/menu.scss';
import Select from 'react-select';

const Menu: React.FC<{ onOptionChange: (options: Option[]) => void; }> = ({ onOptionChange }) => {
    const [selectedOptions, setSelectedOptions] = useState<Array<Option | null>>([null, null, null]);
    const [isAllSelected, setIsAllSelected] = useState(true);

    const handleChange = (index: number, option: Option | null) => {
        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions[index] = option;
        setSelectedOptions(updatedSelectedOptions);
    };

    const handleAllSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAllSelected(event.target.checked);
        if (event.target.checked) {
            setSelectedOptions([null, null, null]);
        }
    };

    const handleReset = () => {
        setSelectedOptions([null, null, null]);
        setIsAllSelected(true);
        onOptionChange([] as Option[]);
    };

    const handleSubmit = () => {
        if (isAllSelected || selectedOptions.some(option => option !== null)) {
            onOptionChange(isAllSelected ? [] : selectedOptions.filter(Boolean) as Option[]);
        } else {
            alert("Please select an option or check 'All'");
        }
    };

    const isOptionSelectedInOtherDropdown = (option: Option, currentIndex: number) => {
        return selectedOptions.some((selectedOption, index) => {
            return selectedOption && selectedOption.value === option.value && index !== currentIndex;
        });
    };

    const scrollToSelectedOption = () => {
        setTimeout(() => {
            const selectedEl = document.querySelector(".dropdown-select__option--is-selected");
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
            }
        }, 15);
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            border: '1px solid #ced4da',
            borderRadius: '0.29rem',
            minHeight: '36px',
            fontSize: '13.5px',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#6c757d'
        }),
        option: (provided: any) => ({
            ...provided,
            fontSize: '13.5px' // Smaller font size for options
        })
    };

    const renderDropdown = (index: number) => (
        <div className="dropdown-wrapper" onClick={() => isAllSelected && setIsAllSelected(false)}>
            <Select
                className="dropdown-select"
                classNamePrefix="dropdown-select"
                onMenuOpen={scrollToSelectedOption}
                value={selectedOptions[index]}
                onChange={(selectedOption) => handleChange(index, selectedOption)}
                options={groupedOptions.map(group => ({
                    label: group.label,
                    options: group.options.map(option => ({
                        ...option,
                        isDisabled: isAllSelected || isOptionSelectedInOtherDropdown(option, index),
                    })),
                }))}
                isSearchable={false}
                styles={customStyles}
                components={{
                    DropdownIndicator: CustomDropdownIndicator,
                }}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                maxMenuHeight={200}
                isDisabled={isAllSelected}
                placeholder="Select attribute"
            />
        </div>
    );


    return (
        <div className="menu-container">
            <div className="menu-header">
                <label className="segment-label">Select segment:</label>
                <div className="all-select-checkbox">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleAllSelectChange}
                    />
                    <span className="all-select-label">All</span>
                </div>
                <div className="dropdowns-container">
                    {selectedOptions.map((_, index) => (
                        <div key={index} className="dropdown-wrapper">
                            {renderDropdown(index)}
                        </div>
                    ))}
                </div>
                <div className="button-container">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={!isAllSelected && !selectedOptions.some(option => option !== null)}
                    >
                        Apply
                    </Button>
                    <Button size="sm" onClick={handleReset} className="reset-button" variant="danger" style={{ marginLeft: '10px', backgroundColor: '#E74C3C' }}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );

};

export default Menu;

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
