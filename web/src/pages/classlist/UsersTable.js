import { gql, useQuery } from '@apollo/client'
import { Table, Tag } from 'antd'
import ErrorState from 'components/learnlab/ErrorState'
import UserAvatar from 'components/learnlab/UserAvatar'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import AddStudentsButton from './AddStudentsButton'
import AddStudentsModal from './AddStudentsModal'
import SkeletonTable from './SkeletonTable'
import style from './style.module.scss'

const columns = [
  {
    key: 'avatar',
    className: 'bg-transparent width-50',
    render: record => {
      return (
        <div>
          <UserAvatar size="default" user={record} />
        </div>
      )
    },
  },
  {
    title: 'NAME',
    key: 'name',
    className: 'bg-transparent',
    render: record => {
      return (
        <div>
          {record.first_name} {record.middle_name ?? ''} {record.last_name}
        </div>
      )
    },
  },
  {
    title: 'EMAIL',
    dataIndex: 'email',
    key: 'email',
    className: 'bg-transparent',
    render: text => {
      return <a className="text-blue">{text}</a>
    },
  },
  {
    title: 'ROLE',
    dataIndex: 'role',
    key: 'role',
    className: 'bg-transparent',
    render: text => {
      return <Tag>{text}</Tag>
    },
  },
]

const UsersTable = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const user = useSelector(state => state.user)

  const GET_CLASSROOM_USERS = gql`
    query GetClassroomDetails($id: ID!, $role: Role!) {
      classroomDetails(id: $id, role: $role) {
        instructor {
          id
          first_name
          last_name
          middle_name
          role
          email
        }
        students {
          id
          first_name
          last_name
          middle_name
          role
          email
        }
      }
    }
  `
  const { data, loading, error, refetch } = useQuery(GET_CLASSROOM_USERS, {
    variables: { id: selectedClassId, role: user.role },
  })

  // Invite students modal states
  const [isModalVisible, setIsModalVisible] = useState(false)
  const toggleModalVisible = () => {
    setIsModalVisible(!isModalVisible)
  }

  // for skeleton loading
  const [isLoading, setIsLoading] = useState(false)

  // memoize so classes don't rerender on each run
  const users = useMemo(() => {
    if (loading || isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return <SkeletonTable />
    }
    if (error) {
      return <ErrorState />
    }
    if (data) {
      const { instructor, students } = data.classroomDetails
      const allStudents = _.orderBy(students, 'first_name', 'asc')
      const allUsers = [instructor, ...allStudents].map(_user => {
        return { ..._user, key: _user.id }
      })
      return (
        <div className={`col ${style.table}`}>
          <Table columns={columns} dataSource={allUsers} pagination={false} />
        </div>
      )
    }
    return <ErrorState />
  }, [data, loading, error, isLoading, setIsLoading])

  return (
    <div>
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">
            <FormattedMessage id="classlist.title.Classlist" />
          </span>
          <AddStudentsButton toggleModalVisible={toggleModalVisible} />
        </h3>
      </div>
      <div className="row">{users}</div>
      <AddStudentsModal
        isModalVisible={isModalVisible}
        toggleModalVisible={toggleModalVisible}
        refetchUsers={refetch}
      />
    </div>
  )
}

export default UsersTable
