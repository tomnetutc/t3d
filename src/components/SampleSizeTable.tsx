import { Container, Table } from "react-bootstrap";
import exportFromJSON from "export-from-json";
import Download from "../images/download-solid.svg";
import { SampleSizeTableProps } from "./Types";
import { DSVRowString } from "d3";

export default function SampleSizeTable({
    years,
    counts,
}: SampleSizeTableProps): JSX.Element {
    counts.map((count: any) => {
        const existingYears = count?.count?.map((ele: any) => {
            return ele[0];
        });
        years.map((year: any) => {
            if (!existingYears.includes(year)) {
                count.count.push([year, 0]);
            }
        });
        count.count.sort();
    });

    function downloadProfile(data: DSVRowString<string>[], index: number): void {
        const fileName = index == 0 ? "Full Sample" : `Profile-${index}`;
        exportFromJSON({ data, fileName, fields: [], exportType: "csv" });
    }

    const boxStyle = {
        padding: "20px 0",
        borderRadius: "10px",
        boxShadow: "2px 4px 10px 1px rgba(201, 201, 201, 0.47)",
        backgroundColor: "white"
    };

    return (
        <div style={boxStyle}>
            {/* <hr className="hr-spec" /> */}
            <h5 className="text-center fw-bold">Sample sizes</h5>
            <Table responsive>
                <thead>
                    <tr>
                        <th style={{ fontSize: "15px" }}>Year</th>
                        {years.map((year: any, index: any) => {
                            return (
                                <th key={index} style={{ fontSize: "15px" }}>
                                    {year}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {counts.map((count: any, index: any) => {
                        return (
                            <tr key={index}>
                                {index === 0 ? (
                                    <td style={{ fontSize: "15px", display: "flex" }}>
                                        <span>Selected segment</span>
                                        <button
                                            title="Download sample"
                                            className="btn profilebutton"
                                            // onClick={() => downloadProfile(count.data, index)}
                                            style={{
                                                padding: "0px",
                                                margin: "0px 0px 0px 5px",
                                                transform: "translate(0px, -2px)",
                                            }}
                                        >
                                            {/* <img
                                                src={Download}
                                                height="18px"
                                                width="30px"
                                                alt="Solid Download"
                                            ></img> */}
                                        </button>
                                    </td>
                                ) : (
                                    <td style={{ fontSize: "15px" }}>
                                        Profile {index}
                                        <button
                                            title="Download sample"
                                            className="btn profilebutton"
                                            style={{
                                                padding: "0px",
                                                margin: "0px 0px 0px 5px",
                                                transform: "translate(0px, -2px)",
                                            }}
                                        >
                                            {/* <img
                                                src={Download}
                                                height="18px"
                                                width="30px"
                                                onClick={() => downloadProfile(count.data, index)}
                                                alt="Solid Download"
                                            ></img> */}
                                        </button>
                                    </td>
                                )}
                                {count?.count?.map((c: any, idx: any) => {
                                    return (
                                        <td key={idx} style={{ fontSize: "15px" }}>
                                            {c[1].toLocaleString("en-US")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    )
}