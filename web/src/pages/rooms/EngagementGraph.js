import React, { useEffect } from 'react'
import { gql, useSubscription } from '@apollo/client'
import ApexCharts from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

let graph_data = []
let curr_score = 0

const EngagementGraph = ({ room_id }) => {
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

  function LatestEngagementScores() {
    const { data, loading } = useSubscription(ENGAGEMENT_AVERAGE_SUBSCRIPTION, {
      variables: { room_id },
    })
    if (!loading && data) {
      curr_score = data.engagementAverageAdded.score
      console.log(data.engagementAverageAdded.score)
      return data.engagementAverageAdded
    }
  }

  function appendData(curr_data) {
    const time = parseInt(new Date().getTime() / 1000, 10)
    // TODO: remove inverted calculation after engagement backend is configured
    const curr = curr_data
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
  }, [updateData])

  LatestEngagementScores()
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height="350" />
    </div>
  )
}

export default EngagementGraph
