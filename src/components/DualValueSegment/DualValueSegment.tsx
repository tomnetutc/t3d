import React from 'react';
import './DualValueSegment.scss';
import { DualValueSegmentProps } from '../Types';



const DualValueSegment: React.FC<DualValueSegmentProps> = ({ title, inHomeValue, outOfHomeValue }) => {

    const getColorBasedOnValue = (value: any) => {
        return parseFloat(value) >= 0 ? '#2ECC71' : '#E74C3C';
    };

    return (
        <div className="dual-value-segment">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <div className="values-container">
                <div className="value-entry">
                    <span className="value-label" style={{ backgroundColor: '#8164E2', color: 'white' }}>In-home</span>
                    <div className="counter-box" style={{ color: getColorBasedOnValue(inHomeValue) }}>{inHomeValue}</div>
                </div>
                <div className="value-entry">
                    <span className="value-label" style={{ backgroundColor: '#AD88F1', color: 'white' }}>Out-of-home</span>
                    <div className="counter-box" style={{ color: getColorBasedOnValue(outOfHomeValue) }}>{outOfHomeValue}</div>
                </div>
            </div>
        </div>
    );
}



export default DualValueSegment;
