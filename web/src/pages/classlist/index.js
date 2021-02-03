import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import UsersTable from './UsersTable'

const Dashboard = () => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)

  if (selectedClassId === '') {
    return (
      <div>
        <Redirect to="/home" />
      </div>
    )
  }

  return (
    <div>
      <Helmet title="Classlist" />
      <UsersTable />
    </div>
  )
}

export default Dashboard
