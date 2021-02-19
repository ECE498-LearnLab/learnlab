import React from 'react'
import ReactApexChart from 'react-apexcharts'

const EngagementGraph = () => {
  const series = [
    {
      name: 'John',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: 'Room Average',
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
  ]

  const options = {
    chart: {
      id: 'line',
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
      width: [5, 7, 5],
      curve: 'smooth',
      dashArray: [0, 8, 5],
    },
    title: {
      text: "John's Engagement",
      align: 'left',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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

  return (
    <div className="card">
      <div className="p-3">
        <ReactApexChart options={options} series={series} type="line" height="350" />
      </div>
    </div>
  )
}

export default EngagementGraph
