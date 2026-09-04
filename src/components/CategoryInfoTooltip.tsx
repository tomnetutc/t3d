import './CategoryInfoTooltip.scss';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const CategoryInfoTooltip: React.FC<{ definition: string }> = ({ definition }) => (
    <Tooltip title={definition} placement="top" arrow>
        <InfoIcon className="category-info-icon" />
    </Tooltip>
);

export default CategoryInfoTooltip;
