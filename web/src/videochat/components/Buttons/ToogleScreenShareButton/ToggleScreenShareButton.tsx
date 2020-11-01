import React from 'react';
<<<<<<< HEAD

import { IconButton } from '@material-ui/core';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
=======
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ScreenShareIcon from '../../../icons/ScreenShareIcon';
import Tooltip from '@material-ui/core/Tooltip';
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9

import useScreenShareParticipant from '../../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

<<<<<<< HEAD
const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

export default function ToggleScreenShareButton(props: { disabled?: boolean }) {
=======
export const SCREEN_SHARE_TEXT = 'Share Screen';
export const STOP_SCREEN_SHARE_TEXT = 'Stop Sharing Screen';
export const SHARE_IN_PROGRESS_TEXT = 'Cannot share screen when another user is sharing';
export const SHARE_NOT_SUPPORTED_TEXT = 'Screen sharing is not supported with this browser';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      '&[disabled]': {
        color: '#bbb',
        '& svg *': {
          fill: '#bbb',
        },
      },
    },
  })
);

export default function ToggleScreenShareButton(props: { disabled?: boolean }) {
  const classes = useStyles();
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
  const screenShareParticipant = useScreenShareParticipant();
  const { toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = Boolean(screenShareParticipant);
  const isScreenShareSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled = props.disabled || disableScreenShareButton || !isScreenShareSupported;

<<<<<<< HEAD
  return (
    <IconButton
       style={buttonStyle}
       onClick={toggleScreenShare}
       disabled={isDisabled}
       data-cy-share-screen
    >
      {!isDisabled ? <ScreenShareIcon /> : <StopScreenShareIcon/> }
    </IconButton>
=======
  let tooltipMessage = '';

  if (disableScreenShareButton) {
    tooltipMessage = SHARE_IN_PROGRESS_TEXT;
  }

  if (!isScreenShareSupported) {
    tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
  }

  return (
    <Tooltip
      title={tooltipMessage}
      placement="top"
      PopperProps={{ disablePortal: true }}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    >
      <span>
        {/* The span element is needed because a disabled button will not emit hover events and we want to display
          a tooltip when screen sharing is disabled */}
        <Button
          className={classes.button}
          onClick={toggleScreenShare}
          disabled={isDisabled}
          startIcon={<ScreenShareIcon />}
          data-cy-share-screen
        >
          {SCREEN_SHARE_TEXT}
        </Button>
      </span>
    </Tooltip>
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
  );
}
