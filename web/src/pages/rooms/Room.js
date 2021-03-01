import { addToBatch } from 'engagement/publishFramesToQueue'
import useTwilioRoom from 'hooks/useTwilioRoom'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Card, CardBody, CardHeader } from 'reactstrap'
import LiveEngagementInstructor from './LiveEngagementInstructor'
import LiveEngagementStudent from './LiveEngagementStudent'
import Questions from './Questions'
import VideoChat from './VideoChat'

const styles = {
  roomWrapper: {
    minHeight: '100vh',
    minWidth: '100vw',
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoContainerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '30vw',
    maxHeight: '100vh',
  },
  questionWrapper: {
    maxWidth: '30vw',
    maxHeight: '75vh',
    minHeight: '75vh',
    marginBottom: '0px',
    borderRadius: '0px',
  },
  infoWrapper: {
    maxWidth: '30vw',
    maxHeight: '25vh',
    minHeight: '25vh',
    marginBottom: '0px',
    borderRadius: '0px',
  },
  videoWrapper: {
    maxWidth: '70vw',
    overflow: 'hidden',
  },
}

const Room = ({ room, twilioRoomSid, token, onLeaveRoomHandler }) => {
  const [frameCapture, setFrameCapture] = useState(null)
  const user = useSelector(state => state.user)
  const [twilioRoom, participants, dominantSpeaker, screenShareParticipant] = useTwilioRoom({
    twilioRoomSid,
    token,
    setFrameCapture,
  })

  const canvasRef = useRef(null)

  const onGrabFrame = useCallback(() => {
    frameCapture
      .grabFrame()
      .then(imageBitmap => {
        const base64String = drawCanvas(canvasRef.current, imageBitmap)
        addToBatch(base64String, user.id, room.id)
      })
      .catch(error => console.log(error))
  }, [frameCapture, user.id, room.id])

  // disabling because this useEffect should only run once when frameCapture gets defined
  /* eslint-disable */
  useEffect(() => {
    if (user.role !== 'INSTRUCTOR') {
      const grabFrameTimer = setInterval(() => {
        if (frameCapture != null) {
          onGrabFrame()
        }
      }, 2000)
      return () => clearInterval(grabFrameTimer)
    }
  }, [frameCapture])
  /* eslint-enable */

  return (
    <Card className="card-borderless" style={styles.roomWrapper}>
      <Helmet title={`Rooms | ${room.room_name ?? 'Classroom'}`} />
      {twilioRoom ? (
        <>
          <VideoChat
            style={styles.videoWrapper}
            room={room}
            twilioRoom={twilioRoom}
            participants={participants}
            dominantSpeaker={dominantSpeaker}
            screenShareParticipant={screenShareParticipant}
            onLeaveRoomHandler={onLeaveRoomHandler}
          />
          <Card className="card-borderless" style={styles.infoContainerWrapper}>
            <Card style={styles.infoWrapper}>
              <CardHeader className="card-header-borderless">
                <h5 className="mb-0 mr-2">
                  <i className="fa fa-circle mr-2 font-size-18 text-red" />
                  Live Engagement
                </h5>
              </CardHeader>
              <CardBody style={{ maxWidth: '30vw', minWidth: '30vw' }}>
                {user.role === 'INSTRUCTOR' ? (
                  <LiveEngagementInstructor />
                ) : (
                  <LiveEngagementStudent />
                )}
              </CardBody>
            </Card>
            <Card style={styles.questionWrapper}>
              <Questions />
            </Card>
          </Card>
        </>
      ) : null}
      <div style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}>
        <canvas ref={canvasRef} width={200} height={200} />
      </div>
    </Card>
  )
}

function drawCanvas(canvas, img) {
  canvas.getContext('2d').drawImage(img, 0, 0, 200, 200)
  return canvas.toDataURL()
}

export default Room
