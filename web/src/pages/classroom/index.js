import React, { useState, useCallback } from 'react'
import { generateAccessToken } from 'utils/accessToken'
import Lobby from './Lobby'
import Room from './Classroom'

const Classroom = () => {
  const [username, setUsername] = useState('')
  const [roomName, setRoomName] = useState('')
  const [token, setToken] = useState(null)

  const handleUsernameChange = useCallback(event => {
    setUsername(event.target.value)
  }, [])

  const handleRoomNameChange = useCallback(event => {
    setRoomName(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault()
      setToken(generateAccessToken(username, roomName))
    },
    [roomName, username],
  )

  const onLeaveRoomHandler = useCallback(() => {
    setToken(null)
  }, [])

  let render
  if (token) {
    render = <Room twilioRoomSid={roomName} token={token} onLeaveRoomHandler={onLeaveRoomHandler} />
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
    )
  }
  return render
}

export default Classroom
