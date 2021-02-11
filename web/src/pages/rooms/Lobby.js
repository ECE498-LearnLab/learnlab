import { gql, useQuery } from '@apollo/client'
import EmptyState from 'components/learnlab/EmptyState'
import ErrorState from 'components/learnlab/ErrorState'
import LobbyCard from 'components/learnlab/LobbyCard'
import SkeletonLobbyCard from 'components/learnlab/LobbyCard/SkeletonLobbyCard'
import ACL from 'components/navigation/system/ACL'
import _ from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import ScheduleRoom from './ScheduleRoom'

const emptySessionsState = () => {
  return <EmptyState description={<FormattedMessage id="rooms.empty.message" />} />
}

const Sessions = ({ title, canStart, rooms, onJoinRoomHandler, onRoomUpdate }) => {
  return (
    <div>
      <div className="cui__utils__heading">
        <strong>{title}</strong>
      </div>
      <div className="row">
        {rooms.map(room => (
          <LobbyCard
            key={room.room_uuid}
            room={room}
            canStart={canStart}
            onJoinRoomHandler={() => {
              onJoinRoomHandler(room)
            }}
            onRoomUpdate={onRoomUpdate}
          />
        ))}
      </div>
    </div>
  )
}

const Lobby = ({ onJoinRoomHandler }) => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const [show, setShow] = useState(false)
  const toggleShow = useCallback(() => setShow(!show), [setShow, show])

  const GET_ROOMS_FOR_CLASSROOM = gql`
    query getRoomsForClassroom($class_id: ID!, $room_states: [RoomState]) {
      roomsForClassroom(class_id: $class_id, room_states: $room_states) {
        id
        room_uuid
        room_name
        start_time
        end_time
        room_status
      }
    }
  `
  // for skeleton loading
  const [isLoading, setIsLoading] = useState(false)
  const { data, loading, error, refetch } = useQuery(GET_ROOMS_FOR_CLASSROOM, {
    variables: { class_id: selectedClassId, room_states: ['ONGOING', 'SCHEDULED'] },
  })

  const onRoomUpdate = useCallback(() => {
    refetch()
  }, [refetch])

  const sessions = useMemo(() => {
    if (loading || isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return <SkeletonLobbyCard key="skeleton" />
    }

    if (error) {
      return <ErrorState />
    }

    if (data) {
      const todaysDate = new Date().setHours(0, 0, 0, 0)

      const todaysRooms = _.orderBy(
        data.roomsForClassroom.filter(
          room => new Date(room.start_time).setHours(0, 0, 0, 0) === todaysDate,
        ),
        'start_time',
        'asc',
      )

      const upcomingRooms = _.orderBy(
        data.roomsForClassroom.filter(
          room => new Date(room.start_time).setHours(0, 0, 0, 0) > todaysDate,
        ),
        'start_time',
        'asc',
      )

      const todays =
        todaysRooms.length > 0 ? (
          <Sessions
            title={<FormattedMessage id="rooms.title.todaysSessions" />}
            canStart={true}
            rooms={todaysRooms}
            onJoinRoomHandler={onJoinRoomHandler}
            onRoomUpdate={onRoomUpdate}
          />
        ) : null
      const upcoming =
        upcomingRooms.length > 0 ? (
          <Sessions
            title={<FormattedMessage id="rooms.title.upcomingSessions" />}
            canStart={false}
            rooms={upcomingRooms}
            onJoinRoomHandler={onJoinRoomHandler}
            onRoomUpdate={onRoomUpdate}
          />
        ) : null

      const allSessions =
        todays == null && upcoming == null ? (
          emptySessionsState()
        ) : (
          <div>
            {todays}
            {upcoming}
          </div>
        )

      return allSessions
    }
    return emptySessionsState()
  }, [data, loading, error, onJoinRoomHandler, onRoomUpdate, isLoading, setIsLoading])

  return (
    <div>
      <Helmet title="Rooms | Lobby" />
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">
            <FormattedMessage id="rooms.title.Rooms" />
          </span>
          <ACL roles={['INSTRUCTOR']}>
            <Button color="success" className="mr-3" onClick={toggleShow}>
              <FormattedMessage id="scheduleRoom.button" />
            </Button>
          </ACL>
        </h3>
      </div>
      {sessions}
      <ScheduleRoom onSuccess={onRoomUpdate} show={show} toggleShow={toggleShow} />
    </div>
  )
}

export default Lobby
