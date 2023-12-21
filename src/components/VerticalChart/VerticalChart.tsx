import React, { useEffect, useState } from 'react';
import "../VerticalChart/VerticalChart.scss";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartDataProps } from '../Types';

const calculateMaxYAxis = (data: ChartDataProps) => {
    if (data.datasets && data.datasets.length >= 2) {
        const summedValues = data.datasets[0].data.map((value, index) =>
            value + (data.datasets[1].data[index] || 0)  // fallback to 0 | undefined + number = NaN | Sleeping data doesn't have out of home data
        );

        const maxSumValue = Math.max(...summedValues);
        return maxSumValue > 1400 ? 1440 : undefined;
    }
    return undefined;
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const VerticalStackedBarChart: React.FC<{ chartData: ChartDataProps, title: string }> = ({ chartData, title }) => {

    const verticalOptions = {
        indexAxis: 'x' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                position: 'top' as const,
                align: 'end' as 'end',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10
                }
            },
            title: {
                display: false
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
            y: {
                stacked: true,
                max: calculateMaxYAxis(chartData),
            },
        }
    };

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <div className="chart">
                <Bar data={chartData} options={verticalOptions} />
            </div>
        </div>
    );
};

export default VerticalStackedBarChart;
