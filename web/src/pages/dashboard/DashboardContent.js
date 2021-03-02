import { gql, useQuery } from '@apollo/client'
import { Col, Row } from 'antd'
import ClassBanner from 'components/learnlab/ClassBanner'
import SkeletonClassBanner from 'components/learnlab/ClassBanner/SkeletonClassBanner'
import Pattern from 'components/learnlab/Pattern'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ClassInfo, { SkeletonClassInfo } from './ClassInfo'
import RecentFiles from './RecentFiles'
import UpcomingRooms from './UpcomingRooms'

const DashboardContent = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const selectedClassName = useSelector(state => state.selectedClass.className)
  const user = useSelector(state => state.user)

  const GET_CLASSROOM_DETAILS = gql`
    query GetClassroomDetails($id: ID!, $role: Role!) {
      classroomDetails(id: $id, role: $role) {
        id
        classroom {
          name
          description
          created_at
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
  const { data: classroomData, loading: classroomLoading, error: classroomError } = useQuery(
    GET_CLASSROOM_DETAILS,
    {
      variables: { id: selectedClassId, role: user.role },
    },
  )

  // for skeleton loading
  const [isLoading, setIsLoading] = useState(false)

  const [classBanner, classInfo] = useMemo(() => {
    if (classroomLoading || isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return [<SkeletonClassBanner active={true} />, <SkeletonClassInfo active={true} />]
    }
    if (classroomError) {
      return [<SkeletonClassBanner active={false} />, <SkeletonClassInfo active={false} />]
    }
    if (classroomData) {
      return [
        <Pattern classnames="card border-0 mb-4" patternString={selectedClassName}>
          <ClassBanner classroom={classroomData.classroomDetails.classroom} />
        </Pattern>,
        <ClassInfo
          classroom={classroomData.classroomDetails.classroom}
          instructor={classroomData.classroomDetails.instructor}
          students={classroomData.classroomDetails.students}
        />,
      ]
    }
    return [<SkeletonClassBanner active={false} />, <SkeletonClassInfo active={false} />]
  }, [isLoading, setIsLoading, selectedClassName, classroomData, classroomLoading, classroomError])

  return (
    <div>
      {classBanner}
      <Row gutter={[24, 16]}>
        <Col flex="1 1 300px">{classInfo}</Col>
        <Col flex="1 1 300px">
          <UpcomingRooms />
        </Col>
        <Col flex="1 1 300px">
          <RecentFiles />
        </Col>
      </Row>
    </div>
  )
}

export default DashboardContent
