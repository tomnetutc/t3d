import { DSVRowString } from "d3-dsv";
import { WorkArrangementOptions } from "../../utils/Helpers";
import { ChartDataProps, CountObj, Option, ProgressBarData, SampleSizeTableProps } from "../Types";

const workArrangementColors: { [key: string]: string } = {
    "zero_work": '#C4C4C4',
    "only_inhome_worker": '#F9A875',
    "commuter_only": '#657383',
    "multisite_worker": '#F9D423'
};

export const calculateYearlyWorkArrangementShares = (
    filteredData: any[],
    startYear: string,
    endYear: string,
    employment: Option
): {
    chartData: ChartDataProps,
    percentChangedata: ProgressBarData[],
    minYear: string,
    maxYear: string,
    sampleSizeTableData: SampleSizeTableProps
} => {
    const start = parseInt(startYear, 10);
    const end = parseInt(endYear, 10);

    let labels: string[] = [];
    let datasets: ChartDataProps['datasets'] = [];
    const percentChangedata: ProgressBarData[] = [];

    // Filter out the 'unemployed' option from calculations
    const validOptions = WorkArrangementOptions.filter(option => option.id !== 'unemployed');

    const uniqueYears = Array.from(new Set(filteredData.map(item => item.year)))
        .filter(year => year >= start && year <= end)
        .sort((a, b) => a - b);


    const barCountThreshold = 5;

    let barThickness = uniqueYears.length <= barCountThreshold ? 80 : 'flex' as 'flex';

    // Initialize datasets for all valid options
    validOptions.forEach(option => {
        datasets.push({
            label: option.label,
            data: [],
            backgroundColor: workArrangementColors[option.id],
            borderColor: workArrangementColors[option.id],
            borderWidth: 1,
            barThickness: barThickness,
        });
    });

    if (employment.id != "All") {
        filteredData = filteredData.filter(row => row[employment.id] === employment.val);
    }

    let allYearData: DSVRowString<string>[] = filteredData.filter(row => {
        const year = parseInt(row.year, 10);
        return year >= start && year <= end;
    });

    let countObj: CountObj = {
        data: allYearData,
        count: []
    };

    uniqueYears.forEach(year => {
        labels.push(year.toString());
        const yearData = filteredData.filter(row => row.year === year);

        const countForYear = allYearData.filter(row => row.year === year).length;
        countObj.count.push([year.toString(), countForYear]);


        let sumOfPercentages = 0;

        validOptions.forEach((option, index) => {
            const count = yearData.filter(row => row[option.id] === option.val).length;
            const total = yearData.length;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            sumOfPercentages += parseFloat(percentage.toFixed(1));


            datasets[index].data.push(parseFloat(percentage.toFixed(1)));

            if (index === validOptions.length - 1) {
                let adjustedPercentage = 100 - sumOfPercentages + parseFloat(percentage.toFixed(1));
                adjustedPercentage = adjustedPercentage < 0 ? 0 : adjustedPercentage;
                adjustedPercentage = adjustedPercentage > 100 ? 100 : adjustedPercentage;
                datasets[index].data[datasets[index].data.length - 1] = parseFloat(adjustedPercentage.toFixed(1));
            }
        });
    });

    datasets.forEach(dataset => {
        const firstYearValue = dataset.data[0];
        const lastYearValue = dataset.data[dataset.data.length - 1];
        const percentChange = lastYearValue - firstYearValue;
        percentChangedata.push({
            label: dataset.label,
            percentChange: parseFloat(percentChange.toFixed(1)),
            color: percentChange < 0 ? "tl_red" : "tl_green"
        });
    });

    const chartData: ChartDataProps = {
        labels,
        datasets
    };

    const sampleSizeTableData: SampleSizeTableProps = {
        years: labels,
        counts: [countObj],
    };

    return {
        chartData,
        percentChangedata,
        minYear: labels[0],
        maxYear: labels[labels.length - 1],
        sampleSizeTableData,
    };
};


