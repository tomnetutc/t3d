import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import './InfoBox.scss';

const InfoBox = ({ children, style }) => {
  return (
    <>
      <div className="info-box-position" style={style}>
        <Tooltip title={children}>
          <InfoIcon className="info-icon" />
        </Tooltip>
      </div>
    </>
  );
};

export default InfoBox;
