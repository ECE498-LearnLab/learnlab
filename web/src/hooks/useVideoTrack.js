import { useEffect } from 'react'

export default function useVideoTrack(
  videoRef,
  videoTracks,
  isMainParticipant,
  doNotAttachVideoTrack,
) {
  const isVideoTrackEnabled = videoTracks[0]?.isEnabled ?? false
  const isScreen = videoTracks.filter(v => v.name === 'screen') > 0

  useEffect(() => {
    const screenTrack = videoTracks.filter(v => v.name === 'screen')[0]
    const videoTrack = screenTrack || videoTracks[0]
    const currentRef = videoRef.current

    if (videoTrack && !doNotAttachVideoTrack) {
      videoTrack.attach(currentRef)
      return () => {
        if (isMainParticipant) {
          videoTrack.detach(currentRef)
        } else {
          videoTrack.detach()
        }
      }
    }
  }, [videoRef, videoTracks, isMainParticipant, doNotAttachVideoTrack])

  return [isVideoTrackEnabled, isScreen]
}
