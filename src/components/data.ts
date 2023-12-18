import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

export let segmentSize = {
    title: "Segment size",
    counter: "",
    icon: PeopleAltOutlinedIcon

}

export let segmentShare = {
    title: "Share in the sample",
    counter: "",
    icon: SignalCellularAltOutlinedIcon
}

export let segmentTimeSpent = {
    title: "Time spent out of home per day",
    counter: "",
    icon: RestoreOutlinedIcon

}

export let segmentActivites = {
    title: "Number of activites per day",
    counter: "",
    icon: EventAvailableOutlinedIcon

}

export const updateSegmentSize = (newCounter: number) => {
    segmentSize = { ...segmentSize, counter: `N = ${newCounter} persons` };
};

export const updateSegmentShare = (row1: number, row2: number) => {
    const share = (row1 / row2) * 100;
    segmentShare = { ...segmentShare, counter: `${share.toFixed(1)} %` };
};

export const updateSegmentTimeSpent = (newAverage: number) => {
    segmentTimeSpent = { ...segmentTimeSpent, counter: `${newAverage.toFixed(0)} mins` };
};

export const updateSegmentActivities = (newAverage: number) => {
    segmentActivites = { ...segmentActivites, counter: `${newAverage.toFixed(0)}` };
};