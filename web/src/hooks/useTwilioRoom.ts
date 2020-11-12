import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import Video, { Room } from "twilio-video"

export default function useTwilioRoom({ twilioRoomSid, token }: { twilioRoomSid: string, token: string }) {
    const [room, setRoom] = useState(null)
    const [participants, setParticipants] = useState([])

    useEffect(() => {
      const participantConnected = participant => {
        setParticipants(prevParticipants => [...prevParticipants, participant])
      };

      const participantDisconnected = participant => {
        setParticipants(prevParticipants =>
          prevParticipants.filter(p => p !== participant)
        );
      };

      Video.connect(token, {
        name: twilioRoomSid
      }).then((room: Room) => {
        setRoom(room);
        room.on('participantConnected', participantConnected)
        room.on('participantDisconnected', participantDisconnected)
        room.participants.forEach(participantConnected)
      });

      return () => {
        setRoom(currentRoom => {
          if (currentRoom && currentRoom.localParticipant.state === 'connected') {
            currentRoom.localParticipant.tracks.forEach((trackPublication) => {
              trackPublication.track.stop()
            });
            currentRoom.disconnect()
            return null
          } else {
            return currentRoom
          }
        });
      };
    }, [twilioRoomSid, token])

  return {
    room,
    participants
  }
}
