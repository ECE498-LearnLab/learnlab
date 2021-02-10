import { DownloadOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import { Button, Table, Tag } from 'antd'
import EmptyState from 'components/learnlab/EmptyState'
import ErrorState from 'components/learnlab/ErrorState'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { defaultStyles, FileIcon } from 'react-file-icon'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import SkeletonTable from '../classlist/SkeletonTable'
import style from './style.module.scss'
import UploadFileButton from './UploadFileButton'
import UploadFileModal from './UploadFileModal'

const GET_FILES = gql`
  query getFileForClassroom($class_id: ID!) {
    filesForClassroom(class_id: $class_id) {
      id
      filename
      storage_link
      created_at
      tags {
        id
        color
        tag
      }
    }
  }
`

const TAGS_FOR_CLASSROOM = gql`
  query getFileTagsForClassroom($class_id: ID!) {
    fileTagsForClassroom(class_id: $class_id) {
      id
      tag
      class_id
      color
    }
  }
`

/* Helper Functions */
const getFileExtension = filename => {
  const ext = /^.+\.([^.]+)$/.exec(filename)
  return ext == null ? '' : ext[1]
}

const removeExtension = filename => {
  const lastDotPosition = filename.lastIndexOf('.')
  if (lastDotPosition === -1) return filename
  return filename.substr(0, lastDotPosition)
}

const ResourceList = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const locale = useSelector(state => state.settings.locale)

  const { data, loading, error, refetch } = useQuery(GET_FILES, {
    variables: { class_id: selectedClassId },
  })

  /* UploadFileModal props */
  const [isModalVisible, setIsModalVisible] = useState(false)
  const toggleModalVisible = () => {
    setIsModalVisible(!isModalVisible)
  }

  /* Loading States */
  const [isLoading, setIsLoading] = useState(false)

  const resources = useMemo(() => {
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
      const files = data.filesForClassroom
      const allFiles = files.map(_file => {
        return { ..._file, key: _file.id, locale }
      })
      if (allFiles.length === 0) {
        return <EmptyState description={<FormattedMessage id="resources.empty.noResources" />} />
      }
      return <CustomizedTable dataSource={allFiles} />
    }
    return <ErrorState />
  }, [data, loading, error, locale, isLoading, setIsLoading])

  return (
    <div>
      <Helmet title="Home | Resources" />
      <div className="kit__utils__heading">
        <h3>
          <span className="mr-3">
            <FormattedMessage id="resources.title.Resources" />
          </span>
          <UploadFileButton toggleModalVisible={toggleModalVisible} />
        </h3>
      </div>
      <div className="row">{resources}</div>
      <UploadFileModal
        isModalVisible={isModalVisible}
        toggleModalVisible={toggleModalVisible}
        refetchFiles={refetch}
      />
    </div>
  )
}

const CustomizedTable = ({ dataSource }) => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const { data, error, loading } = useQuery(TAGS_FOR_CLASSROOM, {
    variables: { class_id: selectedClassId },
  })
  const tagOptions = useMemo(() => {
    if (loading) {
      return []
    }
    if (error) {
      return []
    }
    if (data) {
      return data.fileTagsForClassroom.map(tag => {
        return { text: tag.tag, value: tag.id }
      })
    }
    return []
  }, [data, loading, error])

  const columns = [
    {
      key: 'file_icon',
      className: 'bg-transparent width-50',
      render: record => {
        const fileType = getFileExtension(record.filename)
        return (
          <div className="p-1" style={{ minWidth: '3rem' }}>
            <FileIcon extension={fileType} {...defaultStyles[fileType]} />
          </div>
        )
      },
    },
    {
      title: 'NAME',
      key: 'filename',
      dataIndex: 'filename',
      className: 'bg-transparent',
      render: text => {
        return <div>{_.startCase(removeExtension(text))}</div>
      },
      sorter: (a, b) =>
        _.startCase(removeExtension(a.filename)).localeCompare(
          _.startCase(removeExtension(b.filename)),
        ),
    },
    {
      title: 'TAGS',
      key: 'tags',
      dataIndex: 'tags',
      className: 'bg-transparent',
      render: tags => (
        <span>
          {tags.map(tag => {
            return (
              <Tag color={tag.color} key={tag.id}>
                {tag.tag.toUpperCase()}
              </Tag>
            )
          })}
        </span>
      ),
      filters: tagOptions,
      onFilter: (value, record) => record.tags.some(tag => tag.id === value),
    },
    {
      title: 'POSTED',
      key: 'created_at',
      className: 'bg-transparent width-50',
      render: record => {
        const DATE_FORMAT_OPTIONS = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
        return (
          <div>
            {new Date(record.created_at).toLocaleString(record.locale, DATE_FORMAT_OPTIONS)}
          </div>
        )
      },
      sorter: (a, b) => a.created_at - b.created_at,
    },
    {
      key: 'download_file',
      className: 'bg-transparent width-50',
      render: record => {
        return (
          <div className="p-3">
            <Button
              href={record.storage_link}
              type="primary"
              shape="round"
              icon={<DownloadOutlined />}
            >
              <FormattedMessage id="resources.button.download" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className={`col ${style.table}`}>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  )
}

export default ResourceList
