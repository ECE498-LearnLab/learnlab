import { Skeleton, Table } from 'antd'
import React from 'react'
import style from './style.module.scss'

const columns = [
  {
    key: 'AVATAR',
    className: 'bg-transparent width-50',
    render: () => {
      return (
        <div>
          <Skeleton.Avatar size="default" active />
        </div>
      )
    },
  },
  {
    title: 'NAME',
    key: 'name',
    className: 'bg-transparent',
    render: () => {
      return <Skeleton.Input style={{ width: 120 }} active />
    },
  },
  {
    title: 'EMAIL',
    dataIndex: 'email',
    key: 'email',
    className: 'bg-transparent',
    render: () => {
      return <Skeleton.Input style={{ width: 160 }} active />
    },
  },
  {
    title: 'ROLE',
    dataIndex: 'role',
    key: 'role',
    className: 'bg-transparent',
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
