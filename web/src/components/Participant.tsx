import React, { useState, useEffect, useRef } from "react";
import useParticipant, { ParticipantTracks, Track } from '../hooks/useParticipant';

const Participant = ({ participant }) => {
  const {videoTracks, audioTracks}: ParticipantTracks = useParticipant({participant});

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true}/>
    </div>
  );
};

export default Participant;
