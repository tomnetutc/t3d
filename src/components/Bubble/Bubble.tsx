import React from 'react';
import './Bubble.scss';
import { BubbleChartProps, BubbleComponentProps } from '../Types';



const BubbleComponent = ({ value, label, color, minData, maxData }: BubbleComponentProps): JSX.Element => {
    const minSize = 30; // Minimum size for the bubbles
    const maxSize = 100; // Maximum size for the bubbles

    const logRatio = (Math.log(value) - Math.log(minData)) /
        (Math.log(maxData) - Math.log(minData));

    const size = Math.max(minSize, Math.min(logRatio * (maxSize - minSize) + minSize, maxSize));

    const bubbleStyle = {
        width: `${size}%`,
        height: 'auto',
        aspectRatio: 1,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        responsive: true,
        maintainAspectRatio: true,
    };

    return (
        <div className="bubble-container">
            <div className="bubble" style={bubbleStyle}>
                <span className="bubble-value">{value.toLocaleString()}</span>
            </div>
            <div className="bubble-label">{label}</div>
        </div>
    );
};


const minDataValue = 1.01; // To prevent log(1) errors
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
