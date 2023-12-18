import { ChartDataProps, DataRow } from '../Types';
import { calculateActivityAverages } from '../../utils/Helpers';

export const prepareChartData = (filteredData: DataRow[]): ChartDataProps => {
    const activityAverages = calculateActivityAverages(filteredData);
    const labels = activityAverages.map(activity => activity.label.toString());
    const inHomeData = activityAverages.map(activity => parseFloat(activity.inHome) || 0);
    const outHomeData = activityAverages.map(activity => parseFloat(activity.outHome) || 0);

    return {
        labels: labels,
        datasets: [
            {
                label: 'In-home',
                data: inHomeData,
                backgroundColor: '#8164E2',
                borderColor: '#8164E2',
                borderWidth: 1,
                barThickness: 20
            },
            {
                label: 'Out-of-home',
                data: outHomeData,
                backgroundColor: '#AD88F1',
                borderColor: '#AD88F1',
                borderWidth: 1,
                barThickness: 20
            }
        ]
    };
};
