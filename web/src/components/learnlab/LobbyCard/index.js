import { Avatar } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import style from './style.module.scss'

const STATUS_COLOR_MAP = {
  SCHEDULED: 'primary',
  ONGOING: 'success',
  ENDED: 'secondary',
}

const STATUS_MESSAGE_MAP = {
  SCHEDULED: 'lobbyCard.scheduled',
  ONGOING: 'lobbyCard.joinRoom',
  ENDED: 'lobbyCard.ended',
}

const PARTICIPANTS_MESSAGE_MAP = {
  SCHEDULED: 'lobbyCard.participantsInvited',
  ONGOING: 'lobbyCard.participantsJoined',
  ENDED: 'lobbyCard.participantsAttended',
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

const LobbyCard = ({
  roomName,
  startTime,
  endTime,
  roomStatus,
  onJoinRoomHandler,
  participants,
  locale,
}) => {
  // this is just so the randomized data doesn't change, so I've put it in a state. this monstrosity of a line will be removed when we connect to real data :)
  const fakeParticipants = participants.map(initials => (
    <Avatar style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>
      {initials}
    </Avatar>
  ))

  const date = new Date(startTime * 1000).toLocaleDateString(locale, DATE_FORMAT_OPTIONS)
  const timeInterval = `${new Date(startTime * 1000).toLocaleTimeString(
    locale,
    TIME_FORMAT_OPTIONS,
  )} - ${new Date(endTime * 1000).toLocaleTimeString(locale, TIME_FORMAT_OPTIONS)}`
  return (
    <div className="col-md-4">
      <div className="card">
        <div className={`${style.container} pt-3`}>
          <div className={`${style.status} bg-${STATUS_COLOR_MAP[roomStatus]}`} />
          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
            <div className="mr-auto">
              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                {roomName}
              </div>
              <div className="font-size-18">
                {date} {timeInterval}
              </div>
            </div>
            <div className={`ml-1 text-${STATUS_COLOR_MAP[roomStatus]}`}>
              <Button
                onClick={onJoinRoomHandler}
                color={STATUS_COLOR_MAP[roomStatus]}
                outline
                disabled={roomStatus !== 'ONGOING'}
                className="mr-2 mb-2"
              >
                <FormattedMessage id={STATUS_MESSAGE_MAP[roomStatus]} />
              </Button>
            </div>
          </div>
          <div className={`${style.footer} py-3 pl-4`}>
            <Avatar.Group maxCount={4} maxStyle={{ color: '#fff', backgroundColor: '#a1a1c2' }}>
              {fakeParticipants}
            </Avatar.Group>
            <div className="ml-1">
              <FormattedMessage
                id={PARTICIPANTS_MESSAGE_MAP[roomStatus]}
                values={{
                  count: fakeParticipants.length,
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
