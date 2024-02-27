import React from 'react';
import './Bubble.scss';
import { BubbleChartProps, BubbleComponentProps, FourBubbleChartProps } from '../Types';


const BubbleComponent = ({ value, label, color, minData, maxData, minSize, maxSize }: BubbleComponentProps): JSX.Element => {

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
                <span className="bubble-value">{value.toFixed(1).toLocaleString()}</span>
            </div>
            <div className="bubble-label">{label}</div>
        </div>
    );
};


const BubbleChart = ({ inHomeValue, outHomeValue, chartTitle }: BubbleChartProps): JSX.Element => {
    const minDataValue = 1.01; // To prevent log(1) errors
    const maxDataValue = 1200; // The largest data value you expect

    return (
        <div className="bubble-chart-container">
            <div className="title-container">
                <span className="title">{chartTitle}</span>
            </div>
            <div className="bubble-chart">
                <BubbleComponent value={inHomeValue} label="In-home" color="#BDABE6" minData={minDataValue} maxData={maxDataValue} minSize={30} maxSize={100} />
                <BubbleComponent value={outHomeValue} label="Out-of-home" color="#8FD1BF" minData={minDataValue} maxData={maxDataValue} minSize={30} maxSize={100} />
            </div>
        </div>
    );
};

export default BubbleChart;

// New GridBubbleChart for 2x2 grid layout (Named Export)
export const GridBubbleChart = ({ bubbleData, chartTitle }: FourBubbleChartProps): JSX.Element => {
    const minDataValue = 1.01; // To prevent log(1) errors
    const maxDataValue = 100; // The largest data value you expect

    return (
        <div className="bubble-chart-container">
            <div className="title-container">
                <span className="title">{chartTitle}</span>
            </div>
            <div className="bubble-grid">
                {bubbleData.map((data, index) => (
                    <BubbleComponent
                        key={index}
                        value={data.value}
                        label={data.label}
                        color={data.color}
                        minData={minDataValue}
                        maxData={maxDataValue}
                        minSize={2}
                        maxSize={30}
                    />
                ))}
            </div>
        </div>
    );
};