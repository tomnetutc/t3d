import React, { useState, useEffect, useRef, useCallback } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Option } from './Types';
import { groupedOptions } from '../utils/Helpers';
import FilterChipDetails from './FilterChipDetails';
import '../css/topmenu.scss';

const NO_MATCH: Option = {
  value: '__no_match__',
  label: '__no_match__',
  id: '__no_match__',
  val: '__no_match__',
  groupId: '__no_match__',
};

function copySels(sels: Record<string, Set<string>>): Record<string, Set<string>> {
  const out: Record<string, Set<string>> = {};
  Object.entries(sels).forEach(([k, v]) => { out[k] = new Set(v); });
  return out;
}

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
      '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.5 },
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
  '& .MuiSwitch-thumb': { boxSizing: 'border-box', width: 20, height: 20 },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], { duration: 500 }),
  },
}));

const TopMenu: React.FC<{
  onOptionChange: (options: Option[]) => void;
  toggleState: (includeDecember: boolean) => void;
  dataProvider?: { loadData: () => Promise<any[]> };
  filterOptionsForTelework?: boolean;
}> = ({ onOptionChange, toggleState, dataProvider, filterOptionsForTelework = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedSels, setAppliedSels] = useState<Record<string, Set<string>>>({});
  const [modalSels, setModalSels] = useState<Record<string, Set<string>>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [respondentCount, setRespondentCount] = useState<number | null>(null);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [includeDecember, setIncludeDecember] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const countTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groups = filterOptionsForTelework
    ? groupedOptions.filter(g => g.label !== 'Work arrangement' && g.label !== 'Employment')
    : groupedOptions;

  const buildOptions = useCallback(
    (sels: Record<string, Set<string>>): Option[] => {
      const result: Option[] = [];
      const gs = filterOptionsForTelework
        ? groupedOptions.filter(g => g.label !== 'Work arrangement' && g.label !== 'Employment')
        : groupedOptions;
      gs.forEach(group => {
        const sel = sels[group.label];
        if (!sel || sel.size === group.options.length) return;
        if (sel.size === 0) {
          result.push({ ...NO_MATCH, groupId: group.label });
          return;
        }
        group.options.forEach(opt => {
          if (sel.has(opt.value)) result.push(opt);
        });
      });
      return result;
    },
    [filterOptionsForTelework]
  );

  const activeCount = groups.filter(g => {
    const sel = appliedSels[g.label];
    return sel !== undefined && sel.size < g.options.length;
  }).length;

  const openModal = () => {
    setModalSels(copySels(appliedSels));
    setSearchQuery('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dataProvider) return;
    if (countTimer.current) clearTimeout(countTimer.current);
    countTimer.current = setTimeout(async () => {
      setIsCountLoading(true);
      try {
        const data = await dataProvider.loadData();
        const opts = buildOptions(modalSels);
        if (opts.length === 0) {
          setRespondentCount(data.length);
        } else {
          const grouped: Record<string, Option[]> = {};
          opts.forEach(opt => {
            if (!grouped[opt.groupId]) grouped[opt.groupId] = [];
            grouped[opt.groupId].push(opt);
          });
          const count = data.filter(row =>
            Object.values(grouped).every(grp =>
              grp.some(opt => row[opt.id] === opt.val)
            )
          ).length;
          setRespondentCount(count);
        }
      } catch {
        setRespondentCount(null);
      }
      setIsCountLoading(false);
    }, 300);
    return () => { if (countTimer.current) clearTimeout(countTimer.current); };
  }, [modalSels, isOpen, buildOptions, dataProvider]);

  const toggleOpt = (groupLabel: string, optVal: string) => {
    setModalSels(prev => {
      const group = groups.find(g => g.label === groupLabel)!;
      const cur = prev[groupLabel] ?? new Set(group.options.map(o => o.value));
      const next = new Set(cur);
      if (next.has(optVal)) next.delete(optVal);
      else next.add(optVal);
      return { ...prev, [groupLabel]: next };
    });
  };

  const setAllForGroup = (groupLabel: string) => {
    const group = groups.find(g => g.label === groupLabel)!;
    setModalSels(prev => ({ ...prev, [groupLabel]: new Set(group.options.map(o => o.value)) }));
  };

  const setNoneForGroup = (groupLabel: string) => {
    setModalSels(prev => ({ ...prev, [groupLabel]: new Set() }));
  };

  const handleDone = () => {
    const snap = copySels(modalSels);
    setAppliedSels(snap);
    onOptionChange(buildOptions(snap));
    closeModal();
  };

  const handleResetAll = () => {
    setModalSels({});
    setAppliedSels({});
    onOptionChange([]);
    closeModal();
  };

  const removeChip = (groupLabel: string) => {
    const next = copySels(appliedSels);
    delete next[groupLabel];
    setAppliedSels(next);
    onOptionChange(buildOptions(next));
  };

  const isChecked = (groupLabel: string, optVal: string): boolean => {
    const sel = modalSels[groupLabel];
    if (!sel) return true;
    return sel.has(optVal);
  };

  const isPartial = (g: typeof groups[0]) => {
    const sel = appliedSels[g.label];
    return sel !== undefined && sel.size > 0 && sel.size < g.options.length;
  };

  const isEmptyApplied = (groupLabel: string) => {
    const sel = appliedSels[groupLabel];
    return !!sel && sel.size === 0;
  };

  const isEmptyModal = (groupLabel: string) => {
    const sel = modalSels[groupLabel];
    return !!sel && sel.size === 0;
  };

  const isActiveModal = (g: typeof groups[0]) => {
    const sel = modalSels[g.label];
    return sel !== undefined && sel.size > 0 && sel.size < g.options.length;
  };

  const chips = groups.filter(g => isPartial(g) || isEmptyApplied(g.label));

  const chipLabel = (g: typeof groups[0]) => {
    const sel = appliedSels[g.label];
    const count = sel ? sel.size : g.options.length;
    return `${g.label}: ${count} of ${g.options.length} selected`;
  };

  const hasEmptyModal = groups.some(g => isEmptyModal(g.label));

  const filteredGroups = searchQuery.trim()
    ? groups.filter(g =>
        g.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.options.some(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : groups;

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isToggling) {
      const checked = event.target.checked;
      setIncludeDecember(checked);
      toggleState(checked);
      setIsToggling(true);
      setTimeout(() => setIsToggling(false), 500);
    }
  };

  return (
    <>
      <div className="menu-container">
        <div className="fm-bar">
          <label className="fm-bar__label">Select Segment:</label>
          <button className="fm-bar__trigger" onClick={openModal}>
            <FilterIcon />
            Filters
            {activeCount > 0 && <span className="fm-bar__badge">{activeCount}</span>}
          </button>
          {chips.length > 0 && (
            <div className="fm-bar__chips">
              {chips.map(g => (
                <FilterChipDetails
                  key={g.label}
                  label={g.label}
                  options={g.options}
                  selected={appliedSels[g.label]}
                >
                  <span
                    className={`fm-chip${isEmptyApplied(g.label) ? ' fm-chip--warn' : ''}`}
                  >
                    {chipLabel(g)}
                    <button
                      className="fm-chip__remove"
                      onClick={() => removeChip(g.label)}
                      aria-label={`Remove ${g.label} filter`}
                    >
                      ×
                    </button>
                  </span>
                </FilterChipDetails>
              ))}
            </div>
          )}
          {chips.length > 0 && (
            <button
              className="fm-bar__reset"
              onClick={() => { setAppliedSels({}); onOptionChange([]); }}
            >
              Reset
            </button>
          )}
          <div className="fm-toggle">
            <span className="fm-toggle__label">Include December:</span>
            <IOSSwitch
              sx={{ m: 1 }}
              size="small"
              checked={includeDecember}
              onChange={handleToggleChange}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fm-backdrop"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="fm-modal" role="dialog" aria-modal="true" aria-label="Filter segments">
            <div className="fm-modal__search-row">
              <SearchIcon />
              <input
                className="fm-modal__search"
                type="text"
                placeholder="Search dimensions or options..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="fm-modal__esc-btn" onClick={closeModal}>ESC</button>
            </div>

            <div className="fm-modal__grid">
              {filteredGroups.map(group => {
                const empty = isEmptyModal(group.label);
                const active = isActiveModal(group);
                const low = searchQuery.toLowerCase();
                const visibleOpts = searchQuery.trim()
                  ? group.options.filter(o =>
                      o.label.toLowerCase().includes(low) ||
                      group.label.toLowerCase().includes(low)
                    )
                  : group.options;

                return (
                  <div
                    key={group.label}
                    className={`fm-dim${active ? ' fm-dim--active' : ''}${empty ? ' fm-dim--warn' : ''}`}
                  >
                    <div className="fm-dim__head">
                      <span className="fm-dim__title">{group.label}</span>
                      <div className="fm-dim__shortcuts">
                        <button onClick={() => setAllForGroup(group.label)}>All</button>
                        <span>·</span>
                        <button onClick={() => setNoneForGroup(group.label)}>None</button>
                      </div>
                    </div>
                    <div className="fm-dim__opts">
                      {visibleOpts.map(opt => (
                        <label key={opt.value} className="fm-opt">
                          <input
                            type="checkbox"
                            checked={isChecked(group.label, opt.value)}
                            onChange={() => toggleOpt(group.label, opt.value)}
                          />
                          <span className="fm-opt__label">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fm-modal__footer">
              <span className="fm-modal__count">
                {isCountLoading
                  ? 'Counting…'
                  : respondentCount !== null
                  ? `Showing ${respondentCount.toLocaleString()} records`
                  : ''}
              </span>
              <div className="fm-modal__footer-btns">
                <button className="fm-btn fm-btn--ghost" onClick={handleResetAll}>
                  Reset all
                </button>
                <button
                  className="fm-btn fm-btn--primary"
                  onClick={handleDone}
                  disabled={hasEmptyModal}
                  title={hasEmptyModal ? 'Select at least one option per dimension' : undefined}
                >
                  Done ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopMenu;

const FilterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 5 }}>
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="#888" style={{ flexShrink: 0 }}>
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
);
