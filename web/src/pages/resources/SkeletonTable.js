import { Skeleton, Table } from 'antd'
import React from 'react'
import { FileIcon } from 'react-file-icon'
import style from './style.module.scss'

const columns = [
  {
    key: 'file_icon',
    className: 'bg-transparent width-50',
    render: () => {
      return (
        <div className="p-1" style={{ minWidth: '3rem' }}>
          <FileIcon />
        </div>
      )
    },
  },
  {
    title: 'NAME',
    key: 'filename',
    dataIndex: 'filename',
    className: 'bg-transparent',
    render: () => {
      return <Skeleton.Input style={{ width: 120 }} active />
    },
  },
  {
    title: 'TAGS',
    key: 'tags',
    dataIndex: 'tags',
    className: 'bg-transparent',
    render: () => {
      return <Skeleton.Input style={{ width: 90 }} active />
    },
  },
  {
    title: 'POSTED',
    key: 'created_at',
    className: 'bg-transparent width-50',
    render: () => {
      return <Skeleton.Input style={{ width: 160 }} active />
    },
  },
  {
    key: 'download_file',
    className: 'bg-transparent width-50',
    render: () => {
      return <Skeleton.Input style={{ width: 90 }} active />
    },
  },
]

const data = [
  { key: 1, filename: '', tags: [], created_at: '' },
  { key: 2, filename: '', tags: [], created_at: '' },
  { key: 3, filename: '', tags: [], created_at: '' },
  { key: 4, filename: '', tags: [], created_at: '' },
]

const SkeletonTable = () => {
  return (
    <div className={`col ${style.table}`}>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  )
}

export default SkeletonTable
