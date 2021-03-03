import { DownloadOutlined, FileTwoTone } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import { Skeleton, Button, Card, List } from 'antd'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { defaultStyles, FileIcon } from 'react-file-icon'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const NUM_FILES = 5
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

const RecentFiles = () => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)

  const { data, loading, error } = useQuery(GET_FILES, {
    variables: { class_id: selectedClassId },
  })

  // for skeleton loading
  const [isLoading, setIsLoading] = useState(false)

  const recentFiles = useMemo(() => {
    if (loading || isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return <SkeletonRecentFiles active={true} />
    }
    if (error) {
      return <SkeletonRecentFiles active={false} />
    }
    if (data) {
      const filteredList = _.orderBy(data.filesForClassroom, 'created_at', 'desc').slice(
        0,
        data.filesForClassroom.length > NUM_FILES ? NUM_FILES : data.filesForClassroom.length,
      )
      return (
        <Card
          className="card border-0"
          style={{ borderRadius: '11px', width: '100%', height: '100%' }}
          title={
            <div>
              <FileTwoTone className="mr-2" />
              <FormattedMessage id="recentFiles.title.name" />
            </div>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={filteredList}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div className="p-1" style={{ maxWidth: '2rem' }}>
                      <FileIcon
                        extension={getFileExtension(item.filename)}
                        {...defaultStyles[getFileExtension(item.filename)]}
                      />
                    </div>
                  }
                  title={<div>{_.startCase(removeExtension(item.filename))}</div>}
                />
                <div className="p-3">
                  <Button
                    href={item.storage_link}
                    type="primary"
                    shape="round"
                    icon={<DownloadOutlined />}
                  >
                    <FormattedMessage id="resources.button.download" />
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )
    }
    return <SkeletonRecentFiles active={false} />
  }, [isLoading, setIsLoading, data, loading, error])

  return <div style={{ width: '100%', height: '100%' }}>{recentFiles}</div>
}

const SkeletonRecentFiles = ({ active }) => {
  const filteredList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
  return (
    <Card
      className="card border-0"
      style={{ borderRadius: '11px', width: '100%', height: '100%' }}
      title={
        <div>
          <FileTwoTone className="mr-2" />
          <FormattedMessage id="recentFiles.title.name" />
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={filteredList}
        renderItem={() => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className="p-1" style={{ maxWidth: '2rem' }}>
                  <FileIcon />
                </div>
              }
              title={<Skeleton.Input style={{ width: 120 }} active={active} />}
            />
            <div className="p-3">
              <Skeleton.Input style={{ width: 90 }} active={active} />
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default RecentFiles
