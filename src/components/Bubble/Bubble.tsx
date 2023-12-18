import React from 'react';
import './Bubble.scss';
import { BubbleChartProps, BubbleComponentProps } from '../Types';
import { BubbleMapValueToRange } from '../../utils/Helpers';



const BubbleComponent = ({ value, label, color, minData, maxData }: BubbleComponentProps): JSX.Element => {
    const minSize = 40; // Minimum size for the bubbles
    const maxSize = 120; // Maximum size for the bubbles

    const size = BubbleMapValueToRange(value, minData, maxData, minSize, maxSize);

    const bubbleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    };

    return (
        <div className="bubble-container">
            <div className="bubble" style={bubbleStyle}>
                <span className="bubble-value">{value}</span>
            </div>
            <div className="bubble-label">{label}</div>
        </div>
    );
};


const minDataValue = 1; // The smallest data value you expect
const maxDataValue = 1200; // The largest data value you expect

const BubbleChart = ({ inHomeValue, outHomeValue, chartTitle }: BubbleChartProps): JSX.Element => {
    return (
        <div className="bubble-chart-container">
            <div className="title-container">
                <span className="title">{chartTitle}</span>
            </div>
            <div className="bubble-chart">
                <BubbleComponent value={inHomeValue} label="In-home" color="#8164E2" minData={minDataValue} maxData={maxDataValue} />
                <BubbleComponent value={outHomeValue} label="Out-of-home" color="#AD88F1" minData={minDataValue} maxData={maxDataValue} />
            </div>
        </div>
    );
};

export default BubbleChart;
