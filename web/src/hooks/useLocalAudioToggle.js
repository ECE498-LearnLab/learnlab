import { useState, useCallback } from 'react'

export default function useLocalAudioToggle(localParticipant) {
  const audioTracks = localParticipant?.audioTracks ?? null
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true)

  const toggleIsLocalAudioEnabled = useCallback(() => {
    if (audioTracks) {
      audioTracks.forEach(publication => {
        if (isLocalAudioEnabled) {
          publication.track.disable()
          setIsLocalAudioEnabled(false)
        } else if (!isLocalAudioEnabled) {
          publication.track.enable()
          setIsLocalAudioEnabled(true)
        }
      })
    }
  }, [isLocalAudioEnabled, setIsLocalAudioEnabled, audioTracks])

  return [isLocalAudioEnabled, toggleIsLocalAudioEnabled]
}
