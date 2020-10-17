import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import {
  EuiFlexItem,
  EuiFlexGroup,
} from '@elastic/eui';

interface Props {
  roomName: string,
  token: string | null,
  setImageCapture: React.Dispatch<any>,
};

const Room = (props : Props) => {
  const {roomName, token, setImageCapture} = props;
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const participantConnected = (participant: any) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: any) => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then((mediaStream) => {
      setImageCapture(new ImageCapture(mediaStream.getVideoTracks()[0]));
      return Video.connect(token, {
        name: roomName,
        tracks: mediaStream.getTracks()
      });
    // tslint:disable-next-line: no-shadowed-variable
    }).then((room) => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom != null && (currentRoom as any).localParticipant.state === 'connected') {
          (currentRoom as any).localParticipant.tracks.forEach((trackPublication: { track: { stop: () => void; }; }) => {
            trackPublication.track.stop();
          });
          (currentRoom as any).disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, setImageCapture, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} style={participantListStyle} participant={participant} />
  ));

  if (room != null){
  return (
      <EuiFlexGroup gutterSize="s" direction="column">
        <Participant 
          key={room?.localParticipant.sid}
          participant={room?.localParticipant}
          style={mainStyle}
        />
        <EuiFlexItem style={{overflowX: 'auto', maxHeight: '200px'}}>
          <EuiFlexGroup gutterSize="xs">
            {remoteParticipants}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
  else {
    return null;
  }
};

const mainStyle = {width: '100%', height: 'auto'}
const participantListStyle = {width: 'auto', height:'200px'}

export default Room;
