import { gql, useQuery } from '@apollo/client'
import ClassBanner from 'components/learnlab/ClassBanner'
import Pattern from 'components/learnlab/Pattern'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

const DashboardContent = () => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)
  const selectedClassName = useSelector(state => state.menu.selectedClassName)
  const user = useSelector(state => state.user)

  const GET_CLASSROOM_DETAILS = gql`
    query GetClassroomDetails($id: ID!, $role: Role!) {
      classroomDetails(id: $id, role: $role) {
        classroom {
          name
          description
        }
        instructor {
          id
          first_name
          last_name
          email
        }
        students {
          id
          first_name
          last_name
          email
        }
      }
    }
  `
  const { data, loading, error } = useQuery(GET_CLASSROOM_DETAILS, {
    variables: { id: selectedClassId, role: user.role },
  })

  const classBanner = useMemo(() => {
    if (loading) {
      return <ClassBanner loading={true} classroom={null} />
    }
    if (error) {
      // to-do adddd error staaaaattteeee
      return null
    }
    if (data) {
      const { classroom } = data.classroomDetails
      return <ClassBanner loading={false} classroom={classroom} />
    }
    return null
  }, [data, loading, error])

  return (
    <Pattern classnames="card border-0 mb-4" patternString={selectedClassName}>
      {classBanner}
    </Pattern>
  )
}

export default DashboardContent
