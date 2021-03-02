import { gql, useSubscription } from '@apollo/client'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'antd'
import EngagementPopover from './EngagementPopover'
// engagement score subscription
const ENGAGEMENT_AVERAGE_SUBSCRIPTION = gql`
  subscription onEngagementAverageAdded($room_id: ID!) {
    engagementAverageAdded(room_id: $room_id) {
      room_id
      score
      taken_at
    }
  }
`

const styles = {
  graphContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: '24px',
    textAnchor: 'middle',
  },
}

const LiveEngagementInstructor = () => {
  const user = useSelector(state => state.user)
  const { data, loading, error } = useSubscription(ENGAGEMENT_AVERAGE_SUBSCRIPTION, {
    variables: { room_id: user.selectedRoom.id },
  })
  console.log('HI', user.selectedRoom.id)

  const [engagementScore, engagementText] = useMemo(() => {
    if (loading) {
      return [0, 'Loading...']
    }
    if (error) {
      console.log(error)
      return [0, 'Oops! Error.']
    }
    if (data) {
      return [Number(data.engagementAverageAdded.score), data.engagementAverageAdded.classification]
    }
    return [0, 'Oops! Error.']
  }, [data, loading, error])

  return (
    <div style={styles.graphContainer}>
      <div>View Engagement History</div>
      <EngagementPopover room_id={user.selectedRoom.id} />
      <Progress className="mx-1" percent={engagementScore} format={percent => `${percent}%`} />
      <h6 className="text-secondary m-2">{engagementText}</h6>
    </div>
  )
}

export default LiveEngagementInstructor
