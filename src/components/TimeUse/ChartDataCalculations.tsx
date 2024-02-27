import { ChartDataProps, DataRow } from '../Types';
import { calculateActivityAverages } from '../../utils/Helpers';

export const prepareChartData = (filteredData: DataRow[]): ChartDataProps => {
    const activityAverages = calculateActivityAverages(filteredData);
    const labels = activityAverages.map(activity => activity.label.toString());
    const inHomeData = activityAverages.map(activity => parseFloat((parseFloat(activity.inHome).toFixed(1)) || '0'));
    const outHomeData = activityAverages.map(activity => parseFloat((parseFloat(activity.outHome).toFixed(1)) || '0'));

    return {
        labels: labels,
        datasets: [
            {
                label: 'In-home',
                data: inHomeData,
                backgroundColor: '#9D83A7',
                borderColor: '#9D83A7',
                borderWidth: 1,
                barThickness: 'flex' as 'flex'
            },
            {
                label: 'Out-of-home',
                data: outHomeData,
                backgroundColor: '#6DAFA0',
                borderColor: '#6DAFA0',
                borderWidth: 1,
                barThickness: 'flex' as 'flex'
            }
        ]
    };
};
