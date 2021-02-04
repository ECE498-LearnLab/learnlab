import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { generateAccessToken } from 'utils/accessToken'
import EngagementGraph from './EngagementGraph'
import Lobby from './Lobby'
import Room from './Room'

const Classroom = () => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)
  const user = useSelector(state => state.user)
  const [selectedRoom, setSelectedRoom] = useState('')
  const dispatch = useDispatch()

  const onLeaveRoomHandler = useCallback(() => {
    setSelectedRoom(null)
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        videoGrantToken: '',
        isInRoomSession: false,
      },
    })
  }, [setSelectedRoom, dispatch])

  const onJoinRoomHandler = useCallback(
    _selectedRoom => {
      setSelectedRoom(_selectedRoom)
      const videoToken = generateAccessToken(
        `${user.first_name} ${user.last_name}`,
        _selectedRoom.room_uuid,
      )
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          videoGrantToken: videoToken,
          isInRoomSession: true,
        },
      })
    },
    [user.first_name, user.last_name, setSelectedRoom, dispatch],
  )

  if (selectedClassId === '') {
    // redirect to home so they choose a damn course
    return (
      <div>
        <Redirect to="/home" />
      </div>
    )
  }

  if (user.videoGrantToken !== '' && user.videoGrantToken != null && user.isInRoomSession) {
    return (
      <>
        <EngagementGraph />
        <Room
          room={selectedRoom}
          twilioRoomSid={selectedRoom.room_uuid}
          token={user.videoGrantToken}
          onLeaveRoomHandler={onLeaveRoomHandler}
        />
      </>
    )
  }

  return <Lobby onJoinRoomHandler={onJoinRoomHandler} />
}

export default Classroom
