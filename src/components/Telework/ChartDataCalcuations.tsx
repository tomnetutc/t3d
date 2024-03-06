import { ChartData } from "chart.js";
import { BubbleDataProps, ChartDataProps, weekOption } from "../Types";
import { DayofWeek, WeekOptions, WorkArrangementOptions } from "../../utils/Helpers";
import { sum } from "lodash";

export const calculateWorkArrangementData = (filteredData: any[]): ChartData<"pie", number[], string | string[]> => {
    // Filters out the "Non-worker" option
    const validOptions = WorkArrangementOptions.filter(option => option.id !== 'unemployed');

    let sums = validOptions.map(() => 0);

    // Calculations for Pie Chart Data
    filteredData.forEach(row => {
        validOptions.forEach((option, index) => {
            sums[index] += parseFloat(row[option.id] || '0');
        });
    });

    const dataCount = filteredData.length === 0 ? 1 : filteredData.length;
    const averages = sums.map(sum => parseFloat(((sum / dataCount) * 100).toFixed(1)));

    let sumOfAverages = averages.reduce((acc, curr, index) => index < averages.length - 1 ? acc + curr : acc, 0);

    if (sumOfAverages > 100) sumOfAverages = 0;

    averages[averages.length - 1] = parseFloat((100 - sumOfAverages).toFixed(1));


    return {
        labels: validOptions.map(option => option.label),
        datasets: [{
            data: averages,
            backgroundColor: ['#C4C4C4', '#F9A875', '#F9D423', '#657383'],
            borderColor: ['#C4C4C4', '#F9A875', '#F9D423', '#657383'],
            borderWidth: 1,
            rotation: -90
        }]
    };
};


const calculateAverage = (data: any, field: string) => {
    const sum = data.reduce((acc: any, item: any) => acc + Number(item[field]), 0);
    return sum / data.length || 0;
};


export const generateWorkDurationChartData = (filteredData: any[]): ChartDataProps => {
    // Excluding worker types that should not be included in this chart
    const validOptions = WorkArrangementOptions.filter(option => option.id !== 'unemployed' && option.id !== 'zero_work');

    let avgInWork: number[] = [];
    let avgOutWork: number[] = [];

    // Filter data and calculate averages for each worker type
    validOptions.forEach(option => {
        const workers = filteredData.filter(row => row[option.id] === '1.0');
        avgInWork.push(parseFloat(calculateAverage(workers, 'in_work').toFixed(1)));
        avgOutWork.push(parseFloat(calculateAverage(workers, 'out_work').toFixed(1)));
    });

    // Using the format method instead of hardcoding the labels to allow for easier changes in the future
    const chartData: ChartDataProps = {
        labels: validOptions.map(option => option.label),
        datasets: [
            {
                label: 'In-home',
                data: avgInWork,
                backgroundColor: '#B19FB5',
                borderColor: '#B19FB5',
                borderWidth: 1,
                barThickness: 'flex' as 'flex'
            },
            {
                label: 'Out-of-home',
                data: avgOutWork,
                backgroundColor: '#8DCDB0',
                borderColor: '#8DCDB0',
                borderWidth: 1,
                barThickness: 'flex' as 'flex'
            }
        ]
    };

    return chartData;
};

export const calculateWorkArrangementByDayOfWeek = (filteredData: any[], week: weekOption): ChartDataProps => {
    let relevantDays = DayofWeek;
    if (week.value !== "All") {
        relevantDays = DayofWeek.filter(day => day.groupId === week.groupId);
    }

    let relevantData = filteredData.filter(row => relevantDays.some(day => day.val === row['day']));

    let percentages: number[][] = [];

    const validOptions = WorkArrangementOptions.filter(option => option.id !== 'unemployed'); // Exclude the "Non-worker" option

    validOptions.forEach((option, index) => {
        relevantDays.forEach((day, dayIndex) => {
            const dayData = relevantData.filter(row => row['day'] === day.val);
            const count = dayData.reduce((acc, curr) => acc + (curr[option.id] === option.val ? 1 : 0), 0);
            const percentage = (count / (dayData.length || 1)) * 100;

            percentages[index] = percentages[index] || [];

            if (index < validOptions.length - 1) {
                // For all but the last work arrangement option, calculating and storing the percentage normally
                percentages[index][dayIndex] = parseFloat(percentage.toFixed(1));
            } else {
                // For the last work arrangement option, adjusting the percentage so the sum equals 100% 
                //This is necessary because the percentages are reduced to 1 decimal place and the sum may be less or sometimes more than 100%
                const sumOfPreviousPercentages = parseFloat((percentages.reduce((acc, curr) => acc + (curr[dayIndex] || 0), 0)).toFixed(1));
                const adjustedPercentage = parseFloat((100.0 - sumOfPreviousPercentages).toFixed(1));

                if (sumOfPreviousPercentages + adjustedPercentage != 100) {
                    console.log(week);
                }

                percentages[index][dayIndex] = adjustedPercentage;
            }
        });
    });


    const labels = relevantDays.map(day => day.label);

    //Doing it this way felt the most readable and maintainable and also allows for easy changes in the future. We have four labels and four colors, so we could use the index to get the corresponding color

    const datasets = percentages.map((percentageData, index) => ({
        label: WorkArrangementOptions[index].label,
        data: percentageData,
        backgroundColor: ['#CFCCCC', '#FBC6A0', '#F4DF3B', '#9AAABF'][index % 4],
        borderColor: ['#CFCCCC', '#FBC6A0', '#F4DF3B', '#9AAABF'][index % 4],
        borderWidth: 1,
        barThickness: 'flex' as 'flex'
    }));

    return { labels, datasets };
};

export const calculateTimePoorWorkArrangementData = (filteredData: any[]): BubbleDataProps[] => {
    const validOptions = WorkArrangementOptions.filter(option => option.id !== 'unemployed');
    const colors = ['#CFCCCC', '#FBC6A0', '#F4DF3B', '#9AAABF'];

    let bubbleData: BubbleDataProps[] = [];

    validOptions.forEach((option, index) => {
        const optionData = filteredData.filter(row => row[option.id] === option.val);
        const timePoorCount = optionData.filter(row => row['time_poor'] === "1.0").length;

        const percentage = (timePoorCount / (optionData.length || 1)) * 100;

        bubbleData.push({
            value: parseFloat(percentage.toFixed(1)),
            label: option.label,
            color: colors[index % colors.length],
        });
    });

    return bubbleData;
};

