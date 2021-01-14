import React, { useCallback, useState } from 'react'
import { generateAccessToken } from 'utils/accessToken'
import Lobby from './Lobby'
import Room from './Room'

const Classroom = () => {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [token, setToken] = useState(null)

  const onLeaveRoomHandler = useCallback(() => {
    setToken(null)
    setSelectedRoom(null)
  }, [])

  const onJoinRoomHandler = useCallback(_selectedRoom => {
    setSelectedRoom(_selectedRoom)
    // to-do: for now we're generating random user name, once we have user management set up, change this
    setToken(
      generateAccessToken(
        Math.floor(Math.random() * 16777215).toString(16),
        _selectedRoom.room_uuid,
      ),
    )
  }, [])

  if (token)
    return (
      <Room
        room={selectedRoom}
        twilioRoomSid={selectedRoom.room_uuid}
        token={token}
        onLeaveRoomHandler={onLeaveRoomHandler}
      />
    )
  return <Lobby onJoinRoomHandler={onJoinRoomHandler} />
}

export default Classroom
