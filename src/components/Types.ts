import { ChartData } from 'chart.js';
import { DSVRowString } from 'd3-dsv';

export interface Option {
    value: string;
    label: string;
    id: string;
    val: string;
    groupId: string;
    groupName?: string;
    progressValue?: number;
};

export interface weekOption {
    value: string;
    label: string;
    id: string;
    val?: string;
    groupId?: string;
    groupName?: string;
    progressValue?: number;
};

export interface GroupedOption {
    label: string;
    options: Option[];
};

export type GroupedOptions = {
    [key: string]: Option[];
};

export interface YearOption {
    label: string;
    value: string;
};

export interface YearMenuProps {
    onSelectionChange: (selections: { week: weekOption, year: string }) => void;
    callingComponent?: string;
};

export type ActivityOption = {
    label: string;
    value?: string;
    inHome: string;
    outHome: string;
};

export type TripPurposeOption = {
    label: string;
    value: string;
    numberTrip: string;
    durationTrips: string;
};

export type TravelModeOption = {
    label: string;
    value: string;
    numberTrip: string;
    durationTrips: string;
};

export type DayofWeekOption = {
    label: string;
    value: string;
    id: string;
    val: string;
    groupId: string;
};

export type DataRow = {
    [key: string]: string;
};

export interface YearlyActivityData {
    inHome: number;
    outHome: number;
    count: number;
};

export interface SegmentProps {
    title: string;
    counter: string;
    icon: React.ElementType;

};

export interface DonutProps {
    title: string;
    data: ChartData<"doughnut">;
    aspectRatio?: number;
};

export interface NavbarProps {
    onMenuOptionChange: (options: Option[]) => void;
};

export interface MenuSelectedProps {
    menuSelectedOptions: Option[];
}

export interface ChartDataProps {
    labels: (string | string[])[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth?: number;
        barThickness: number | 'flex';
    }[];
};

export interface BubbleComponentProps {
    value: number;
    label: string;
    color: string;
    minData: number;
    maxData: number;
    minSize: number;
    maxSize: number;
};

export interface BubbleChartProps {
    inHomeValue: number;
    outHomeValue: number;
    chartTitle: string;
};

export interface BubbleDataProps {
    value: number;
    label: string;
    color: string;
};

export interface FourBubbleChartProps {
    bubbleData: BubbleDataProps[];
    chartTitle: string;
};

export interface DualValueSegmentProps {
    title: string;
    inHomeValue: number | string;
    outOfHomeValue: number | string;
    inHomeChangeValue: number | null;
    outOfHomeChangeValue: number | null;
};

export interface ProgressBarData {
    label: string;
    percentChange: number;
    color: string;
}

export interface ProgressComponentProps {
    title: string;
    data: ProgressBarData[];
}

export interface CountObj {
    data: DSVRowString<string>[]
    count: [string | undefined, number][];
};

export interface SampleSizeTableProps {
    years: (string | undefined)[];
    counts: CountObj[];
};

export interface FooterProps {
    flagCounterHref: string;
    flagCounterSrc: string;
    docRefID: string;
    page: string;
    expiry: string;
    hideFlagAndTracking: boolean;
};