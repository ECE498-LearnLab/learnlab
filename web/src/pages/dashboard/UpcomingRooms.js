import { CalendarTwoTone, ClockCircleFilled, VideoCameraOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import { Avatar, Badge, Card, List, Skeleton } from 'antd'
import { uniqueHslColor } from 'components/learnlab/UserAvatar'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

const NUM_ROOMS = 4
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

const UpcomingRooms = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const locale = useSelector(state => state.settings.locale)
  const currentUser = useSelector(state => state.user)
  const { data, loading, error } = useQuery(GET_ROOMS_FOR_CLASSROOM, {
    variables: {
      class_id: selectedClassId,
      user_id: currentUser.id,
      room_states: ['ONGOING', 'SCHEDULED'],
    },
  })

  // for skeleton loading
  const [isLoading, setIsLoading] = useState(false)

  const upcomingRooms = useMemo(() => {
    if (loading || isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return <SkeletonUpcomingRooms active={true} />
    }
    if (error) {
      return <SkeletonUpcomingRooms active={false} />
    }
    if (data) {
      const todaysDate = new Date().setHours(0, 0, 0, 0)
      const filteredList = _.orderBy(
        data.roomsForClassroom.filter(
          room => new Date(room.start_time).setHours(0, 0, 0, 0) >= todaysDate,
        ),
        'start_time',
        'asc',
      )
      const slicedList = filteredList.slice(
        0,
        filteredList.length - 1 > NUM_ROOMS ? NUM_ROOMS : filteredList.length - 1,
      )
      return (
        <Card
          className="card border-0"
          style={{ borderRadius: '11px', width: '100%', height: '100%' }}
          title={
            <div>
              <CalendarTwoTone twoToneColor="#eb2f96" className="mr-2" />
              <FormattedMessage id="upcomingRooms.title.name" />
            </div>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={slicedList}
            renderItem={room => (
              <Card className="m-2" style={{ borderRadius: '11px' }}>
                <Card.Meta
                  avatar={
                    <Badge
                      offset={[-4, 4]}
                      count={
                        <ClockCircleFilled
                          style={{ color: room.room_status === 'ONGOING' ? '#41b883' : '#0052cc' }}
                        />
                      }
                    >
                      <Avatar
                        style={{
                          backgroundColor: uniqueHslColor(room.room_name ?? 'null'),
                          verticalAlign: 'middle',
                        }}
                        size="large"
                        icon={<VideoCameraOutlined />}
                      />
                    </Badge>
                  }
                  title={room.room_name}
                  description={`${new Date(room.start_time).toLocaleDateString(
                    locale,
                    DATE_FORMAT_OPTIONS,
                  )} ${new Date(room.start_time).toLocaleTimeString(
                    locale,
                    TIME_FORMAT_OPTIONS,
                  )} - ${new Date(room.end_time).toLocaleTimeString(locale, TIME_FORMAT_OPTIONS)}`}
                />
              </Card>
            )}
          />
        </Card>
      )
    }
    return <SkeletonUpcomingRooms active={false} />
  }, [locale, isLoading, setIsLoading, data, loading, error])

  return <div style={{ width: '100%', height: '100%' }}>{upcomingRooms}</div>
}

const SkeletonUpcomingRooms = ({ active }) => {
  const slicedList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
  return (
    <Card
      className="card border-0"
      style={{ borderRadius: '11px', width: '100%', height: '100%' }}
      title={
        <div>
          <CalendarTwoTone twoToneColor="#eb2f96" className="mr-2" />
          <FormattedMessage id="upcomingRooms.title.name" />
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={slicedList}
        renderItem={() => (
          <Card className="m-2" style={{ borderRadius: '11px' }}>
            <Card.Meta
              avatar={
                <Badge offset={[-4, 4]} count={<ClockCircleFilled />}>
                  <Skeleton.Avatar size="large" shape="circle" active={active} />
                </Badge>
              }
              title={<Skeleton style={{ width: 90 }} active={active} paragraph={{ rows: 1 }} />}
            />
          </Card>
        )}
      />
    </Card>
  )
}

export default UpcomingRooms
