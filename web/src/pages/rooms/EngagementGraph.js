import React, { useEffect } from 'react'
import { gql, useSubscription } from '@apollo/client'
import ApexCharts from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

let graph_data = []
let curr_score = 0

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
      curr_score = data.engagementStatAdded.score
      return data.engagementStatAdded
    }
  }

  function appendData(curr_data) {
    const time = parseInt(new Date().getTime() / 1000, 10)
    // TODO: remove inverted calculation after engagement backend is configured
    const curr = curr_data > 50 ? 100 - curr_data : 100 - curr_data * 2
    graph_data.push([time, curr])
    // prevents data array from getting too large
    if (graph_data.length > 100) resizeData()
  }

  function resizeData() {
    graph_data = graph_data.slice(graph_data.length - 50, graph_data.length)
  }

  function updateData() {
    appendData(curr_score)
    ApexCharts.exec('realtime', 'updateSeries', [
      {
        data: graph_data,
      },
    ])
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
          speed: 400,
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
        max: 100,
        min: 0,
      },
    ],
    legend: {
      show: true,
    },
  }

  useEffect(() => {
    const engagementUpdateTimer = setInterval(() => updateData(), 400)
    return () => clearInterval(engagementUpdateTimer)
  }, [])

  // TODO: replace with student ID
  LatestEngagementScores(1)
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height="350" />
    </div>
  )
}

export default EngagementGraph
