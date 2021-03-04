import { gql, useQuery } from '@apollo/client'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import SkeletonTable from './SkeletonTable'

// add query to get user's name from id to be used as graph name

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
  // can hardcode the selected roomId and userId for now since roomId and userId selection is not finished
  roomId = 1
  userId = 1
  console.log('roomID', roomId)
  console.log('showRoomAverage', showRoomAverage)
  console.log('userid', userId)

  /* Queries */
  const { data: studentRoomEngagement, loading: studentEngagementLoading } = useQuery(
    GET_STUDENT_ENGAGEMENT_FOR_ROOM,
    {
      variables: { room_id: roomId, student_id: userId },
      // skip: userId === null || userId === undefined,
    },
  )
  const { data: roomEngagementAverage, loading: roomEngagementLoading } = useQuery(
    GET_ROOM_ENGAGEMENT_AVERAGE,
    {
      variables: { room_id: roomId },
      // skip: room_id === null || room_id === undefined,
    },
  )

  const { data: userData, loading: userDataLoading } = useQuery(GET_STUDENT_NAME, {
    variables: { id: userId },
    // skip: userId === null || userId === undefined,
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
  const roomDataList = []
  let studentName = null

  if (studentRoomEngagement && roomEngagementAverage && userData) {
    const studentData = studentRoomEngagement.studentRoomEngagementHistory
    const roomData = roomEngagementAverage.roomEngagementAverages
    const studentLength = studentData.length
    const roomLength = roomData.length
    studentName = userData.user.user.first_name

    for (let i = 0; i < studentLength; i += 1) {
      studentDataList.push(studentData[i].score)
    }

    for (let i = 0; i < roomLength; i += 1) {
      roomDataList.push(roomData[i].score)
    }
    // console.log("STUDENT DATA ARRAY", studentDataList)
    // console.log("ROOM DATA ARRAY", roomDataList)
    // console.log("STUDENTSSSS NAMEEEE", studentName)
    dataLoading = false
  }

  // graph displays:
  // room average if INSTRUCTOR
  // room average + student if INSTRUCTOR and userId exists
  // student if STUDENT
  const series = []
  if (!dataLoading) {
    if (userId || !showRoomAverage) {
      series.push({
        name: studentName || 'Student',
        data: studentDataList,
      })
    }
    if (showRoomAverage) {
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
      text: '[Room name] Engagement',
      align: 'left',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      title: {
        text: 'What do we want the x axis numbers to be',
      },
      // categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    yaxis: [
      {
        title: {
          text: '% Engaged',
        },
        max: 100,
        min: 0,
      },
    ],
    legend: {
      show: true,
    },
  }

  return (
    <div className="card">
      <div className="p-3">
        {dataLoading ? (
          <SkeletonTable />
        ) : (
          <ReactApexChart options={options} series={series} type="line" height="350" />
        )}
      </div>
    </div>
  )
}

export default EngagementGraph
