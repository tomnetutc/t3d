import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import "../LineChart/LineChart.scss";
import { ChartDataProps } from '../Types';

const tooltipFormatter = (value: number) => {
    return Number(value) % 1 === 0 ? `${value}.0` : value.toString();
};

const RechartsLineChart: React.FC<{ chartData: ChartDataProps, title: string, showLegend: boolean }> = ({ chartData, title, showLegend }) => {

    const transformedData = chartData.labels.map((label, index) => {
        const obj: { [key: string]: string | number } = { name: Array.isArray(label) ? label.join(', ') : label };
        chartData.datasets.forEach(dataset => {
            obj[dataset.label] = dataset.data[index];
        });
        return obj;
    });

    const maxValue = Math.max(...chartData.datasets.flatMap(dataset => dataset.data));
    const nextScaleValue = maxValue + (maxValue * 0.1); // Add 10% to the max value to make the chart look better

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={transformedData} margin={{ top: 10, right: 0, left: -15, bottom: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 20, right: 20 }} tick={{ fontSize: 13, fontFamily: 'sans-serif' }} />
                    <YAxis domain={[0, 'auto']} tick={{ fontSize: 13, fontFamily: 'sans-serif' }} />
                    <Tooltip formatter={tooltipFormatter} />
                    {showLegend && <Legend verticalAlign='top' align='right' />}
                    {chartData.datasets.map((dataset, idx) => (
                        <Line
                            key={idx}
                            type="monotone"
                            dataKey={dataset.label}
                            stroke={dataset.borderColor}
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RechartsLineChart;