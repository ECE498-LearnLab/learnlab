import React, { useState } from 'react'
import { Popover, Button } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import EngagementGraph from './LiveEngagementGraph'

const EngagementPopover = ({ room_id }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)

  const togglePopoverVisible = () => {
    setIsPopoverVisible(!isPopoverVisible)
  }

  return (
    <Popover
      content={<EngagementGraph room_id={room_id} />}
      title="Engagement history"
      trigger="click"
      visible={isPopoverVisible}
      onVisibleChange={togglePopoverVisible}
    >
      <Button type="primary" shape="circle" icon={<LineChartOutlined />} />
    </Popover>
  )
}

export default EngagementPopover
