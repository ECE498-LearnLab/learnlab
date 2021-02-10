import { gql, useQuery } from '@apollo/client'
import ClassCard from 'components/learnlab/ClassCard'
import SkeletonClassCard from 'components/learnlab/ClassCard/SkeletonClassCard'
import EmptyState from 'components/learnlab/EmptyState'
import ErrorState from 'components/learnlab/ErrorState'
import CreateClassModalForm from 'components/navigation/layout/TopBar/ClassroomMenu/CreateClassModalForm'
import React, { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import CreateClassButton from './CreateClassButton'

const Dashboard = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)

  const userId = useSelector(state => state.user.id)
  const role = useSelector(state => state.user.role)
  const dispatch = useDispatch()

  const setSelectedClass = useCallback(
    classroom => {
      dispatch({
        type: 'selectedClass/SET_STATE',
        payload: {
          classId: classroom.id,
          cassName: classroom.name,
        },
      })
    },
    [dispatch],
  )

  const GET_CLASSROOMS_TAKEN = gql`
    query getClassroomsTaken($student_id: ID!) {
      classroomsTaken(student_id: $student_id) {
        classrooms {
          id
          name
          subject
        }
      }
    }
  `
  const GET_CLASSROOMS_TAUGHT = gql`
    query getClassroomsTaught($teacher_id: ID!) {
      classroomsTaught(teacher_id: $teacher_id) {
        classrooms {
          id
          name
          subject
        }
      }
    }
  `
  const { data, loading, error, refetch } = useQuery(
    role === 'INSTRUCTOR' ? GET_CLASSROOMS_TAUGHT : GET_CLASSROOMS_TAKEN,
    role === 'INSTRUCTOR'
      ? {
          variables: { teacher_id: userId },
        }
      : {
          variables: { student_id: userId },
        },
  )

  // Create Class Modal States
  const [isModalVisible, setIsModalVisible] = useState(false)
  const toggleModalVisible = () => {
    setIsModalVisible(!isModalVisible)
  }

  // for skeleton loading
  const [isLoading, setIsLoading] = useState(false)

  // memoize so classes don't rerender on each run
  const classes = useMemo(() => {
    if (loading || isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return [...Array(5).keys()].map(key => <SkeletonClassCard id={key} />)
    }
    if (error) {
      return <ErrorState />
    }
    if (data) {
      const classrooms =
        role === 'INSTRUCTOR' ? data.classroomsTaught.classrooms : data.classroomsTaken.classrooms
      const allClasses = classrooms.map(classroom => (
        <ClassCard classroom={classroom} setSelectedClass={setSelectedClass} />
      ))
      return allClasses != null && allClasses.length > 0 ? (
        allClasses
      ) : (
        <EmptyState description={<FormattedMessage id="home.empty.noClasses" />} />
      )
    }
    return <EmptyState description={<FormattedMessage id="home.empty.noClasses" />} />
  }, [data, loading, error, role, setSelectedClass, isLoading, setIsLoading])

  if (selectedClassId !== '' && selectedClassId != null) {
    // empty state
    return <Redirect to="/dashboard" />
  }

  return (
    <div>
      <Helmet title="Home | All Classes" />
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">
            <FormattedMessage id="home.title.allClasses" />
          </span>
          <CreateClassButton toggleModalVisible={toggleModalVisible} />
        </h3>
      </div>
      <div className="row">{classes}</div>
      <CreateClassModalForm
        isModalVisible={isModalVisible}
        toggleModalVisible={toggleModalVisible}
        refetchClassrooms={refetch}
      />
    </div>
  )
}

export default Dashboard
