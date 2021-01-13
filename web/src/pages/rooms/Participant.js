import { Avatar } from 'antd'
import { AntDesignOutlined } from '@ant-design/icons'
import React from 'react'

const styles = {
  videoStyle: {
    height: '100%',
    width: '100%',
    borderRadius: '16px',
    objectFit: 'cover',
  },
  videoWrapper: {
    height: '100%',
    width: '100%',
    display: 'block',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const Participant = ({ videoRef, audioRef, isAudioTrackEnabled, isVideoTrackEnabled }) => {
  return (
    <div style={styles.videoWrapper}>
      {isVideoTrackEnabled ? (
        <video className="shadow-sm" style={styles.videoStyle} ref={videoRef} autoPlay />
      ) : (
        <div style={styles.fallbackContainer}>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<AntDesignOutlined />}
          />
          ,
        </div>
      )}
      <audio ref={audioRef} autoPlay={true} muted={!isAudioTrackEnabled} />
    </div>
  )
}

export default Participant
