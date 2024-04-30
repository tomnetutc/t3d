import "./Donut.scss";
import { DonutProps } from "../Types";
import { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement, CategoryScale, Tooltip, Legend } from 'chart.js';


Chart.register(ArcElement, CategoryScale, ChartDataLabels, Tooltip, Legend);


const Donut = (props: DonutProps): JSX.Element => {

    const [aspectRatio, setAspectRatio] = useState(props.aspectRatio || (window.innerWidth <= 1800 ? 1 : 1.2));

    useEffect(() => {
        if (!props.aspectRatio) {
            const handleResize = () => {
                setAspectRatio(window.innerWidth <= 1800 ? 1 : 1.2);
            };
            window.addEventListener('resize', handleResize);

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [props.aspectRatio]);

    const options: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: aspectRatio,
        plugins: {
            datalabels: {
                color: '#FFF',
                font: {
                    weight: 'bold'
                },
                formatter: (value, context) => {
                    return value > 5 ? `${value}%` : null;
                },
                anchor: 'center',
                align: 'center'
            },
            legend: {
                position: 'top' as const,
                align: 'end',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return ` ${label}: ${value}%`;
                    }
                }
            }
        },
        cutout: '50%'
    };


    return (
        <div className="donut">
            <div className="top">
                <span className="title">{props.title}</span>
            </div>
            <div className="bottom">
                <div className="donutchart">
                    <Doughnut data={props.data} options={options} />
                </div>
            </div>
        </div>
    )
}

export default Donut;