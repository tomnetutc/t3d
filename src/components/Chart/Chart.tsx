import "./Chart.scss";
import { Bar } from 'react-chartjs-2';
import { ChartDataProps } from '../Types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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

const ChartComponent: React.FC<{ chartData: ChartDataProps, title: string, isStacked: boolean, showLegend: boolean, isTelework?: boolean }> = ({ chartData, title, isStacked, showLegend, isTelework }) => {

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
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        let value = context.raw !== undefined ? context.raw : (context.parsed.y !== undefined ? context.parsed.y : context.parsed.x);
                        if (label) {
                            label += ': ';
                        }

                        if (Number(value) % 1 === 0) {
                            // It's a whole number, so add ".0" to make it display as a decimal
                            label += `${value}.0`;
                        } else {
                            label += value.toString();
                        }

                        return label;
                    }
                }
            },

        },
        scales: {
            x: {
                stacked: isStacked,
                max: calculateMaxYAxis(chartData, isTelework),
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
        <div className="chart-container" >
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <div className="chart">
                <Bar data={chartData} options={options} />
            </div>
        </div >
    );
};

export default ChartComponent;
