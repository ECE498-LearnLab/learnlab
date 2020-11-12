import { useEffect, useState } from "react"
import Video, { RemoteAudioTrackPublication, RemoteParticipant, RemoteVideoTrackPublication} from "twilio-video"

export type Track = Video.RemoteVideoTrack | Video.RemoteAudioTrack
export type ParticipantTracks = {videoTracks: Track[],audioTracks: Track[]}

type TrackPublication = Video.RemoteVideoTrackPublication | Video.RemoteAudioTrackPublication


export default function useTwilioRoom({ participant } : { participant: RemoteParticipant }): ParticipantTracks {
    const [videoTracks, setVideoTracks] = useState<Track[]>([])
    const [audioTracks, setAudioTracks] = useState<Track[]>([])

    const trackpubsToTracks = (trackMap: Map<string, TrackPublication> ): Track[] =>
      Array.from(trackMap.values())
        .map((publication : RemoteAudioTrackPublication | RemoteVideoTrackPublication) => publication.track)
        .filter((track) => track !== null)

    useEffect(() => {
      setVideoTracks(trackpubsToTracks(participant.videoTracks))
      setAudioTracks(trackpubsToTracks(participant.audioTracks))

      const trackSubscribed = (track: Track) => {
        if (track.kind === "video") {
          setVideoTracks((currVideoTracks: Track[]) => [...currVideoTracks, track])
        } else if (track.kind === "audio") {
          setAudioTracks((currAudioTracks: Track[]) => [...currAudioTracks, track])
        }
      };

      const trackUnsubscribed = (track: Track) => {
        if (track.kind === "video") {
          setVideoTracks((currVideoTracks) => currVideoTracks.filter((v) => v !== track))
        } else if (track.kind === "audio") {
          setAudioTracks((currAudioTracks) => currAudioTracks.filter((a) => a !== track))
        }
      };

      participant.on("trackSubscribed", trackSubscribed)
      participant.on("trackUnsubscribed", trackUnsubscribed)

      return () => {
        setVideoTracks([])
        setAudioTracks([])
        participant.removeAllListeners()
      }
    }, [participant])

  return {
    videoTracks,
    audioTracks,
  }
}
