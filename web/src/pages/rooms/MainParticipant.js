import { Button } from 'antd'
import useParticipant from 'hooks/useParticipant'
import useVideoTrack from 'hooks/useVideoTrack'
import React, { useRef } from 'react'
import Participant from './Participant'

const styles = {
  mainParticipantContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
const MainParticipant = ({
  children,
  participant,
  numParticipants,
  isSharing,
  toggleScreenShare,
}) => {
  const [videoTracks] = useParticipant(participant)
  const videoRef = useRef()
  const isOnlyOneParticipant = numParticipants === 1
  const doNotAttachVideoTrack = isSharing || isOnlyOneParticipant
  const [isVideoTrackEnabled, isScreen] = useVideoTrack(
    videoRef,
    videoTracks,
    true,
    doNotAttachVideoTrack,
  )

  const mainParticipantView = !isOnlyOneParticipant ? (
    <div key={`main-participant-${participant.sid}`} style={styles.mainParticipantContainer}>
      <Participant
        key={`main-participant-${participant.sid}`}
        identity={participant.identity}
        audioRef={null}
        videoRef={videoRef}
        isVideoTrackEnabled={isVideoTrackEnabled}
        isAudioTrackEnabled={false}
        isScreen={isScreen}
      />
      {children}
    </div>
  ) : (
    <div key={`main-participant-${participant.sid}`} style={styles.mainParticipantContainer}>
      <h6 className="text-white">You are the only one here</h6>
      {children}
    </div>
  )

  return !isSharing ? (
    mainParticipantView
  ) : (
    <div style={styles.mainParticipantContainer}>
      <h6 className="text-white">You are sharing your screen</h6>
      <Button onClick={toggleScreenShare} type="danger" shape="round">
        Stop Sharing
      </Button>
      {children}
    </div>
  )
}

export default MainParticipant
