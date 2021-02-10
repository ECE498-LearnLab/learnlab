import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import DashboardContent from './DashboardContent'

const Dashboard = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)

  if (selectedClassId === '') {
    // redirect to home so they choose a damn course
    return (
      <div>
        <Redirect to="/home" />
      </div>
    )
  }

  return (
    <div>
      <Helmet title="Dashboard" />
      <DashboardContent />
    </div>
  )
}

export default Dashboard
