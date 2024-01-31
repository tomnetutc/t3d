import "./Chart.scss";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartDataProps } from '../Types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const ChartComponent: React.FC<{ chartData: ChartDataProps, title: string, isStacked: boolean, showLegend: boolean }> = ({ chartData, title, isStacked, showLegend }) => {

    const options = {
        indexAxis: 'y' as const,
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
            },
            y: {
                stacked: isStacked,
                grid: {
                    display: false, // This will remove the grid lines
                    drawBorder: false,
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <div className="chart">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ChartComponent;
