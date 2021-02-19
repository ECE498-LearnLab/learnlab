import { useState, useCallback, useRef } from 'react'

export default function useScreenShareToggle(room) {
  const [isSharing, setIsSharing] = useState(false)
  const stopScreenShareRef = useRef(null)

  const shareScreen = useCallback(() => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: { height: 720, frameRate: 24, width: 1280 },
      })
      .then(stream => {
        const track = stream.getTracks()[0]

        room.localParticipant
          .publishTrack(track, {
            name: 'screen',
            priority: 'low',
          })
          .then(trackPublication => {
            stopScreenShareRef.current = () => {
              room.localParticipant.unpublishTrack(track)

              room.localParticipant.emit('trackUnpublished', trackPublication)
              track.stop()
              setIsSharing(false)
            }

            track.onended = stopScreenShareRef.current
            setIsSharing(true)
          })
          .catch(error => {
            // Don't display an error if the user closes the screen share dialog
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error(error)
            }
          })
      })
      .catch(error => {
        // Don't display an error if the user closes the screen share dialog
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
          console.error(error)
        }
      })
  }, [room])

  const toggleScreenShare = useCallback(() => {
    if (!isSharing) {
      shareScreen()
    } else {
      stopScreenShareRef.current()
    }
  }, [isSharing, shareScreen, stopScreenShareRef])

  return [isSharing, toggleScreenShare]
}
