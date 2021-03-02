import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { gql, useSubscription } from '@apollo/client'
import ApexCharts from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

const EngagementGraph = ({ room_id }) => {
  const [graphData, setGraphData] = useState([])
  const [currScore, setCurrScore] = useState(0)

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

  const LatestEngagementScores = () => {
    const { data, loading, error } = useSubscription(ENGAGEMENT_AVERAGE_SUBSCRIPTION, {
      variables: { room_id },
    })
    console.log(room_id)
    useMemo(() => {
      if (loading) {
        return [0]
      }
      if (error) {
        return [0]
      }
      if (data) {
        setCurrScore(data.engagementAverageAdded.score)
        return data.engagementAverageAdded
      }
      return [0]
    }, [data, loading, error])

    return <ReactApexChart options={options} series={series} type="line" height="350" />
  }

  const appendData = useCallback(
    curr_data => {
      const time = parseInt(new Date().getTime() / 1000, 10)
      graphData.push([time, curr_data])
      setGraphData(graphData)
      // prevents data array from getting too large
      if (graphData.length > 100) resizeData()
    },
    [setGraphData, graphData],
  )

  const resizeData = useCallback(() => {
    graphData.slice(graphData.length - 50, graphData.length)
    setGraphData(graphData)
  }, [setGraphData, graphData])

  const updateData = useCallback(() => {
    appendData(currScore)
    ApexCharts.exec('realtime', 'updateSeries', [
      {
        data: graphData,
      },
    ])
  }, [graphData, appendData, currScore])

  const series = [
    {
      graph_data: graphData.slice(),
      data: graphData,
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
          text: 'Percent engaged (%)',
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

  return (
    <div id="chart">
      <LatestEngagementScores />
    </div>
  )
}

export default EngagementGraph
