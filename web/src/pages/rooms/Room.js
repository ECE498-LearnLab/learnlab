import { message } from 'antd'
import { addToBatch } from 'engagement/publishFramesToQueue'
import useTwilioRoom from 'hooks/useTwilioRoom'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage, useIntl } from 'react-intl'
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
  const [alertShown, setAlertShown] = useState(false)
  const user = useSelector(state => state.user)
  const [twilioRoom, participants, dominantSpeaker, screenShareParticipant] = useTwilioRoom({
    twilioRoomSid,
    token,
    setFrameCapture,
  })
  const intl = useIntl()
  const canvasRef = useRef(null)

  const onGrabFrame = useCallback(() => {
    if (frameCapture.track.readyState === 'live') {
      frameCapture
        .grabFrame()
        .then(imageBitmap => {
          const base64String = drawCanvas(canvasRef.current, imageBitmap)
          addToBatch(base64String, user.id, room.id)
        })
        .catch(error => console.log(error))
    }
  }, [frameCapture, user.id, room.id])

  const showAlertMessage = useCallback(() => {
    if (!alertShown) {
      setAlertShown(true)
      message.info(`${intl.formatMessage({ id: 'room.student.info' })}`).then(() => {
        setAlertShown(false)
      })
    }
  }, [intl, alertShown, setAlertShown])

  // disabling because this useEffect should only run once when frameCapture gets defined
  /* eslint-disable */
  useEffect(() => {
    if (user.role !== 'INSTRUCTOR') {
      showAlertMessage()
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
                  <FormattedMessage id="room.title.engagement" />
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
      <HandleBrowserBackButton onLeaveRoomHandler={onLeaveRoomHandler} />
    </Card>
  )
}

const HandleBrowserBackButton = ({ onLeaveRoomHandler }) => {
  const [isBackButtonClicked, setBackbuttonPress] = useState(false)
  window.history.pushState(null, null, window.location.pathname)
  useEffect(() => {
    window.addEventListener('popstate', onBackButtonEvent)

    return () => {
      window.removeEventListener('popstate', onBackButtonEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onBackButtonEvent = e => {
    e.preventDefault()
    /* eslint-disable */
    if (!isBackButtonClicked) {
      if (window.confirm('Do you want to exit the room?')) {
        setBackbuttonPress(true)
        onLeaveRoomHandler()
      }
    }
    /* eslint-enable */
  }

  return <div />
}

function drawCanvas(canvas, img) {
  canvas.getContext('2d').drawImage(img, 0, 0, 200, 200)
  return canvas.toDataURL()
}

export default Room
