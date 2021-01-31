import { gql, useQuery } from '@apollo/client'
import { Avatar } from 'antd'
import UserAvatar from 'components/learnlab/UserAvatar'
import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
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

const mapStateToProps = ({ settings }) => ({ locale: settings.locale })

const LobbyCard = ({ room, onJoinRoomHandler, locale }) => {
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
  const { data } = useQuery(GET_PARTICIPANTS)

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

  return (
    <div className="col-md-4">
      <div className="card">
        <div className={`${style.container} pt-3`}>
          <div className={`${style.status} bg-${STATUS_MAP[room.room_status].color}`} />
          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
            <div className="mr-auto">
              <h3>{room.room_name}</h3>
              <h5>
                <small>
                  {roomDate} {roomTimeInterval}
                </small>
              </h5>
            </div>
            <div className={`ml-2 text-${STATUS_MAP[room.room_status].color}`}>
              <Button
                onClick={onJoinRoomHandler}
                color={STATUS_MAP[room.room_status].color}
                outline
                disabled={room.room_status !== 'ONGOING'}
                className="mr-2 mb-2"
              >
                <FormattedMessage id={STATUS_MAP[room.room_status].statusMessage} />
              </Button>
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

export default connect(mapStateToProps)(LobbyCard)
