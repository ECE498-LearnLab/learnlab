import React, { useCallback, useState } from 'react'
import { generateAccessToken } from 'utils/accessToken'
import Room from './Room'
import Lobby from './Lobby'

const Classroom = () => {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [token, setToken] = useState(null)

  // const joinRoom = useCallback(
  //   async event => {
  //     event.preventDefault()
  //     // to-do: for now we're generating random user name, once we have user management set up, change this
  //     setToken(generateAccessToken(Math.floor(Math.random()*16777215).toString(16), selectedRoom.room_uuid))
  //   },
  //   [selectedRoom],
  // )

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

  let render
  if (token) {
    render = (
      <Room
        room={selectedRoom}
        twilioRoomSid={selectedRoom.room_uuid}
        token={token}
        onLeaveRoomHandler={onLeaveRoomHandler}
      />
    )
  } else {
    render = <Lobby onJoinRoomHandler={onJoinRoomHandler} />
  }
  return render
}

export default Classroom
