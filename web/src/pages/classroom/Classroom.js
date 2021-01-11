import React, {useEffect, useState, useRef, useCallback} from 'react'
import {addToBatch} from 'engagement/publishFramesToQueue'
import useTwilioRoom from 'hooks/useTwilioRoom'
import { Tabs } from 'antd'
import {
  Card, CardBody, CardHeader, 
} from 'reactstrap'
import VideoChat from './VideoChat'

const { TabPane } = Tabs

const styles = {
  roomWrapper: {
    minHeight: 'calc(100vh - 124px)',
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    backgroundColor: 'white', 
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoWrapper: {
    overflow: 'auto',
    flexGrow: 1,
  },
  videoWrapper: {
    overflow: 'hidden',
    flexGrow: 2,
    maxWidth: '60%'
  },
}

const Classroom = ({ twilioRoomSid, token, onLeaveRoomHandler }) => {
  const [frameCapture, setFrameCapture] = useState(null)
  const [room, participants, dominantSpeaker, screenShareParticipant] = useTwilioRoom({ twilioRoomSid, token, setFrameCapture })
  
  const canvasRef = useRef(null)
  
  const onGrabFrame = useCallback(() => {
    console.log("grabbing frame")
    frameCapture.grabFrame()
    .then(imageBitmap => {
      const base64String = drawCanvas(canvasRef.current, imageBitmap)
      addToBatch(base64String)
    },[])
    .catch(error => console.log(error))
  }, [frameCapture])

  // disabling because this useEffect should only run once when frameCapture gets defined
  /* eslint-disable */
  useEffect(() => {
    const grabFrameTimer = setInterval(() => {
      if (frameCapture != null){
        onGrabFrame()
      }
    }, 400)
    return () => clearInterval(grabFrameTimer)
  }, [frameCapture])
  /* eslint-enable */

  return (
    <Card style={styles.roomWrapper}>
      {room ? (
        <>
          <VideoChat 
            style={styles.videoWrapper}
            room={room} 
            participants={participants} 
            dominantSpeaker={dominantSpeaker} 
            screenShareParticipant={screenShareParticipant} 
            onLeaveRoomHandler={onLeaveRoomHandler}
          />
          <Card style={styles.infoWrapper}>
            <CardHeader className="card-header-borderless">
              <Tabs defaultActiveKey="1" className="kit-tabs">
                <TabPane tab="Questions" key="1" />
                <TabPane tab="Engagement" key="2" />
              </Tabs>
            </CardHeader>
            <CardBody>
              <div style={{width: '200px', height: '300px'}}>
                <canvas ref={canvasRef} width={360} height={240} />
              </div>
            </CardBody>
          </Card>
        </>
      ) : null}
    </Card>
  )
}

function drawCanvas(canvas, img) {
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL()
}

export default Classroom
