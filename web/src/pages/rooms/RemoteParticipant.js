import useAudioTrack from 'hooks/useAudioTrack'
import useParticipant from 'hooks/useParticipant'
import useVideoTrack from 'hooks/useVideoTrack'
import React, { useRef } from 'react'
import { MicOff } from 'react-feather'
import Participant from './Participant'

const styles = {
  remoteParticipantWrapper: {
    maxWidth: '25%',
    minWidth: '25%',
    position: 'relative',
  },
  identityWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
  },
  trackWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const RemoteParticipant = ({ participant, isLocalParticipant }) => {
  const [videoTracks, audioTracks] = useParticipant(participant)
  const videoRef = useRef()
  const audioRef = useRef()

  // only mount the audio track if it's not the local participant
  const [isAudioTrackEnabled] = useAudioTrack(audioRef, audioTracks, isLocalParticipant)
  const [isVideoTrackEnabled, isScreen] = useVideoTrack(videoRef, videoTracks, false, false)

  const participantName = `${participant.identity.split(' ')[0]} ${
    participant.identity.split(' ')[1]
  }`

  return (
    <div className="py-1" style={styles.remoteParticipantWrapper}>
      <Participant
        key={participant.sid}
        identity={participant.identity}
        audioRef={audioRef}
        videoRef={videoRef}
        isVideoTrackEnabled={isVideoTrackEnabled}
        isAudioTrackEnabled={isAudioTrackEnabled && !isLocalParticipant}
        isScreen={isScreen}
      />
      <div style={styles.identityWrapper} className="m-2">
        <h5 className="text-white">
          {participantName}
          {isLocalParticipant ? (
            <small className="text-default"> (You) </small>
          ) : (
            <small className="text-default"> {participant.identity.split(' ')[2]} </small>
          )}
        </h5>
      </div>
      {!isAudioTrackEnabled ? (
        <div style={styles.trackWrapper} className="m-2">
          <span style={styles.iconContainer} className="bg-red">
            <MicOff className="text-white" size={12} />
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default RemoteParticipant
