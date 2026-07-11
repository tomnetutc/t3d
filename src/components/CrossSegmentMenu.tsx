import React, { useEffect, useState } from 'react';
import { Option, GroupedOption } from './Types';
import { groupedOptions } from '../utils/Helpers';
import '../css/menu.scss';
import '../css/crosssegmentmodal.scss';
import Infobox from './InfoBox/InfoBox';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const MAX_SEGMENTS = 4; // user-defined segments; submissions[0] is the implicit "All" segment
const MAX_SUBMISSIONS = MAX_SEGMENTS + 1;

const CrossSegmentMenu: React.FC<{ onOptionChange: (options: Option[][]) => void; toggleState: (includeDecember: boolean) => void; filterOptionsForTelework?: boolean; updatedSelections: Option[][] }> = ({ onOptionChange, toggleState, filterOptionsForTelework = false, updatedSelections }) => {
    const [submissions, setSubmissions] = useState<Array<Option[]>>([[]]);
    const [includeDecember, setIncludeDecember] = useState(true);
    const [isToggling, setIsToggling] = useState(false); // To track toggle cooldown

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSels, setModalSels] = useState<Record<string, Set<string>>>({});

    useEffect(() => {
        onOptionChange(submissions);
    }, [submissions]);

    useEffect(() => {
        setSubmissions(updatedSelections);
    }, [updatedSelections]);

    // Filter out the "Work arrangement" and "Employment" options for the Telework Menu component
    const filteredGroupedOptions: GroupedOption[] = filterOptionsForTelework ?
        groupedOptions.filter(group => group.label !== "Work arrangement" && group.label !== "Employment") :
        groupedOptions;

    const atSegmentLimit = submissions.length >= MAX_SUBMISSIONS;

    const openModal = () => {
        if (atSegmentLimit) return;
        setModalSels({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (!isModalOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isModalOpen]);

    const toggleOpt = (groupLabel: string, optVal: string) => {
        setModalSels(prev => {
            const cur = prev[groupLabel] ?? new Set<string>();
            const next = new Set(cur);
            if (next.has(optVal)) next.delete(optVal);
            else next.add(optVal);
            return { ...prev, [groupLabel]: next };
        });
    };

    const setAllForGroup = (groupLabel: string) => {
        const group = filteredGroupedOptions.find(g => g.label === groupLabel)!;
        setModalSels(prev => ({ ...prev, [groupLabel]: new Set(group.options.map(o => o.value)) }));
    };

    const setNoneForGroup = (groupLabel: string) => {
        setModalSels(prev => ({ ...prev, [groupLabel]: new Set() }));
    };

    const isChecked = (groupLabel: string, optVal: string): boolean => {
        const sel = modalSels[groupLabel];
        return !!sel && sel.has(optVal);
    };

    const isActiveGroup = (group: GroupedOption) => {
        const sel = modalSels[group.label];
        return !!sel && sel.size > 0;
    };

    const hasAnySelection = Object.values(modalSels).some(sel => sel.size > 0);

    // Convert the modal's Record<string, Set<string>> selections into the
    // Option[] shape `submissions` expects, by looking each value back up
    // in groupedOptions to recover the full Option object.
    const buildSegmentOptions = (sels: Record<string, Set<string>>): Option[] => {
        const result: Option[] = [];
        filteredGroupedOptions.forEach(group => {
            const sel = sels[group.label];
            if (!sel || sel.size === 0) return;
            group.options.forEach(opt => {
                if (sel.has(opt.value)) result.push(opt);
            });
        });
        return result;
    };

    const handleAddSegment = () => {
        if (atSegmentLimit || !hasAnySelection) return;
        const newSegment = buildSegmentOptions(modalSels);
        if (newSegment.length === 0) return;
        setSubmissions(prev => [...prev, newSegment]);
        setModalSels({});
        closeModal();
    };

    const handleResetModal = () => {
        setModalSels({});
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
                <label className="csm-bar__label" style={{ marginRight: '0.5rem' }}>Select Segment:</label>
                <button
                    className="csm-bar__trigger"
                    onClick={openModal}
                    disabled={atSegmentLimit}
                    title={atSegmentLimit ? `Maximum of ${MAX_SEGMENTS} segments reached` : undefined}
                >
                    <FilterIcon />
                    Select Segment
                    {submissions.length > 1 && <span className="csm-bar__badge">{submissions.length - 1}</span>}
                </button>

                <Infobox style={{ display: 'flex', position: 'relative', padding: 12 }}>
                    <p>Select attributes to define and add a specific population segment for comparison purposes (up to {MAX_SEGMENTS} segments). The default view shows data for ‘all’ individuals aged 15 and older. </p>
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

            {isModalOpen && (
                <div
                    className="csm-backdrop"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="csm-modal" role="dialog" aria-modal="true" aria-label="Select segment attributes">
                        <div className="csm-modal__header">
                            <span className="csm-modal__title">Select segment attributes</span>
                            <button className="csm-modal__esc-btn" onClick={closeModal}>ESC</button>
                        </div>

                        <div className="csm-modal__grid">
                            {filteredGroupedOptions.map(group => {
                                const active = isActiveGroup(group);
                                return (
                                    <div
                                        key={group.label}
                                        className={`csm-dim${active ? ' csm-dim--active' : ''}`}
                                    >
                                        <div className="csm-dim__head">
                                            <span className="csm-dim__title">{group.label}</span>
                                            <div className="csm-dim__shortcuts">
                                                <button onClick={() => setAllForGroup(group.label)}>All</button>
                                                <span>·</span>
                                                <button onClick={() => setNoneForGroup(group.label)}>None</button>
                                            </div>
                                        </div>
                                        <div className="csm-dim__opts">
                                            {group.options.map(opt => (
                                                <label key={opt.value} className="csm-opt">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked(group.label, opt.value)}
                                                        onChange={() => toggleOpt(group.label, opt.value)}
                                                    />
                                                    <span className="csm-opt__label">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="csm-modal__footer">
                            <div className="csm-modal__footer-btns">
                                <button className="csm-btn csm-btn--ghost" onClick={handleResetModal}>
                                    Reset
                                </button>
                                <button
                                    className="csm-btn csm-btn--primary"
                                    onClick={handleAddSegment}
                                    disabled={atSegmentLimit || !hasAnySelection}
                                    title={atSegmentLimit ? `Maximum of ${MAX_SEGMENTS} segments reached` : (!hasAnySelection ? 'Select at least one option' : undefined)}
                                >
                                    Add Segment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );

};
export default CrossSegmentMenu;

const FilterIcon = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 5 }}>
        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
    </svg>
);
