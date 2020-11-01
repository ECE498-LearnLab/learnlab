import React from 'react';

<<<<<<< HEAD
import { IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
=======
import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

<<<<<<< HEAD
const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

=======
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
<<<<<<< HEAD
    <IconButton
      style={buttonStyle}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
    >
      {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
    </IconButton>
=======
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? 'No Audio' : isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
  );
}
