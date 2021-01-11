import { useState, useCallback } from 'react'

export default function useLocalVideoToggle(localParticipant) {
  const videoTracks = localParticipant?.videoTracks ?? null
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true)
  const toggleIsLocalVideoEnabled = useCallback(() => {
    if (videoTracks) {
      videoTracks.forEach(publication => {
        if(publication.trackName !== 'screen'){
          if (isLocalVideoEnabled) {
            publication.track.disable()
            setIsLocalVideoEnabled(false)
          } else if(!isLocalVideoEnabled) {
            publication.track.enable()
            setIsLocalVideoEnabled(true)
          }
        }
      })
    }
  }, [isLocalVideoEnabled, setIsLocalVideoEnabled, videoTracks])

  return [isLocalVideoEnabled, toggleIsLocalVideoEnabled]
}
