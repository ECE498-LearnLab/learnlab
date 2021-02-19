import { SearchOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { DatePicker, Select } from 'antd'
import { Button } from 'reactstrap'
import { useSelector } from 'react-redux'
import EngagementGraph from './EngagementGraph'
import style from './style.module.scss'

const EngagementDashboard = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const currentUser = useSelector(state => state.user)
  const { Option } = Select

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
  const { data, loading, error } = useQuery(GET_ROOMS_FOR_CLASSROOM, {
    variables: {
      class_id: selectedClassId,
      user_id: currentUser.id,
      room_states: ['ENDED'],
    },
  })

  const roomOptions = useMemo(() => {
    if (loading) {
      return []
    }
    if (error) {
      return []
    }
    if (data) {
      return data.roomsForClassroom.map(room => {
        return (
          <Option key={room.room_name} value={room.id} label={room.room_name}>
            {room.room_name}
          </Option>
        )
      })
    }
    return []
  }, [data, loading, error])

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
            <DatePicker />
          </div>
          <div className="mr-3">
            <Select
              style={{ width: 200 }}
              listHeight={100}
              showSearch
              showArrow={false}
              optionFilterProp="label"
              placeholder="Select a room"
              loading={loading}
            >
              {roomOptions}
            </Select>
          </div>
          <div className="mr-3">
            <Button color="success">
              <SearchOutlined />
            </Button>
          </div>
        </div>
      </div>
      <EngagementGraph />
    </div>
  )
}

export default EngagementDashboard
