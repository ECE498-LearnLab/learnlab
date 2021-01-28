import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { generateAccessToken } from 'utils/accessToken'
import Lobby from './Lobby'
import Room from './Room'

const Classroom = () => {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [token, setToken] = useState(null)
  const user = useSelector(state => state.user)

  const onLeaveRoomHandler = useCallback(() => {
    setToken(null)
    setSelectedRoom(null)
  }, [])

  const onJoinRoomHandler = useCallback(
    _selectedRoom => {
      setSelectedRoom(_selectedRoom)
      setToken(generateAccessToken(`${user.first_name} ${user.last_name}`, _selectedRoom.room_uuid))
    },
    [user.first_name, user.last_name],
  )

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
