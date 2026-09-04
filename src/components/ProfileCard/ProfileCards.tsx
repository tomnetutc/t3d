import "./ProfileCards.scss";
import { Col } from "react-bootstrap";
import { ProfileCardProps, Option } from "../Types";
import { groupedOptions } from "../../utils/Helpers";

const CATEGORY_LABEL_ABBREVIATIONS: Record<string, string> = {
    "Household size": "HH size",
    "Household Location": "HH location",
    "Census division": "Division",
    "Main mode of transportation": "Mode",
    "Time poverty status": "Time poverty",
    "Trip making status": "Trip making",
};

const VALUE_ABBREVIATIONS: Record<string, Record<string, string>> = {
    "Time poverty status": { "Time poor": "Yes", "Not time poor": "No" },
    "Trip making status": { "One or more trips": "Yes", "Zero trip": "No" },
};

function abbreviateAgeValue(label: string): string {
    const range = label.match(/^(\d+) to (\d+) years$/);
    if (range) return `${range[1]}-${range[2]}`;
    const plus = label.match(/^(\d+) years or older$/);
    if (plus) return `${plus[1]}+`;
    return label;
}

interface SegmentRow {
    label: string;
    values: string;
}

function buildSegmentRows(options: Option[]): SegmentRow[] {
    const byCategory = new Map<string, Option[]>();
    options.forEach(opt => {
        const category = opt.groupName;
        if (!category) return;
        if (!byCategory.has(category)) byCategory.set(category, []);
        byCategory.get(category)!.push(opt);
    });

    const rows: SegmentRow[] = [];
    groupedOptions.forEach(group => {
        const selected = byCategory.get(group.label);
        if (!selected || selected.length === 0) return;
        // A category where every option is present is left at default — no row.
        if (selected.length >= group.options.length) return;

        const displayLabel = CATEGORY_LABEL_ABBREVIATIONS[group.label] ?? group.label;
        const valueAbbrevs = VALUE_ABBREVIATIONS[group.label];
        const values = selected.map(opt => {
            if (group.label === "Age") return abbreviateAgeValue(opt.label);
            if (valueAbbrevs && valueAbbrevs[opt.label]) return valueAbbrevs[opt.label];
            return opt.label;
        });
        rows.push({ label: displayLabel, values: values.join(", ") });
    });

    return rows;
}

export default function ProfileCards({
    profileList,
    removeProfile,
    title,
    segmentColors,
}: ProfileCardProps): JSX.Element {
    return (
        <>
            <div className="profile-container">
                <div className="title-container">
                    <span className="title">{title}</span>
                </div>
                <div className="profilecards">
                    <Col md="auto" style={{ display: "flex", justifyContent: "center", paddingBottom: "1rem" }} >
                        <div className="all-button">All</div>
                    </Col>
                    {profileList.map((profile, index) => {
                        const segmentOptions = Object.values(profile)[0];
                        const rows = buildSegmentRows(segmentOptions);
                        return (
                            <Col
                                md="auto"
                                style={{ display: "flex", justifyContent: "space-evenly" }}
                                key={index}
                            >
                                <div
                                    className="profiles"
                                    id="closeablecard"
                                    style={{ borderLeftColor: segmentColors[index + 1] }}
                                >
                                    <span className="segment-title">
                                        Segment {index + 1}
                                    </span>
                                    <button
                                        data-dismiss="alert"
                                        data-target="#closeablecard"
                                        onClick={() => removeProfile(index)}
                                        className="btn-close profile-close-x"
                                    ></button>
                                    {rows.length > 0 && (
                                        <div className="segment-rows">
                                            {rows.map(row => (
                                                <div key={row.label} className="segment-row">
                                                    <span className="segment-row__label">{row.label}:</span>{" "}
                                                    <span className="segment-row__values">{row.values}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
