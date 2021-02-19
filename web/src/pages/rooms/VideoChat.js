// eslint-disable
import Fab from '@bit/mui-org.material-ui.fab'
import { Badge } from 'antd'
import useLocalAudioToggle from 'hooks/useLocalAudioToggle'
import useScreenShareToggle from 'hooks/useScreenShareToggle'
import React, { useState } from 'react'
import { Maximize, Mic, MicOff, Monitor, Users, X } from 'react-feather'
import { Card, CardBody, CardHeader } from 'reactstrap'
import MainParticipant from './MainParticipant'
import RemoteParticipant from './RemoteParticipant'

const styles = {
  videoRoomWrapper: {
    overflow: 'hidden',
  },
  videoBodyWrapper: {
    height: '100%',
    width: '100%',
    padding: '0px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  videoContainer: {
    height: '85%',
    width: '100%',
    padding: '0px',
    position: 'relative',
    backgroundColor: '#141322',
  },
  participantContainer: {
    height: '25%',
    width: '100%',
    padding: '0px',
    position: 'relative',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  otherParticipantsContainer: {
    backgroundColor: 'transparent',
    display: 'flex',
    overflowX: 'scroll',
    flexDirection: 'row',
    height: '100%',
  },
}

const VideoChat = ({
  room,
  twilioRoom,
  participants,
  dominantSpeaker,
  screenShareParticipant,
  onLeaveRoomHandler,
}) => {
  const [isLocalAudioEnabled, toggleIsLocalAudioEnabled] = useLocalAudioToggle(
    twilioRoom.localParticipant,
  )
  const [isSharing, toggleScreenShare] = useScreenShareToggle(twilioRoom)
  const [isAllParticipantsVisible, setIsAllParticipantsVisible] = useState(true)

  const mainParticipant = screenShareParticipant || dominantSpeaker || twilioRoom.localParticipant

  const allParticipantsLength = participants.length + 1
  // eslint-disable-next-line
  const remoteParticipants = participants.map(participant => (
    <RemoteParticipant
      key={participant.identity}
      participant={participant}
      isLocalParticipant={false}
    />
  ))

  return (
    <>
      <Card style={styles.videoWrapper}>
        <CardHeader className="card-header-borderless">
          <h5 className="mb-0 mr-2">
            <i className="fe fe-book-open mr-2 font-size-18 text-muted" />
            {room.room_name}
          </h5>
        </CardHeader>
        <CardBody style={{ maxWidth: '70vw', minWidth: '70vw' }}>
          <div style={styles.videoBodyWrapper}>
            <div style={styles.videoContainer}>
              <MainParticipant
                key="main-participant"
                numParticipants={allParticipantsLength}
                participant={mainParticipant}
                isSharing={isSharing}
                toggleScreenShare={toggleScreenShare}
              >
                <div style={styles.actionContainer}>
                  <div>
                    <Badge className="m-3" count={allParticipantsLength}>
                      <Fab
                        onClick={() => setIsAllParticipantsVisible(!isAllParticipantsVisible)}
                        className="bg-secondary text-white mt-n1"
                        color="inherit"
                        size="medium"
                      >
                        <Users />
                      </Fab>
                    </Badge>
                  </div>
                  <div>
                    <Fab
                      onClick={toggleIsLocalAudioEnabled}
                      className="bg-primary text-white m-2"
                      color="inherit"
                      size="medium"
                    >
                      {isLocalAudioEnabled ? <Mic /> : <MicOff />}
                    </Fab>
                    <Fab
                      onClick={toggleScreenShare}
                      disabled={isSharing}
                      className="bg-primary text-white m-2"
                      color="inherit"
                      size="medium"
                    >
                      <Monitor />
                    </Fab>
                    <Fab
                      onClick={onLeaveRoomHandler}
                      className="bg-white text-danger m-2"
                      color="inherit"
                      size="medium"
                    >
                      <X />
                    </Fab>
                  </div>
                  <div className="m-3">
                    <Fab className="bg-secondary text-white mt-n1" color="inherit" size="medium">
                      <Maximize />
                    </Fab>
                  </div>
                </div>
              </MainParticipant>
            </div>
            <div style={styles.participantContainer}>
              <div className="hideScrollBar" style={styles.otherParticipantsContainer}>
                <RemoteParticipant
                  key={twilioRoom.localParticipant.identity}
                  participant={twilioRoom.localParticipant}
                  isLocalParticipant={true}
                  isLocalAudioEnabled={isLocalAudioEnabled}
                />
                {remoteParticipants}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default VideoChat
