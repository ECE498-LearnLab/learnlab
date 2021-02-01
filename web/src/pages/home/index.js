import { gql, useQuery } from '@apollo/client'
import { Card } from 'antd'
import Pattern from 'components/learnlab/Pattern'
import CreateClassModalForm from 'components/navigation/layout/TopBar/ClassroomMenu/CreateClassModalForm'
import React, { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import CreateClassButton from './CreateClassButton'

const Dashboard = () => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)

  const userId = useSelector(state => state.user.id)
  const role = useSelector(state => state.user.role)
  const dispatch = useDispatch()

  const setSelectedClass = useCallback(
    classroom => {
      dispatch({
        type: 'menu/SET_STATE',
        payload: {
          selectedClassId: classroom.id,
          selectedClassName: classroom.name,
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

  // memoize so classes don't rerender on each run
  const classes = useMemo(() => {
    if (loading) {
      return (
        // todo skeleton loading statttee
        null
      )
    }
    if (error) {
      return null
    }
    if (data) {
      const classrooms =
        role === 'INSTRUCTOR' ? data.classroomsTaught.classrooms : data.classroomsTaken.classrooms
      const allClasses = classrooms.map(classroom => (
        <div key={classroom.id} className="col-md-4">
          <Card
            hoverable
            className="card border-0 m-2"
            style={{ width: 350 }}
            onClick={() => {
              setSelectedClass(classroom)
            }}
            cover={
              <Pattern patternString={classroom.name}>
                <div style={{ width: 350, height: 100 }} />
              </Pattern>
            }
          >
            <h6>{classroom.name}</h6>
          </Card>
        </div>
      ))
      return allClasses != null && allClasses.length > 0 ? allClasses : null
    }
    return null
  }, [data, loading, error, role, setSelectedClass])

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
