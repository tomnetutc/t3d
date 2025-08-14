import "./Chart.scss";
import { Bar } from 'react-chartjs-2';
import { ChartDataProps } from '../Types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useMemo } from 'react';
import { chartDataToCSV, downloadCSV } from '../../utils/Helpers';
import DownloadButton from '../DownloadButton';

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

    const transformedData = useMemo(() => {
        return chartData.labels.map((label, index) => {
            const obj: { [key: string]: string | number } = {
                name: Array.isArray(label) ? label.join(', ') : label,
            };
            chartData.datasets.forEach(dataset => {
                obj[dataset.label] = dataset.data[index] ?? 0;
            });
            return obj;
        });
    }, [chartData]);

    const handleDownload = () => {
        const csv = chartDataToCSV(
            transformedData,
            chartData.datasets.map(ds => ({ label: ds.label }))
        );
        const filename = `${title.replace(/\s+/g, "_")}.csv`;
        downloadCSV(csv, filename);
    };

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
                <span className="title">
                    {title}
                    <DownloadButton onClick={handleDownload} />
                </span>
            </div>
            <div className="chart">
                <Bar data={chartData} options={options} />
            </div>
        </div >
    );
};

export default ChartComponent;
