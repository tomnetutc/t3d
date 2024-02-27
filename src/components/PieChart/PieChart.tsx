import "./PieChart.scss";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useState } from "react";


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
    title: string;
    data: ChartData<"pie", number[], string | string[]>;
    aspectRatio?: number;
}

const PieChart = ({ title, data }: PieChartProps): JSX.Element => {

    const [aspectRatio, setAspectRatio] = useState((window.innerWidth <= 1800 ? 1.2 : 1.7));

    useEffect(() => {
        const handleResize = () => {
            setAspectRatio(window.innerWidth <= 1800 ? 1.2 : 1.7);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    const options: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: aspectRatio,
        plugins: {
            datalabels: {
                color: '#FFF',
                font: {
                    weight: 'bold'
                },
                formatter: (value: number) => {
                    return value > 5 ? `${value}%` : null;
                },
                anchor: 'center',
                align: 'center'
            },
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        return ` ${label}: ${value}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="pie-chart">
            <div className="top">
                <span className="title">{title}</span>
            </div>
            <div className="bottom">
                <div className="chart-container">
                    <Pie data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default PieChart;
