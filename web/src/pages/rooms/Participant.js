import { uniqueHslColor } from 'components/learnlab/UserAvatar'
import React from 'react'
import { useSelector } from 'react-redux'

const styles = {
  videoStyle: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  videoWrapper: {
    height: '100%',
    width: '100%',
    display: 'block',
  },
  fallbackContainer: {
    width: 'inherit',
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const Participant = ({
  identity,
  videoRef,
  audioRef,
  isAudioTrackEnabled,
  isVideoTrackEnabled,
  isScreen,
}) => {
  const currentUser = useSelector(state => state.user)
  const user = {
    first_name: identity.split(' ')[0],
    last_name: identity.split(' ')[1],
    role: identity.split(' ')[2],
  }
  return (
    <div style={styles.videoWrapper}>
      {isVideoTrackEnabled &&
      (user.role === '(INSTRUCTOR)' || isScreen || currentUser.role === 'INSTRUCTOR') ? (
        <video className="shadow-sm" style={styles.videoStyle} ref={videoRef} autoPlay />
      ) : (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div
            style={{
              backgroundColor: uniqueHslColor(`${user.first_name} ${user.last_name}`),
              ...styles.fallbackContainer,
            }}
          >
            <h2 className="text-white">
              {user.first_name[0].toUpperCase() ?? ''}
              {user.last_name[0].toUpperCase() ?? ''}
            </h2>
          </div>
        </div>
      )}
      <audio ref={audioRef} autoPlay={true} muted={!isAudioTrackEnabled} />
    </div>
  )
}

export default Participant
