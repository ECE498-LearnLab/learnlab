import { gql, useQuery } from '@apollo/client'
import { Empty, Skeleton } from 'antd'
import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector } from 'react-redux'

const OPTIONS = {
  chart: {
    id: 'engagement-graph',
    type: 'area',
    height: 350,
    zoom: {
      autoScaleYaxis: true,
    },
    fontFamily: 'Mukta, sans-serif',
  },
  colors: ['#02A0FC', '#34B53A'],
  stroke: {
    curve: 'smooth',
    width: [5, 3],
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Engagement Score',
      },
      max: 100,
      min: 0,
    },
  ],
  tooltip: {
    x: {
      format: 'dd MMM yyyy HH:mm:ss',
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    showForNullSeries: true,
    showForZeroSeries: true,
    position: 'bottom',
    horizontalAlign: 'center',
    onItemClick: {
      toggleDataSeries: true,
    },
  },
}

const GET_STUDENT_ENGAGEMENT_FOR_ROOM = gql`
  query getStudentRoomEngagementHistory($room_id: ID!, $student_id: ID!) {
    studentRoomEngagementHistory(room_id: $room_id, student_id: $student_id) {
      score
      created_at
    }
  }
`

const GET_ROOM_ENGAGEMENT_AVERAGE = gql`
  query getRoomEngagementAverages($room_id: ID!) {
    roomEngagementAverages(room_id: $room_id) {
      score
      taken_at
    }
  }
`

const EngagementGraph = ({ user, room }) => {
  const currentUser = useSelector(state => state.user)
  const [roomSeries, setRoomSeries] = useState(null)
  const [studentSeries, setStudentSeries] = useState(null)

  /* Queries */
  const { data: roomEngagementAverage, loading: roomLoading, error: roomError } = useQuery(
    GET_ROOM_ENGAGEMENT_AVERAGE,
    {
      variables: { room_id: room.id },
      skip: currentUser.role === 'STUDENT',
    },
  )

  const { data: studentRoomEngagement, loading: studentLoading, error: studentError } = useQuery(
    GET_STUDENT_ENGAGEMENT_FOR_ROOM,
    {
      skip: user === null || user === undefined,
      variables: { room_id: room.id, student_id: user?.id },
    },
  )

  useEffect(() => {
    if (roomEngagementAverage) {
      setRoomSeries({
        name: 'Room Average',
        data: roomEngagementAverage.roomEngagementAverages.map(x => [x.taken_at, x.score]),
      })
    }
  }, [setRoomSeries, roomEngagementAverage])

  useEffect(() => {
    if (user === null) {
      setStudentSeries(null)
    }
    if (studentRoomEngagement) {
      const orderedData = _.orderBy(
        studentRoomEngagement.studentRoomEngagementHistory,
        'created_at',
        'asc',
      )
      setStudentSeries({
        name: `${user.first_name} ${user.last_name}`,
        data: orderedData.map(x => [x.created_at, x.score]),
      })
    }
    // eslint-disable-next-line
  }, [user, setStudentSeries, studentRoomEngagement])

  const engagementGraph = useMemo(() => {
    if (roomLoading && studentLoading) {
      return <SkeletonEngagementGraph />
    }
    if (roomError && studentError) {
      return <EmptyEngagementGraph />
    }
    if (roomSeries === null && studentSeries === null) {
      return <SkeletonEngagementGraph />
    }
    if (roomSeries !== null && roomSeries.data.length === 0) {
      return <EmptyEngagementGraph />
    }
    if (roomSeries === null && studentSeries !== null && studentSeries.data.length === 0) {
      return <EmptyEngagementGraph />
    }

    // eslint-disable-next-line no-nested-ternary
    const graphTitle =
      currentUser.role === 'STUDENT'
        ? 'Your Engagement'
        : user !== null
        ? `${user.first_name} ${user.last_name}'s Engagement`
        : `${room.room_name} Room's Engagement`
    const options = {
      title: {
        text: graphTitle,
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 550,
        },
      },
      xaxis: {
        title: {
          text: 'Time',
        },
        type: 'datetime',
        min: new Date(
          roomSeries !== null ? roomSeries.data[0][0] : studentSeries.data[0][0],
        ).getTime(),
        max: new Date(
          roomSeries !== null
            ? roomSeries.data[roomSeries.data.length - 1][0]
            : studentSeries.data[studentSeries.data.length - 1][0],
        ).getTime(),
        tickAmount: 6,
        labels: {
          formatter(val) {
            return new Intl.DateTimeFormat('default', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }).format(val)
          },
        },
      },
      ...OPTIONS,
    }
    const series = []
    if (roomSeries !== null) series.push(roomSeries)
    if (studentSeries !== null) series.push(studentSeries)

    return <ReactApexChart options={options} series={series} type="line" height="350" />
  }, [
    currentUser.role,
    user,
    room.room_name,
    roomSeries,
    studentSeries,
    studentLoading,
    roomLoading,
    studentError,
    roomError,
  ])

  return (
    <div className="card">
      <div className="p-3" height="350">
        {engagementGraph}
      </div>
    </div>
  )
}

export const SkeletonEngagementGraph = () => {
  return (
    <div className="card">
      <div className="p-3" height="350">
        <Skeleton />
      </div>
    </div>
  )
}

export const EmptyEngagementGraph = () => {
  return (
    <div className="card">
      <div className="p-3" height="350">
        <Empty />
      </div>
    </div>
  )
}

export default EngagementGraph
