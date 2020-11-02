import React from 'react';

import { IconButton } from '@material-ui/core';
import CallEndIcon from '@material-ui/icons/CallEnd';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

export default function EndCallButton(props: { className?: string }) {
  const { room } = useVideoContext();

  return (
    <IconButton aria-label="end call" onClick={() => room.disconnect()} style={buttonStyle}>
      <CallEndIcon />
    </IconButton>
  );
}
