import { gql, useQuery } from '@apollo/client'
import { Avatar } from 'antd'
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
        <Avatar
          key={user.id}
          style={{
            color: '#fff',
            backgroundColor: uniqueHslColor(`${user.first_name} ${user.last_name}`),
          }}
        >
          {user.first_name[0].toUpperCase()}
          {user.last_name[0].toUpperCase()}
        </Avatar>
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
              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                {room.room_name}
              </div>
              <div className="font-size-18">
                {roomDate} {roomTimeInterval}
              </div>
            </div>
            <div className={`ml-1 text-${STATUS_MAP[room.room_status].color}`}>
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

// generates a unique color based on the user's name, it's the same everytime
function uniqueHslColor(str) {
  const s = 30
  const l = 60
  let hash = 0

  for (let i = 0; i < str.length; i += 1) {
    /* eslint no-bitwise: [2, { allow: ["<<"] }] */
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return `hsl(${h}, ${s}%, ${l}%)`
}

export default connect(mapStateToProps)(LobbyCard)
