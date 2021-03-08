import { gql, useQuery } from '@apollo/client'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector } from 'react-redux'
// import SkeletonTable from './SkeletonTable'
import Skeleton from 'antd'

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

const GET_STUDENT_NAME = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      user {
        first_name
      }
    }
  }
`

const EngagementGraph = ({ roomId, showRoomAverage, userId }) => {
  roomId = 1
  console.log('roomID', roomId)
  console.log('showRoomAverage', showRoomAverage)

  const currentUser = useSelector(state => state.user)
  let studentName = showRoomAverage ? null : currentUser.first_name
  userId = showRoomAverage ? userId : currentUser.id
  console.log('userid', userId)
  console.log('STUDENTSSSS NAMEEEE', studentName)

  /* Queries */
  const { data: studentRoomEngagement, loading: studentEngagementLoading } = useQuery(
    GET_STUDENT_ENGAGEMENT_FOR_ROOM,
    {
      variables: { room_id: roomId, student_id: userId },
      skip: userId === null || userId === undefined || roomId === null || roomId === undefined,
    },
  )
  const { data: roomEngagementAverage, loading: roomEngagementLoading } = useQuery(
    GET_ROOM_ENGAGEMENT_AVERAGE,
    {
      variables: { room_id: roomId },
      skip: roomId === null || roomId === undefined,
    },
  )

  const { data: userData, loading: userDataLoading } = useQuery(GET_STUDENT_NAME, {
    variables: { id: userId },
    skip: userId === null || userId === undefined || studentName !== null,
  })

  let dataLoading = true

  console.log('query data and query loading')
  console.log(studentRoomEngagement)
  console.log(roomEngagementAverage)
  console.log(userData)
  console.log(studentEngagementLoading)
  console.log(roomEngagementLoading)
  console.log(userDataLoading)

  const studentDataList = []
  const studentTimestamp = []
  const roomDataList = []
  const roomTimestamp = []

  if (userData) {
    studentName = userData.user.user.first_name
  }

  if (studentRoomEngagement || roomEngagementAverage) {
    const studentData = studentRoomEngagement
      ? studentRoomEngagement.studentRoomEngagementHistory
      : null
    const roomData = roomEngagementAverage ? roomEngagementAverage.roomEngagementAverages : null

    const studentLength = studentData ? studentData.length : 0
    const roomLength = roomData ? roomData.length : 0

    for (let i = 0; i < studentLength; i += 1) {
      studentDataList.push(studentData[i].score)
      studentTimestamp.push(new Date(studentData[i].created_at).toLocaleTimeString())
    }

    for (let i = 0; i < roomLength; i += 1) {
      roomDataList.push(roomData[i].score)
      roomTimestamp.push(roomData[i].taken_at)
    }
    console.log('STUDENT DATA ARRAY', studentDataList)
    console.log('STUDENT TIMESTAMPP', studentTimestamp)
    console.log('ROOM DATA ARRAY', roomDataList)
    console.log('ROOM TIMESTAMPP', roomTimestamp)
    console.log('STUDENTSSSS NAMEEEE', studentName)
    dataLoading = false
  }

  // graph displays:
  // room average data if INSTRUCTOR
  // room average data + student data if INSTRUCTOR and choose userId
  // student's own data  if STUDENT
  const series = []
  if (!dataLoading) {
    if (userId || !showRoomAverage) {
      console.log('PUSHING STUDENT DATA')
      series.push({
        name: studentName || '',
        data: studentDataList,
      })
    }
    if (showRoomAverage) {
      console.log('PUSHING ROOM DATA')
      series.push({
        name: 'Room Average',
        data: roomDataList,
      })
    }
  }

  const options = {
    chart: {
      id: 'line',
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Mukta, sans-serif',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [5, 7, 5],
      curve: 'smooth',
      dashArray: [0, 8, 5],
    },
    title: {
      text: 'PERCENT ENGAGED OVER TIME',
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: 550,
        fontFamily: 'Mukta, sans-serif',
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      title: {
        text: 'TIMESTAMP',
        style: {
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'Mukta, sans-serif',
        },
      },
      type: 'String',
      categories: studentTimestamp,
    },
    yaxis: [
      {
        title: {
          text: '% ENGAGED',
          style: {
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Mukta, sans-serif',
          },
        },
        max: 100,
        min: 0,
      },
    ],
    legend: {
      show: true,
      showForSingleSeries: true,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontFamily: 'Mukta, sans-serif',
      fontSize: '14px',
      onItemClick: {
        toggleDataSeries: true,
      },
    },
  }

  return (
    <div className="card">
      <div className="p-3" height="350">
        {dataLoading ? (
          <Skeleton.Input style={{ height: 350 }} active />
        ) : (
          <ReactApexChart options={options} series={series} type="line" height="350" />
        )}
      </div>
    </div>
  )
}

export default EngagementGraph
