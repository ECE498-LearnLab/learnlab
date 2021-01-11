import { useEffect, useState } from 'react'

export default function useTwilioRoom(participant) {
  const [videoTracks, setVideoTracks] = useState([])
  const [audioTracks, setAudioTracks] = useState([])

  const trackpubsToTracks = trackMap =>
    Array.from(trackMap.values())
      .map(publication => publication.track)
      .filter(track => track !== null)

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks))
    setAudioTracks(trackpubsToTracks(participant.audioTracks))

    const trackSubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(currVideoTracks => [...currVideoTracks, track])
      } else if (track.kind === 'audio') {
        setAudioTracks(currAudioTracks => [...currAudioTracks, track])
      }
    }

    const trackUnsubscribed = track => {
      if (track.kind === 'video') {
        setVideoTracks(currVideoTracks => currVideoTracks.filter(v => v !== track))
      } else if (track.kind === 'audio') {
        setAudioTracks(currAudioTracks => currAudioTracks.filter(a => a !== track))
      }
    }

    const trackMuteUnmute = track => {
      if (track.kind === 'video') {
        setVideoTracks(currVideoTracks => [...currVideoTracks.filter(v => v !== track), track])
      } else if (track.kind === 'audio') {
        setAudioTracks(currAudioTracks => [...currAudioTracks.filter(v => v !== track), track])
      }
    }

    // participant subscriptions
    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackUnsubscribed', trackUnsubscribed)

    // track subscriptions
    const handleTrackDisabled = track => {
      track.on('disabled', trackMuteUnmute)
      track.on('enabled', trackMuteUnmute)
    }

    // publications subscriptions
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        handleTrackDisabled(publication.track)
      }
      publication.on('subscribed', handleTrackDisabled)
    })

    return () => {
      setVideoTracks([])
      setAudioTracks([])
    }
  }, [participant])

  return [videoTracks, audioTracks]
}
