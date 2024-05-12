import React, { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import { Option } from './Types';
import { groupedOptions } from '../utils/Helpers';
import '../css/menu.scss';
import Select from 'react-select';
import Infobox from './InfoBox/InfoBox';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const CrossSegmentMenu: React.FC<{ onOptionChange: (options: Option[][]) => void; toggleState: (includeDecember: boolean) => void; filterOptionsForTelework?: boolean; updatedSelections: Option[][] }> = ({ onOptionChange, toggleState, filterOptionsForTelework = false, updatedSelections }) => {
    const [selectedOptions, setSelectedOptions] = useState<Array<Option | null>>([null, null, null]);
    const [submissions, setSubmissions] = useState<Array<Option[]>>([[]]);
    const [includeDecember, setIncludeDecember] = useState(true);
    const [isToggling, setIsToggling] = useState(false); // To track toggle cooldown

    useEffect(() => {
        onOptionChange(submissions);
    }, [submissions]);

    useEffect(() => {
        setSubmissions(updatedSelections);
    }, [updatedSelections]);

    const handleChange = (index: number, option: Option | null) => {
        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions[index] = option;
        setSelectedOptions(updatedSelectedOptions);
    };

    // Filter out the "Work arrangement" and "Employment" options for the Telework Menu component
    const filteredGroupedOptions = filterOptionsForTelework ?
        groupedOptions.filter(group => group.label !== "Work arrangement" && group.label !== "Employment") :
        groupedOptions;

    const handleReset = () => {
        setSelectedOptions([null, null, null]);
    };

    const handleSubmit = () => {
        if (selectedOptions.some(option => option !== null) && submissions.length < 5) {
            setSubmissions(prev => [...prev, selectedOptions.filter(Boolean) as Option[]]);
            setSelectedOptions([null, null, null]);
            onOptionChange(submissions);
        }
    };

    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isToggling) {
            setIncludeDecember(event.target.checked);
            toggleState(event.target.checked);
            setIsToggling(true);

            // Clear the toggle cooldown after a delay
            setTimeout(() => {
                setIsToggling(false);
            }, 500); // 0.5 second delay, adjust as needed
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
        <div className="dropdown-wrapper">
            <Select
                className="dropdown-select"
                classNamePrefix="dropdown-select"
                onMenuOpen={scrollToSelectedOption}
                value={selectedOptions[index]}
                onChange={(selectedOption) => handleChange(index, selectedOption)}
                options={filteredGroupedOptions.map(group => ({
                    label: group.label,
                    options: group.options.map(option => ({
                        ...option,
                        isDisabled: isOptionSelectedInOtherDropdown(option, index),
                    })),
                }))}
                isSearchable={true}
                styles={customStyles}
                components={{
                    DropdownIndicator: CustomDropdownIndicator,
                }}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                maxMenuHeight={200}
                isDisabled={submissions.length === 5}
                placeholder="Select attribute"
            />
        </div>
    );

    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 40,
        height: 25,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#198754',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 20,
            height: 20,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    return (
        <div className="menu-container">
            <div className="menu-header" style={{ position: 'relative' }}> {/* Ensure the parent is positioned relatively */}
                <label className="segment-label" style={{ marginRight: "0.5rem" }}>Add a segment:</label>

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
                        variant='success'
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={submissions.length == 5 || !selectedOptions.some(option => option !== null)}
                    >
                        Add
                    </Button>
                </div>
                <div className="button-container">
                    <Button size="sm" onClick={handleReset} className="reset-button" variant="danger" disabled={submissions.length == 5 || !selectedOptions.some(option => option !== null)} style={{ marginLeft: '10px' }}>
                        Reset
                    </Button>
                </div>
                <Infobox style={{ display: 'flex', position: 'relative', padding: 12 }}>
                    <p>Select up to three attributes to define and add a specific population segment for comparison purposes. The default view shows data for ‘all’ individuals aged 15 and older. </p>
                </Infobox>

                <Box display="flex" justifyContent="flex-end" alignItems="center" style={{ marginLeft: 'auto' }}>
                    <Box marginRight={0.2} className="segment-label">Include December:</Box>
                    <IOSSwitch
                        sx={{ m: 1 }}
                        size="small"
                        checked={includeDecember}
                        onChange={handleToggleChange} />
                </Box>
                <Infobox style={{ display: 'flex', position: 'relative', padding: '3px' }}>
                    <p>Exclude or include the respondents surveyed in December from the analysis.</p>
                </Infobox>
            </div>
        </div>

    );

};
export default CrossSegmentMenu;


const CustomDropdownIndicator: React.FC<{}> = () => (
    <div className="dropdown-indicator">
        <svg width="15" height="15" fill="currentColor" className="bi bi-chevron-down" viewBox="-2 -2 21 21">
            <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
        </svg>
    </div>
);