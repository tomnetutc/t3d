import './DiffModeToggle.scss';
import React from 'react';
import { Button } from 'react-bootstrap';

export type ChartDisplayMode = 'actual' | 'diffFromAll';

const activeButtonStyle = {
    backgroundColor: '#C4F5B0',
    color: 'black',
    borderColor: 'black',
};

const defaultButtonStyle = {
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'black',
};

const DiffModeToggle: React.FC<{ mode: ChartDisplayMode; onChange: (mode: ChartDisplayMode) => void }> = ({ mode, onChange }) => {
    return (
        <div className="diff-mode-toggle">
            <Button
                size="sm"
                onClick={() => onChange('actual')}
                style={mode === 'actual' ? activeButtonStyle : defaultButtonStyle}
            >
                Actual values
            </Button>
            <Button
                size="sm"
                onClick={() => onChange('diffFromAll')}
                style={mode === 'diffFromAll' ? activeButtonStyle : defaultButtonStyle}
            >
                Difference from All
            </Button>
        </div>
    );
};

export default DiffModeToggle;
