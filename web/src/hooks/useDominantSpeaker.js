import { useEffect, useState } from 'react'

export default function useDominantSpeaker(room) {
    const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker)

    useEffect(() => {
      const handleDominantSpeakerChanged = (newDominantSpeaker) => {
        if (newDominantSpeaker !== null) {
          setDominantSpeaker(newDominantSpeaker)
        }
      }
      const handleParticipantDisconnected = (participant) => {
        setDominantSpeaker(prevDominantSpeaker => {
          return prevDominantSpeaker === participant ? null : prevDominantSpeaker
        })
      }
      room.on('dominantSpeakerChanged', handleDominantSpeakerChanged)
      room.on('participantDisconnected', handleParticipantDisconnected)
    }, [room])
  
  return dominantSpeaker
}
