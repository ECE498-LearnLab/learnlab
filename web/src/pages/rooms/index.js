import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { generateAccessToken } from 'utils/accessToken'
import Lobby from './Lobby'
import Room from './Room'

const Classroom = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const onLeaveRoomHandler = useCallback(() => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        videoGrantToken: '',
        isInRoomSession: false,
        selectedRoom: null,
      },
    })
  }, [dispatch])

  const onJoinRoomHandler = useCallback(
    _selectedRoom => {
      const videoToken = generateAccessToken(user, _selectedRoom.room_uuid)
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          videoGrantToken: videoToken,
          isInRoomSession: true,
          selectedRoom: _selectedRoom,
        },
      })
    },
    [user, dispatch],
  )

  if (selectedClassId === '') {
    // redirect to home so they choose a damn course
    return (
      <div>
        <Redirect to="/home" />
      </div>
    )
  }

  if (
    user.selectedRoom !== null &&
    user.videoGrantToken !== '' &&
    user.videoGrantToken != null &&
    user.isInRoomSession
  ) {
    return (
      <Room
        room={user.selectedRoom}
        twilioRoomSid={user.selectedRoom.room_uuid}
        token={user.videoGrantToken}
        onLeaveRoomHandler={onLeaveRoomHandler}
      />
    )
  }

  return <Lobby onJoinRoomHandler={onJoinRoomHandler} />
}

export default Classroom
