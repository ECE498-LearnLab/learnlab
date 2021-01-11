import { useEffect } from 'react'

export default function useAudioTrack(audioRef, audioTracks, doNotAttachAudioTrack) {
  const isAudioTrackEnabled = audioTracks[0]?.isEnabled ?? false
  
  useEffect(() => {
    const audioTrack = audioTracks[0]
    if (audioTrack && !doNotAttachAudioTrack) {
      audioTrack.attach(audioRef.current)
      return () => {
        audioTrack.detach()
      }
    }
  }, [audioRef, doNotAttachAudioTrack, audioTracks])

  return [isAudioTrackEnabled]
}
