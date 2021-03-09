import { SearchOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { Table, Select } from 'antd'
import UserAvatar from 'components/learnlab/UserAvatar'
import { Button } from 'reactstrap'
import { useSelector } from 'react-redux'
import EngagementGraph from './EngagementGraph'
import SkeletonTable from './SkeletonTable'
import style from './style.module.scss'

const GET_ROOMS_FOR_CLASSROOM = gql`
  query getRoomsForClassroom($class_id: ID!, $user_id: ID!, $room_states: [RoomState]) {
    roomsForClassroom(class_id: $class_id, user_id: $user_id, room_states: $room_states) {
      id
      room_uuid
      room_name
      start_time
      end_time
      room_status
    }
  }
`

const GET_PARTICIPANTS_FOR_ROOM = gql`
  query getParticipantsForRoom($room_id: ID!) {
    participants(room_id: $room_id) {
      id
      first_name
      last_name
      email
    }
  }
`

const EngagementDashboard = ({ selectedClassId }) => {
  const currentUser = useSelector(state => state.user)
  const { Option } = Select
  const [roomId, setRoomId] = useState(null)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(
    currentUser.role === 'STUDENT' ? currentUser : null,
  )

  const onGetRoomsSuccess = useCallback(
    res => {
      if (!selectedRoomId && res) {
        setSelectedRoomId(
          [...res.roomsForClassroom].sort(
            (a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime(),
          )[0]?.id,
        )
      }
    },
    [selectedRoomId, setSelectedRoomId],
  )

  const {
    data: classroomData,
    loading: classroomDataLoading,
    error: classroomDataError,
  } = useQuery(GET_ROOMS_FOR_CLASSROOM, {
    variables: {
      class_id: selectedClassId,
      user_id: currentUser.id,
      room_states: ['ENDED'],
    },
    onCompleted: onGetRoomsSuccess,
  })

  const {
    data: participantsData,
    loading: participantsDataLoading,
    error: participantsDataError,
    refetch,
  } = useQuery(GET_PARTICIPANTS_FOR_ROOM, {
    variables: {
      room_id: selectedRoomId,
    },
    skip: currentUser.role === 'STUDENT' || !selectedRoomId,
  })

  const participants = useMemo(() => {
    if (participantsDataLoading || participantsDataError) {
      return []
    }

    if (participantsData) {
      return participantsData
        ? participantsData.participants.map(_user => {
            return { ..._user, key: _user.id }
          })
        : []
    }

    return []
  }, [participantsData, participantsDataLoading, participantsDataError])

  const updateRoomId = useCallback(
    value => {
      if (roomId !== value) {
        setRoomId(value)
      }
    },
    [roomId, setRoomId],
  )

  const updateSelectedtRoomId = useCallback(() => {
    if (roomId && roomId !== selectedRoomId) {
      setSelectedRoomId(roomId)
      if (currentUser.role !== 'STUDENT') {
        refetch()
        setSelectedUser(null)
      }
    }
  }, [roomId, selectedRoomId, setSelectedRoomId, currentUser, setSelectedUser, refetch])

  const onChangeSelectedUser = useCallback(
    user => {
      if (!selectedUser || (selectedUser && user.id !== selectedUser.id)) {
        setSelectedUser(user)
      } else if (selectedUser && user.id === selectedUser.id) {
        setSelectedUser(null)
      }
    },
    [selectedUser, setSelectedUser],
  )

  const columns = [
    {
      key: 'avatar',
      className: 'bg-transparent width-50',
      render: record => {
        return (
          <div>
            <UserAvatar size="default" user={record} />
          </div>
        )
      },
    },
    {
      title: 'NAME',
      key: 'name',
      className: 'bg-transparent',
      render: record => {
        return (
          <div>
            {record.first_name} {record.middle_name ?? ''} {record.last_name}
          </div>
        )
      },
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      className: 'bg-transparent',
      render: text => {
        return <a className="text-blue">{text}</a>
      },
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'ACTION',
      className: 'bg-transparent',
      render: record => {
        if (selectedUser && selectedUser.id === record.id) {
          return (
            <Button outline color="danger" onClick={() => onChangeSelectedUser(record)}>
              <FormattedMessage id="statistics.table.remove" />
            </Button>
          )
        }
        return (
          <Button outline color="secondary" onClick={() => onChangeSelectedUser(record)}>
            <FormattedMessage id="statistics.table.show" />
          </Button>
        )
      },
    },
  ]

  const roomOptions = useMemo(() => {
    if (classroomDataLoading || classroomDataError) {
      return []
    }
    if (classroomData?.roomsForClassroom) {
      return classroomData.roomsForClassroom.map(room => {
        return (
          <Option key={room.room_name} value={room.id} label={room.room_name}>
            {room.room_name}
          </Option>
        )
      })
    }
    return []
  }, [classroomData, classroomDataLoading, classroomDataError])

  const roomName = selectedRoomId
    ? classroomData?.roomsForClassroom?.find(rooms => rooms.id === selectedRoomId)?.room_name || ''
    : ''
  const roomStartTime = selectedRoomId
    ? classroomData?.roomsForClassroom?.find(rooms => rooms.id === selectedRoomId)?.start_time || ''
    : ''
  const roomEndTime = selectedRoomId
    ? classroomData?.roomsForClassroom?.find(rooms => rooms.id === selectedRoomId)?.end_time || ''
    : ''

  const engagementGraph = useMemo(() => {
    return (
      <EngagementGraph
        roomId={selectedRoomId}
        showRoomAverage={currentUser.role === 'INSTRUCTOR'}
        userId={selectedUser ? selectedUser.id : null}
        roomName={roomName}
        roomStartTime={roomStartTime}
        roomEndTime={roomEndTime}
      />
    )
  }, [selectedRoomId, currentUser.role, selectedUser, roomName, roomStartTime, roomEndTime])

  return (
    <div>
      <Helmet title="Engagement Statistics" />
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">
            <FormattedMessage id="statistics.title.EngagementStatistics" />
          </span>
        </h3>
        <div className={style.topbar}>
          <div className="mr-3">
            <Select
              style={{ width: 200 }}
              listHeight={100}
              showSearch
              showArrow={false}
              optionFilterProp="label"
              placeholder={
                selectedRoomId
                  ? classroomData?.roomsForClassroom?.find(rooms => rooms.id === selectedRoomId)
                      ?.room_name || 'Select a room'
                  : 'Select a room'
              }
              loading={classroomDataLoading}
              onChange={updateRoomId}
            >
              {roomOptions}
            </Select>
          </div>
          <div className="mr-3">
            <Button color="success" onClick={updateSelectedtRoomId}>
              <SearchOutlined />
            </Button>
          </div>
        </div>
      </div>
      {selectedRoomId && (
        <div className="cui__utils__heading">
          <strong>
            {classroomData?.roomsForClassroom?.find(data => data.id === selectedRoomId)
              ?.room_name || null}
          </strong>
        </div>
      )}
      {engagementGraph}
      {currentUser.role === 'INSTRUCTOR' &&
        (classroomDataLoading || participantsDataLoading ? (
          <div>
            <div className="cui__utils__heading">
              <strong>
                <FormattedMessage id="statistics.title.students" />
              </strong>
            </div>
            <SkeletonTable />
          </div>
        ) : (
          <div>
            <div className="cui__utils__heading">
              <strong>
                <FormattedMessage id="statistics.title.students" />
              </strong>
            </div>
            <Table
              className={style.table}
              columns={columns}
              dataSource={participants}
              pagination={false}
              tableLayout="auto"
              ellipsis={true}
              scroll={participants.length > 4 ? { y: 275 } : false}
            />
          </div>
        ))}
    </div>
  )
}

export default EngagementDashboard
