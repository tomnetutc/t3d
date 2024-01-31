import { ActivityOption, ChartDataProps, DataRow } from '../Types';
import { calculateYearlyActivityAverages } from '../../utils/Helpers';


export const prepareVerticalChartData = (filteredData: DataRow[], selectedActivity: ActivityOption, startYear: string, endYear: string): {
    chartData: ChartDataProps, averages: { inHomeAvg: number, outHomeAvg: number }, minYear: string, maxYear: string,
    inHomeChangePercent: number,
    outHomeChangePercent: number,
    inHomeChangeValue: number,
    outHomeChangeValue: number
} => {
    const yearlyAverages = calculateYearlyActivityAverages(filteredData, selectedActivity, startYear, endYear);
    const labels = yearlyAverages.map(item => item.year);

    // Convert string averages to numbers
    const inHomeData = yearlyAverages.map(item => parseFloat(item.inHomeAvg));
    const outHomeData = yearlyAverages.map(item => parseFloat(item.outHomeAvg));

    // Calculate the overall average
    const inHomeAvg = parseFloat((inHomeData.reduce((a, b) => a + b, 0) / inHomeData.length).toFixed(1));
    const outHomeAvg = parseFloat((outHomeData.reduce((a, b) => a + b, 0) / outHomeData.length).toFixed(1));


    const minYear = labels[0];
    const maxYear = labels[labels.length - 1];

    //Calculate the percentage change
    const calculateChangePercentage = (data: any) => {
        if (data.length > 1) {
            const firstValue = data[0];
            const lastValue = data[data.length - 1];

            return ((lastValue - firstValue) / firstValue) * 100;
        }
        return 0;
    };

    const inHomeChangePercent = calculateChangePercentage(inHomeData);
    const outHomeChangePercent = calculateChangePercentage(outHomeData);

    const inHomeChangeValue = inHomeData.length > 1 ? inHomeData[inHomeData.length - 1] - inHomeData[0] : 0;
    const outHomeChangeValue = outHomeData.length > 1 ? outHomeData[outHomeData.length - 1] - outHomeData[0] : 0;


    const barCountThreshold = 6;

    let barThickness = labels.length <= barCountThreshold ? 50 : 'flex' as 'flex';

    const chartData: ChartDataProps = {
        labels,
        datasets: [
            {
                label: 'In-home',
                data: inHomeData,
                backgroundColor: '#8164E2',
                borderColor: '#8164E2',
                borderWidth: 1,
                barThickness: barThickness
            },
            {
                label: 'Out-of-home',
                data: outHomeData,
                backgroundColor: '#AD88F1',
                borderColor: '#AD88F1',
                borderWidth: 1,
                barThickness: barThickness
            }
        ]
    };

    return {
        chartData,
        averages: { inHomeAvg, outHomeAvg },
        minYear,
        maxYear,
        inHomeChangePercent,
        outHomeChangePercent,
        inHomeChangeValue,
        outHomeChangeValue
    };
};
