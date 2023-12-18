import { ChartData } from 'chart.js';

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
};

export type ActivityOption = {
    label: string;
    value?: string;
    inHome: string;
    outHome: string;
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
};

export interface NavbarProps {
    onMenuOptionChange: (options: Option[]) => void;
};

export interface MenuSelectedProps {
    menuSelectedOptions: Option[];
}

export interface ChartDataProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        barThickness: number;
    }[];
};

export interface BubbleComponentProps {
    value: number;
    label: string;
    color: string;
    minData: number;
    maxData: number;
};

export interface BubbleChartProps {
    inHomeValue: number;
    outHomeValue: number;
    chartTitle: string;
};

export interface DualValueSegmentProps {
    title: string;
    inHomeValue: number | string;
    outOfHomeValue: number | string;
};