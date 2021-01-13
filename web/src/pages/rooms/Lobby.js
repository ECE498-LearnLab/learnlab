import LobbyCard from 'components/learnlab/LobbyCard'
import React from 'react'
import { Helmet } from 'react-helmet'

const data = [
  {
    id: '3',
    room_uuid: '3',
    room_name: 'Project Overview',
    start_time: (new Date().getTime() / 1000).toString(),
    end_time: new Date().getTime().toString(),
    room_status: 'ONGOING',
  },
  {
    id: '4',
    room_uuid: '4',
    room_name: 'Office Hours',
    start_time: (new Date().getTime() / 1000).toString(),
    end_time: 1610226145,
    room_status: 'ONGOING',
  },
  {
    id: '5',
    room_uuid: '5',
    room_name: 'Project Overview',
    start_time: (new Date().getTime() / 1000).toString(),
    end_time: 1610524145,
    room_status: 'ONGOING',
  },
  {
    id: '46',
    room_uuid: '46',
    room_name: 'Office Hours 2',
    start_time: 1610222416,
    end_time: 1610226145,
    room_status: 'SCHEDULED',
  },
  {
    id: '1',
    room_uuid: '1',
    room_name: 'Lecture 1',
    start_time: 1610922416,
    end_time: 1610926145,
    room_status: 'SCHEDULED',
  },
  {
    id: '2',
    room_uuid: '2',
    room_name: 'Homework Help',
    start_time: 1610722416,
    end_time: 1610726145,
    room_status: 'SCHEDULED',
  },
  {
    id: '2',
    room_uuid: '2',
    room_name: 'Homework Help',
    start_time: 1616722416,
    end_time: 1616726145,
    room_status: 'SCHEDULED',
  },
  {
    id: '36',
    room_uuid: '56',
    room_name: 'Project Overview 2',
    start_time: 1610542416,
    end_time: 1610524145,
    room_status: 'ENDED',
  },
  {
    id: '47',
    room_uuid: '47',
    room_name: 'Office Hours 3',
    start_time: 1610222416,
    end_time: 1610226145,
    room_status: 'ENDED',
  },
]

const data1 = ['CZ', 'JL', 'JS', 'MK', 'JY', 'SU', 'JY', 'IO']

const Lobby = ({ onJoinRoomHandler }) => {
  const todaysDate = new Date().getDate()

  // to-do make this cleaner once its connected to backend :)
  const todaysSessions = data
    .filter(room => new Date(room.start_time * 1000).getDate() === todaysDate)
    .map((room, index) => (
      <LobbyCard
        key={room.room_uuid}
        roomName={room.room_name}
        roomUUID={room.room_uuid}
        startTime={room.start_time}
        endTime={room.end_time}
        roomStatus={room.room_status}
        onJoinRoomHandler={() => {
          onJoinRoomHandler(room)
        }}
        participants={data1.slice(0, index)}
      />
    ))
  const upcomingSessions = data
    .filter(
      room =>
        new Date(room.start_time * 1000).getDate() !== todaysDate && room.room_status !== 'ENDED',
    )
    .map((room, index) => (
      <LobbyCard
        key={room.room_uuid}
        roomName={room.room_name}
        roomUUID={room.room_uuid}
        startTime={room.start_time}
        endTime={room.end_time}
        roomStatus={room.room_status}
        onJoinRoomHandler={() => {
          onJoinRoomHandler(room)
        }}
        participants={data1.slice(0, index)}
      />
    ))

  return (
    <div>
      <Helmet title="Rooms" />
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">Rooms</span>
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
