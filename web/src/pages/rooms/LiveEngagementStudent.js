import { gql, useSubscription } from '@apollo/client'
import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector } from 'react-redux'

const CHART_OPTIONS = {
  chart: {
    height: 200,
    type: 'radialBar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24,
        },
      },
      track: {
        background: '#fff',
        strokeWidth: '67%',
        margin: 0, // margin is in pixels
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35,
        },
      },

      dataLabels: {
        show: true,
        name: {
          show: false,
        },
        value: {
          formatter: val => `${val}%`,
          color: '#111',
          fontSize: '36px',
          show: true,
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#ABE5A1'],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: 'round',
  },
}

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
  const { data, loading, error } = useSubscription(ENGAGEMENT_SCORES_SUBSCRIPTION, {
    variables: { student_id: user.id },
  })

  const [engagementScore, engagementText] = useMemo(() => {
    if (loading) {
      return [0, 'Loading...']
    }
    if (error) {
      return [0, 'Oops! Error.']
    }
    if (data) {
      return [Number(data.engagementStatAdded.score), data.engagementStatAdded.classification]
    }
    return [0, 'Oops! Error.']
  }, [data, loading, error])

  return (
    <div style={styles.graphContainer}>
      <div id="chart">
        <ReactApexChart
          options={CHART_OPTIONS}
          series={[engagementScore]}
          type="radialBar"
          height="200"
        />
      </div>
      <h4 className="text-secondary">{engagementText}</h4>
    </div>
  )
}

export default LiveEngagementStudent
