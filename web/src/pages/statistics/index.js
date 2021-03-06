import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import EngagementDashboard from './EngagementDashboard'

const Dashboard = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const engagementDashboard = useMemo(() => {
    return <EngagementDashboard key={selectedClassId} selectedClassId={selectedClassId} />
  }, [selectedClassId])

  if (selectedClassId === '') {
    return (
      <div>
        <Redirect to="/home" />
      </div>
    )
  }

  return (
    <div>
      <Helmet title="Engagement Statistics" />
      {engagementDashboard}
    </div>
  )
}

export default Dashboard
