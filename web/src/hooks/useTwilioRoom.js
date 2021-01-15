import { useEffect, useState } from 'react'
import Video from 'twilio-video'

export default function useTwilioRoom({ twilioRoomSid, token, setFrameCapture }) {
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])
  const [dominantSpeaker, setDominantSpeaker] = useState(null)
  const [screenShareParticipant, setScreenShareParticipant] = useState(null)

  // main effect that connects to room and sets up basic subscriptions
  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant])
    }

    const participantDisconnected = participant => {
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant))
      setDominantSpeaker(prevDominantSpeaker => {
        return prevDominantSpeaker === participant ? null : prevDominantSpeaker
      })
    }

    const handleDominantSpeakerChanged = newDominantSpeaker => {
      if (newDominantSpeaker !== null) {
        setDominantSpeaker(newDominantSpeaker)
      }
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { height: 480, frameRate: 24, width: 720 },
      })
      .then(mediaStream => {
        setFrameCapture(new ImageCapture(mediaStream.getVideoTracks()[0]))
        return Video.connect(token, {
          name: twilioRoomSid,
          tracks: mediaStream.getTracks(),
          dominantSpeaker: true,
          maxAudioBitrate: 16000,
          preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
          networkQuality: { local: 1, remote: 1 },
        })
      })
      .then(_room => {
        setRoom(_room)
        _room.on('participantConnected', participantConnected)
        _room.on('participantDisconnected', participantDisconnected)
        _room.on('dominantSpeakerChanged', handleDominantSpeakerChanged)
        _room.participants.forEach(participantConnected)
      })

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(trackPublication => {
            trackPublication.track.stop()
          })
          currentRoom.disconnect()
          return null
        }
        return currentRoom
      })
    }
  }, [twilioRoomSid, token, setFrameCapture])

  // screenshare effect
  useEffect(() => {
    if (room?.state === 'connected') {
      const updateScreenShareParticipant = () => {
        setScreenShareParticipant(
          Array.from(room.participants.values())
            // the screenshare participant could be the localParticipant
            .concat(room.localParticipant)
            .find(participant =>
              Array.from(participant.tracks.values()).find(track =>
                track.trackName.includes('screen'),
              ),
            ),
        )
      }
      updateScreenShareParticipant()

      room.on('trackPublished', updateScreenShareParticipant)
      room.on('trackUnpublished', updateScreenShareParticipant)
      room.on('participantDisconnected', updateScreenShareParticipant)

      // the room object does not emit 'trackPublished' events for the localParticipant,
      // so we need to listen for them here.
      room.localParticipant.on('trackPublished', updateScreenShareParticipant)
      room.localParticipant.on('trackUnpublished', updateScreenShareParticipant)
    }
  }, [room])

  return [room, participants, dominantSpeaker, screenShareParticipant]
}
