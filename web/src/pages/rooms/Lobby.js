import { gql, useQuery } from '@apollo/client'
import LobbyCard from 'components/learnlab/LobbyCard'
import _ from 'lodash'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import ScheduleRoom from './ScheduleRoom'

const Lobby = ({ onJoinRoomHandler }) => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)
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

  const { data, loading, error, refetch } = useQuery(GET_ROOMS_FOR_CLASSROOM, {
    variables: { class_id: selectedClassId, room_states: ['ONGOING', 'SCHEDULED'] },
  })

  // Memoize this so todaysSession and upcomingSessions only rerenders when queryResults change
  const [todaysSessions, upcomingSessions] = useMemo(() => {
    if (data) {
      const todaysDate = new Date().getDate()

      const todaysRooms = _.orderBy(
        data.roomsForClassroom.filter(room => new Date(room.start_time).getDate() === todaysDate),
        'start_time',
        'asc',
      )

      const upcomingRooms = _.orderBy(
        data.roomsForClassroom.filter(room => new Date(room.start_time).getDate() > todaysDate),
        'start_time',
        'asc',
      )

      // Create LobbyCard components
      // to-do have a fallback state when todaysRooms or upcomingRooms is null
      const todays = todaysRooms.map(room => (
        <LobbyCard
          key={room.room_uuid}
          room={room}
          onJoinRoomHandler={() => {
            onJoinRoomHandler(room)
          }}
        />
      ))

      const upcoming = upcomingRooms.map(room => (
        <LobbyCard
          key={room.room_uuid}
          room={room}
          onJoinRoomHandler={() => {
            onJoinRoomHandler(room)
          }}
        />
      ))
      return [todays, upcoming]
    }
    return [null, null]
  }, [data, onJoinRoomHandler])

  const onRoomScheduled = () => {
    refetch()
  }

  // create proper error and loading screens for this screen
  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <div>
      <Helmet title="Rooms | Lobby" />
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">Rooms</span>
          <ScheduleRoom onSuccess={onRoomScheduled} />
        </h3>
      </div>
      <div className="cui__utils__heading">
        <strong>Todays Sessions</strong>
      </div>
      <div className="row">{todaysSessions}</div>
      <div className="cui__utils__heading">
        <strong>Upcoming Sessions</strong>
      </div>
      <div className="row">{upcomingSessions}</div>
    </div>
  )
}

export default Lobby
