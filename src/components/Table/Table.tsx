import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './Table.scss';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';


interface ChangeDetails {
    tripDataChange: string;
    tripDataPercentChange: string;
    durationDataChange: string;
    durationDataPercentChange: string;
}

const MaterialsTable: React.FC<{ title: string; optionChanges: any; activeOption: string; displayType: string }> = ({ title, optionChanges, activeOption, displayType }) => {

    const parsePercentage = (value: string) => parseFloat(value.replace('%', ''));

    const getIcon = (value: string) => {
        const numericValue = parsePercentage(value);
        if (numericValue > 0) {
            return <ArrowDropUpIcon sx={{ color: 'green', fontSize: 'inherit' }} />;
        } else if (numericValue < 0) {
            return <ArrowDropDownIcon sx={{ color: 'red', fontSize: 'inherit' }} />;
        } else {
            return <FiberManualRecordOutlinedIcon sx={{ color: 'grey', fontSize: 'inherit' }} />;
        }

    };


    return (
        <div className="table-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }} className="table-content">
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ borderBottom: 'line', fontWeight: 'bold', padding: '2px 0px' }}>{activeOption}</TableCell>
                            <TableCell align="right" sx={{ borderBottom: 'line', fontWeight: 'bold', padding: ' 2px 0px' }}>
                                {displayType == "Trips" ? "Δ trip (%)" : "Δ duration (%)"}

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(optionChanges).map(([label, changes]) => (
                            <TableRow key={label} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="left" component="th" scope="row" sx={{ borderBottom: 'none', padding: activeOption === "Trip purpose" ? '6px 0px' : '17px 0px' }}>
                                    {label}
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: 'none', padding: activeOption === "Trip purpose" ? '6px 0px' : '17px 0px' }}>
                                    {displayType === "Trips" ?
                                        <>
                                            {(changes as ChangeDetails).tripDataChange} {' '}
                                            ({(changes as ChangeDetails).tripDataPercentChange})
                                            {getIcon((changes as ChangeDetails).tripDataPercentChange)}

                                        </> :
                                        <>
                                            {(changes as ChangeDetails).durationDataChange} {' '}
                                            ({(changes as ChangeDetails).durationDataPercentChange})
                                            {getIcon((changes as ChangeDetails).durationDataPercentChange)}

                                        </>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MaterialsTable;
