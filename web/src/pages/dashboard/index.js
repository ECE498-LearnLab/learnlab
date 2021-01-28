import Pattern from 'components/learnlab/Pattern'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import DashboardContent from './DashboardContent'

const Dashboard = () => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)
  const selectedClassName = useSelector(state => state.menu.selectedClassName)

  if (selectedClassId === '') {
    // empty state
    return (
      <div>
        <Helmet title="Dashboard" />
      </div>
    )
  }

  return (
    <div>
      <Helmet title="Dashboard" />
      <Pattern patternString={selectedClassName}>
        <DashboardContent />
      </Pattern>
    </div>
  )
}

export default Dashboard
