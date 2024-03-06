import { ChartDataProps, DataRow } from '../Types';
import { calculateTripAverages, calculateTravelModeAverages } from '../../utils/Helpers';

export const prepareChartData = (
    filteredData: DataRow[],
    dataType: 'numberTrip' | 'durationTrip',
    calculationType: 'trip' | 'travelMode'
): ChartDataProps => {
    // Determine which calculation function to use
    const averages = calculationType === 'trip'
        ? calculateTripAverages(filteredData)
        : calculateTravelModeAverages(filteredData);

    const labels = averages.map(item => item.label.toString());
    const data = dataType === 'numberTrip'
        ? averages.map(item => parseFloat(item.numberTrip) || 0)
        : averages.map(item => parseFloat(item.durationTrips) || 0);

    // Adjust the dataset label based on dataType
    const datasetLabel = dataType === 'numberTrip' ? 'Number of trips' : 'Travel duration';
    const color = calculationType === 'trip' ? '#9D83A7' : '#6DAFA0';

    return {
        labels: labels,
        datasets: [
            {
                label: datasetLabel,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                barThickness: 'flex' as const
            }
        ]
    };
}
