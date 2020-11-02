import React from 'react';

import { IconButton } from '@material-ui/core';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';

import useScreenShareParticipant from '../../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

export default function ToggleScreenShareButton(props: { disabled?: boolean }) {
  const screenShareParticipant = useScreenShareParticipant();
  const { toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = Boolean(screenShareParticipant);
  const isScreenShareSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled = props.disabled || disableScreenShareButton || !isScreenShareSupported;

  return (
    <IconButton
       style={buttonStyle}
       onClick={toggleScreenShare}
       disabled={isDisabled}
       data-cy-share-screen
    >
      {!isDisabled ? <ScreenShareIcon /> : <StopScreenShareIcon/> }
    </IconButton>
  );
}
