import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { ProgressComponentProps } from '../Types';
import './ProgressBar.scss';


const Progress: React.FC<ProgressComponentProps> = ({ title, data }) => {
    return (
        <div className="progress-container">
            <div className="title">{title}</div>
            <div className="progress-grid">
                {data.map((item, index) => {
                    const percentValue = Math.abs(item.percentChange);
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
