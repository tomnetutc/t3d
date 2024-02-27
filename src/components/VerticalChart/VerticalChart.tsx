import React, { useEffect, useState } from 'react';
import "./VerticalChart.scss";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartDataProps } from '../Types';

const calculateMaxYAxis = (data: ChartDataProps, isTelework: boolean = false) => {
    if (data.datasets && data.datasets.length >= 2) {
        const summedValues = data.datasets[0].data.map((value, index) =>
            value + (data.datasets[1].data[index] || 0)  // Fallback to 0 if data is undefined
        );

        const maxSumValue = Math.max(...summedValues);

        if (!isTelework) {
            return maxSumValue > 1400 ? 1440 : undefined;
        }

        let sum = summedValues.reduce((a, b) => a + b, 0);
        return sum >= 100 ? 100 : undefined;
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

const VerticalStackedBarChart: React.FC<{ chartData: ChartDataProps, title: string, isStacked: boolean, showLegend: boolean, isTelework?: boolean }> = ({ chartData, title, isStacked, showLegend, isTelework }) => {

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
            tooltip: {
                // This is a workaround to display the correct label for the tooltip only when the labels are split into two lines for better readability (Telework Dashboard)
                callbacks: {
                    title: function (tootltipItems: any) {
                        const tooltipItem = tootltipItems[0];
                        const labelArray = chartData.labels[tooltipItem.dataIndex];
                        return Array.isArray(labelArray) ? labelArray.join(' ') : labelArray;
                    }
                }
            },
            datalabels: {
                display: false,
            },
            legend: {
                display: showLegend,
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
                stacked: isStacked,
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
            y: {
                stacked: isStacked,
                max: calculateMaxYAxis(chartData, isTelework),
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
