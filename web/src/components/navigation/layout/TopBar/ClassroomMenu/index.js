import { gql, useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledButtonDropdown,
} from 'reactstrap'
import CreateClassMenuItem from './CreateClassMenuItem'
import CreateClassModalForm from './CreateClassModalForm'
import style from './style.module.scss'

const ClassroomMenu = () => {
  const selectedClassName = useSelector(state => state.menu.selectedClassName)
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
        <div className="d-flex justify-content-center">
          <Spinner size="sm" />
        </div>
      )
    }
    if (error) {
      return null
    }
    if (data) {
      const classrooms =
        role === 'INSTRUCTOR' ? data.classroomsTaught.classrooms : data.classroomsTaken.classrooms
      const allClasses = classrooms.map(classroom => (
        <DropdownItem
          key={classroom.id}
          onClick={() => {
            setSelectedClass(classroom)
          }}
        >
          {classroom.name}
        </DropdownItem>
      ))
      return allClasses != null && allClasses.length > 0 ? allClasses : null
    }
    return null
  }, [data, loading, error, role, setSelectedClass])

  return (
    <div>
      <UncontrolledButtonDropdown className="mb-2 mr-2">
        <DropdownToggle
          className={`${style.dropdownFixedWidth} ${style.dropdownToggleFlex}`}
          color="light"
          caret
        >
          <div>
            <i className="fe fe-bookmark mr-2" />
            {selectedClassName === '' ? (
              <FormattedMessage id="classMenu.placeholder.selectClass" />
            ) : (
              selectedClassName
            )}
          </div>
        </DropdownToggle>
        <DropdownMenu className={style.dropdownFixedWidth}>
          {classes != null ? (
            classes
          ) : (
            <div className="text-center pt-2 pb-1">
              <h6 className="text-secondary">No Classes</h6>
            </div>
          )}
          <CreateClassMenuItem toggleModalVisible={toggleModalVisible} />
        </DropdownMenu>
      </UncontrolledButtonDropdown>
      <CreateClassModalForm
        isModalVisible={isModalVisible}
        toggleModalVisible={toggleModalVisible}
        refetchClassrooms={refetch}
      />
    </div>
  )
}

export default ClassroomMenu
