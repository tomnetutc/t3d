import React from 'react';
import './ProgressBar.scss';
import { ProgressComponentProps } from '../Types';
import ProgressBar from 'react-bootstrap/ProgressBar'

const Progress: React.FC<ProgressComponentProps> = ({ title, data }) => {
    return (
        <div className="progress-container">
            <div className="title">{title}</div>
            <div className="progress-grid">
                {data.map((item, index) => {
                    let percentValue = Math.abs(item.percentChange);
                    if (isNaN(percentValue)) {
                        percentValue = 0;
                    }
                    else if (!isFinite(percentValue)) {
                        percentValue = 50;
                    }
                    return (
                        <div key={index} className="progress-item">
                            <div className="label">{item.label}</div>
                            <div className="progress-bar-container">
                                <div className="progress-bar">
                                    <ProgressBar
                                        variant={item.color} // tl_red or tl_green ? Color class in App.css
                                        now={percentValue}
                                        max={50}
                                        style={{ height: "100%", width: "95%" }}
                                    />
                                </div>
                                <div className="value">{item.percentChange.toFixed(1)}%</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Progress;