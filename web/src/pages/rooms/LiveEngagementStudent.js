import { gql, useSubscription } from '@apollo/client'
import { Progress, message } from 'antd'
import React, { useCallback, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'

// engagement score subscription
const ENGAGEMENT_SCORES_SUBSCRIPTION = gql`
  subscription onEngagementAdded($student_id: ID!) {
    engagementStatAdded(student_id: $student_id) {
      room_id
      student_id
      score
      classification
      created_at
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

const LiveEngagementStudent = () => {
  const user = useSelector(state => state.user)
  const [alertShown, setAlertShown] = useState(false)
  const intl = useIntl()
  const { data, loading, error } = useSubscription(ENGAGEMENT_SCORES_SUBSCRIPTION, {
    variables: { student_id: user.id },
  })

  const showAlertMessage = useCallback(() => {
    if (!alertShown) {
      setAlertShown(true)
      message
        .warning(`${intl.formatMessage({ id: 'room.student.alert' })}, ${user.first_name}`)
        .then(() => {
          setAlertShown(false)
        })
    }
  }, [intl, user, alertShown, setAlertShown])

  const [engagementScore, engagementText] = useMemo(() => {
    if (loading) {
      return [0, 'Loading...']
    }
    if (error) {
      return [0, 'Oops! Error.']
    }
    if (data) {
      const { classification } = data.engagementStatAdded
      if (classification !== 'ENGAGED') {
        showAlertMessage()
      }
      return [Number(data.engagementStatAdded.score), classification]
    }
    return [0, 'Oops! Error.']
  }, [showAlertMessage, data, loading, error])

  return (
    <div style={styles.graphContainer}>
      <Progress className="mx-1" percent={engagementScore} format={percent => `${percent}%`} />
      <h6 className="text-secondary m-2">{engagementText}</h6>
    </div>
  )
}

export default LiveEngagementStudent
