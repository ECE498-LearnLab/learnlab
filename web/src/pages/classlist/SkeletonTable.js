import { Skeleton, Table } from 'antd'
import React from 'react'
import style from './style.module.scss'

const columns = [
  {
    key: 'avatar',
    className: 'bg-transparent text-gray-6 width-50',
    render: () => {
      return (
        <div>
          <Skeleton.Avatar size="default" active />
        </div>
      )
    },
  },
  {
    title: 'Name',
    key: 'name',
    className: 'bg-transparent text-gray-6',
    render: () => {
      return <Skeleton.Input style={{ width: 120 }} active />
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    className: 'bg-transparent text-gray-6',
    render: () => {
      return <Skeleton.Input style={{ width: 160 }} active />
    },
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    className: 'bg-transparent text-gray-6',
    render: () => {
      return <Skeleton.Input style={{ width: 90 }} active />
    },
  },
]

const data = [
  { key: 1, first_name: '', last_name: '', email: '', role: '' },
  { key: 2, first_name: '', last_name: '', email: '', role: '' },
  { key: 3, first_name: '', last_name: '', email: '', role: '' },
  { key: 4, first_name: '', last_name: '', email: '', role: '' },
]

const SkeletonTable = () => {
  return (
    <div className={`col ${style.table}`}>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  )
}

export default SkeletonTable
