import React, { useState, useEffect } from 'react'
import useTwilioRoom from '../hooks/useTwilioRoom'
import Participant from './Participant'

const Room = ({ twilioRoomSid, token, handleLogout }) => {
  const {room, participants} = useTwilioRoom({twilioRoomSid, token})

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ))

  return (
    <div className="room">
      <h2>Room: {twilioRoomSid}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  )
}

export default Room;
