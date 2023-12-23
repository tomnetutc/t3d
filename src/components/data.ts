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
    segmentSize = { ...segmentSize, counter: `N = ${newCounter.toLocaleString()} persons` };
};

export const updateSegmentShare = (row1: number, row2: number) => {
    const share = (row1 / row2) * 100;
    const formatedSegmentShare = (share < 1 && share != 0) ? share.toFixed(2) : share.toFixed(1);
    segmentShare = { ...segmentShare, counter: `${formatedSegmentShare} %` };
};

export const updateSegmentTimeSpent = (newAverage: number) => {
    if (newAverage < 1 && newAverage != 0) {
        segmentTimeSpent = { ...segmentTimeSpent, counter: `${(newAverage).toFixed(1)} mins` };
        return;
    }
    segmentTimeSpent = { ...segmentTimeSpent, counter: `${newAverage.toFixed(0)} mins` };
};

export const updateSegmentActivities = (newAverage: number) => {
    segmentActivites = { ...segmentActivites, counter: `${newAverage.toFixed(0)}` };
};