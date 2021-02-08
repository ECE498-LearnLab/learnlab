import { gql, useQuery, useMutation } from '@apollo/client'
import { Avatar, notification } from 'antd'
import UserAvatar from 'components/learnlab/UserAvatar'
import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import style from './style.module.scss'

const STATUS_MAP = {
  SCHEDULED: {
    color: 'primary',
    statusMessage: 'lobbyCard.scheduled',
    participantMessage: 'lobbyCard.participantsInvited',
    participantStatus: 'INVITED',
  },
  ONGOING: {
    color: 'success',
    statusMessage: 'lobbyCard.joinRoom',
    participantMessage: 'lobbyCard.participantsJoined',
    participantStatus: 'JOINED',
  },
  ENDED: {
    color: 'secondary',
    statusMessage: 'lobbyCard.ended',
    participantMessage: 'lobbyCard.participantsAttended',
    participantStatus: 'JOINED',
  },
}

const DATE_FORMAT_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

const TIME_FORMAT_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
}

const LobbyCard = ({ room, canStart, onJoinRoomHandler, onRoomUpdate }) => {
  const locale = useSelector(state => state.settings.locale)
  const GET_PARTICIPANTS = gql`
  query getParticipants { 
    participants(
      room_id: ${room.id}
      statuses: [${STATUS_MAP[room.room_status].participantStatus}]
    ) {
      id
      first_name
      last_name
      email
    }
  }
`

  const UPDATE_ROOM_STATUS = gql`
    mutation updateRoomStatus($room_id: ID!, $room_status: RoomState!) {
      updateRoomStatus(room_id: $room_id, room_status: $room_status) {
        success
        message
      }
    }
  `

  const JOIN_ROOM = gql`
    mutation joinRoom($student_id: ID!, $room_id: ID!) {
      joinRoom(student_id: $student_id, room_id: $room_id) {
        success
        message
      }
    }
  `

  const { data } = useQuery(GET_PARTICIPANTS)

  const [updateRoomStatus] = useMutation(UPDATE_ROOM_STATUS, {
    onCompleted: onRoomUpdate,
    onError: err => {
      notification.warning({
        message: 'Update Room Status Failure',
        description: err.message,
      })
    },
  })

  const [joinRoom] = useMutation(JOIN_ROOM, {
    refetchQueries: [
      {
        query: GET_PARTICIPANTS,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: onJoinRoomHandler,
    onError: err => {
      notification.warning({
        message: 'Join Room Failure',
        description: err.message,
      })
    },
  })

  const currentUser = useSelector(state => state.user)
  const canStartRoom =
    room.room_status === 'SCHEDULED' && canStart && currentUser.role === 'INSTRUCTOR'

  const [roomDate, roomTimeInterval, participants] = useMemo(() => {
    // we are assuming the start date and end date are the same here for simplicity
    // the date displayed will be localized
    const date = new Date(room.start_time).toLocaleDateString(locale, DATE_FORMAT_OPTIONS)
    const timeInterval = `${new Date(room.start_time).toLocaleTimeString(
      locale,
      TIME_FORMAT_OPTIONS,
    )} - ${new Date(room.end_time).toLocaleTimeString(locale, TIME_FORMAT_OPTIONS)}`

    if (data) {
      const avatars = data.participants.map(user => (
        <UserAvatar key={user.id} size="default" user={user} />
      ))
      return [date, timeInterval, avatars]
    }
    return [date, timeInterval, []]
  }, [room, data, locale])

  const onJoinRoom = useCallback(() => {
    if (canStartRoom) {
      updateRoomStatus({
        variables: {
          room_id: room.id,
          room_status: 'ONGOING',
        },
      })
    } else if (room.room_status === 'ONGOING') {
      if (currentUser.role === 'STUDENT') {
        joinRoom({
          variables: {
            student_id: currentUser.id,
            room_id: room.id,
          },
        })
      } else {
        onJoinRoomHandler()
      }
    }
  }, [canStartRoom, currentUser, room, updateRoomStatus, joinRoom, onJoinRoomHandler])

  const onEndRoom = useCallback(() => {
    updateRoomStatus({
      variables: {
        room_id: room.id,
        room_status: 'ENDED',
      },
    })
  }, [room, updateRoomStatus])

  return (
    <div className="col-md-4">
      <div className="card">
        <div className={`${style.container} pt-3`}>
          <div className={`${style.status} bg-${STATUS_MAP[room.room_status].color}`} />
          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
            <div className="mr-auto">
              <h3>{room.room_name}</h3>
              <h5>
                <small>{roomDate}</small>
              </h5>
              <h5>
                <small>{roomTimeInterval}</small>
              </h5>
            </div>
            <div>
              <div className={`ml-2 text-${STATUS_MAP[room.room_status].color}`}>
                <Button
                  onClick={onJoinRoom}
                  color={STATUS_MAP[room.room_status].color}
                  outline
                  style={{ minWidth: '120px' }}
                  disabled={room.room_status !== 'ONGOING' && !canStartRoom}
                  className="mr-2 mb-2"
                >
                  <FormattedMessage
                    id={
                      canStartRoom ? 'lobbyCard.start' : STATUS_MAP[room.room_status].statusMessage
                    }
                  />
                </Button>
              </div>
              {currentUser.role === 'INSTRUCTOR' && room.room_status === 'ONGOING' && (
                <div className="ml-2 text-danger">
                  <Button
                    onClick={onEndRoom}
                    color="danger"
                    outline
                    style={{ minWidth: '120px' }}
                    className="mr-2 mb-2"
                  >
                    <FormattedMessage id="lobbyCard.end" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className={`${style.footer} py-3 pl-4`}>
            <Avatar.Group maxCount={4} maxStyle={{ color: '#fff', backgroundColor: '#a1a1c2' }}>
              {participants}
            </Avatar.Group>
            <div className="ml-1">
              <FormattedMessage
                id={STATUS_MAP[room.room_status].participantMessage}
                values={{
                  count: participants.length ?? 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LobbyCard
