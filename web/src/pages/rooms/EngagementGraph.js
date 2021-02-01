import React, { useEffect } from 'react'
import { gql, useSubscription } from '@apollo/client'
import ApexCharts from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

const graph_data = []

const EngagementGraph = () => {
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

  function LatestEngagementScores(student_id) {
    const { data, loading } = useSubscription(ENGAGEMENT_SCORES_SUBSCRIPTION, {
      variables: { student_id },
    })
    if (!loading && data) {
      appendData(data.engagementStatAdded.score)
      return data.engagementStatAdded
    }
  }

  function appendData(curr_data) {
    const time = parseInt(new Date().getTime() / 1000, 10)
    graph_data.push([time, curr_data])
  }

  const series = [
    {
      graph_data: graph_data.slice(),
    },
  ]
  const options = {
    chart: {
      id: 'realtime',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
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
      curve: 'smooth',
    },
    title: {
      text: 'Engagement Chart',
      align: 'left',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      range: 10,
    },
    yaxis: [
      {
        title: {
          text: 'engagement',
        },
      },
    ],
    legend: {
      show: true,
    },
  }

  useEffect(() => {
    ApexCharts.exec('realtime', 'updateSeries', [
      {
        data: graph_data,
      },
    ])
  })

  LatestEngagementScores(1)
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height="350" />
    </div>
  )
}

export default EngagementGraph
