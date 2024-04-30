import "./PieChart.scss";
import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
    title: string;
    data: ChartData<"pie", number[], string | string[]>;
    aspectRatio?: number;
}

const PieChart = ({ title, data }: PieChartProps): JSX.Element => {

    const [aspectRatio, setAspectRatio] = useState((window.innerWidth <= 1800 ? 1.48 : 2));
    const [updateKey, setUpdateKey] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setAspectRatio(window.innerWidth <= 1800 ? 1.48 : 2);
            setUpdateKey(prevKey => prevKey + 1);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const options: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: aspectRatio,
        plugins: {
            datalabels: {
                color: '#FFF',
                font: {
                    weight: 'bold',
                    size: 14
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
                    <Pie key={updateKey} data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default PieChart;