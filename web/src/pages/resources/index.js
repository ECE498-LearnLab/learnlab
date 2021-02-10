import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import ResourceList from './ResourceList'

const Resources = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)

  if (selectedClassId === '') {
    // redirect to home so they choose a damn course
    return (
      <div>
        <Redirect to="/home" />
      </div>
    )
  }

  return <ResourceList />
}

export default Resources
