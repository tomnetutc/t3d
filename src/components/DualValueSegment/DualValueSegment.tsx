import React from 'react';
import './DualValueSegment.scss';
import Colors from '../../Colors';
import { DualValueSegmentProps } from '../Types';

const DualValueSegment: React.FC<DualValueSegmentProps> = ({ title, inHomeValue, outOfHomeValue, inHomeChangeValue, outOfHomeChangeValue }) => {

    const getColorBasedOnValue = (value: any) => {
        return parseFloat(value) >= 0 ? '#67CBA0' : '#D98C93';
    };

    const formatChangeValue = (value: any) => {
        // Determine the absolute value for formatting
        const absoluteValue = Math.abs(value);

        // Determine the unit based on the absolute value
        const unit = absoluteValue === 1 ? 'min' : 'min';

        // Format the value with sign and unit
        return `${value >= 0 ? '+' : '-'}${absoluteValue.toFixed(1)} ${unit}`;
    };

    const formatPercentChangeValue = (value: any): string => {
        if (value === null) return 'N/A'; // Handle null or undefined values
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`; // Format with sign and percentage
    };

    return (
        <div className="dual-value-segment">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <div className="values-container">
                <div className="value-entry">
                    <span className="value-label" style={{ backgroundColor: Colors.inHomeDualValueSegmentBackground, color: Colors.inHomeDualValueSegmentText }}>In-home</span>
                    <div className="counter-box" style={{ color: getColorBasedOnValue(inHomeValue) }}>{formatChangeValue(inHomeChangeValue)} ({formatPercentChangeValue(inHomeValue)})</div>
                </div>
                <div className="value-entry">
                    <span className="value-label" style={{ backgroundColor: Colors.outOfHomeDualValueSegmentBackground, color: Colors.outOfHomeDualValueSegmentText }}>Out-of-home</span>
                    <div className="counter-box" style={{ color: getColorBasedOnValue(outOfHomeValue) }}>{formatChangeValue(outOfHomeChangeValue)} ({formatPercentChangeValue(outOfHomeValue)})</div>
                </div>
            </div>
        </div>
    );
}



export default DualValueSegment;
