import React from 'react';

import { IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <IconButton
      style={buttonStyle}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
    >
      {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
    </IconButton>
  );
}
