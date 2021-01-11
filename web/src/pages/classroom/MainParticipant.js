import React, { useRef } from 'react'
import useParticipant from 'hooks/useParticipant'
import useVideoTrack from 'hooks/useVideoTrack'
import { Button } from 'antd'
import Participant from './Participant'

const styles = {
  sharingScreenContainer: {
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}
const MainParticipant = ({ participant, numParticipants, isSharing, toggleScreenShare }) => {
    const [videoTracks] = useParticipant(participant)
    const videoRef = useRef()
    const isOnlyOneParticipant = numParticipants === 1
    const doNotAttachVideoTrack = isSharing || isOnlyOneParticipant
    const [isVideoTrackEnabled, isScreen] = useVideoTrack(videoRef, videoTracks, true, doNotAttachVideoTrack)

    const mainParticipantView = !isOnlyOneParticipant ? 
      <Participant 
        key={`main-participant-${participant.sid}`} 
        audioRef={null}
        videoRef={videoRef} 
        isVideoTrackEnabled={isVideoTrackEnabled} 
        isAudioTrackEnabled={false} 
        isScreen={isScreen}
      /> : 
      <div key={`main-participant-${participant.sid}`} style={styles.sharingScreenContainer}>
        <h6 className="text-white">You are the only one here</h6>
      </div>

    return (
      !isSharing 
      ? mainParticipantView :
      <div style={styles.sharingScreenContainer}>
        <h6 className="text-white">You are sharing your screen</h6>
        <Button onClick={toggleScreenShare} type="danger" shape="round">
          Stop Sharing
        </Button>
      </div>
  )
}

export default MainParticipant
