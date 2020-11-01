import React, { useCallback, useRef } from 'react';

<<<<<<< HEAD
import { IconButton } from '@material-ui/core';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
=======
import Button from '@material-ui/core/Button';
import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9

import { useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

<<<<<<< HEAD
const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

=======
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const hasVideoDevices = useHasVideoInputDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
<<<<<<< HEAD
    <IconButton
      style={buttonStyle}
      onClick={toggleVideo}
      disabled={!hasVideoDevices || props.disabled}
    >
      {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
    </IconButton>
=======
    <Button
      className={props.className}
      onClick={toggleVideo}
      disabled={!hasVideoDevices || props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    >
      {!hasVideoDevices ? 'No Video' : isVideoEnabled ? 'Stop Video' : 'Start Video'}
    </Button>
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
  );
}
