import React, { useCallback, useRef } from 'react';

import { IconButton } from '@material-ui/core';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import { useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

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
    <IconButton
      style={buttonStyle}
      onClick={toggleVideo}
      disabled={!hasVideoDevices || props.disabled}
    >
      {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
    </IconButton>
  );
}
