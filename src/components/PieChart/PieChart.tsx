import "./PieChart.scss";
import { Pie } from 'react-chartjs-2';
import { useEffect, useState, useMemo } from "react";
import { ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { chartDataToCSV, downloadCSV } from '../../utils/Helpers';
import DownloadButton from '../DownloadButton';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
    title: string;
    data: ChartData<"pie", number[], string | string[]>;
    aspectRatio?: number;
}

const PieChart = ({ title, data }: PieChartProps): JSX.Element => {

    const [aspectRatio, setAspectRatio] = useState((window.innerWidth <= 1800 ? 1.48 : 2));
    const [updateKey, setUpdateKey] = useState(0);

    const transformedData = useMemo(() => {
        if (!data.labels || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
            return [];
        }
        
        return data.labels.map((label, index) => ({
            name: Array.isArray(label) ? label.join(', ') : label,
            value: data.datasets[0].data[index] ?? 0
        }));
    }, [data]);

    const handleDownload = () => {
        if (transformedData.length === 0) return;
        
        const csv = chartDataToCSV(
            transformedData.map(item => ({ name: item.name, [title]: item.value })),
            [{ label: title }]
        );
        const filename = `${title.replace(/\s+/g, "_")}.csv`;
        downloadCSV(csv, filename);
    };

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
                <span className="title">
                    {title}
                    <DownloadButton onClick={handleDownload} />
                </span>
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