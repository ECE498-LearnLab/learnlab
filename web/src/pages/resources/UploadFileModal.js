import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal, notification, Select, Tag, Upload } from 'antd'
import ACL from 'components/navigation/system/ACL'
import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import CreateFileTagModal from './CreateFileTagModal'

const SINGLE_UPLOAD = gql`
  mutation singleUpload($file: FileUpload!, $class_id: ID!, $tags: [ID!]) {
    uploadFile(file: $file, class_id: $class_id, tags: $tags) {
      success
      message
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

const UploadFileModal = ({ intl, isModalVisible, toggleModalVisible, refetchFiles }) => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const [form] = Form.useForm()
  const { Option } = Select
  const [uploadLoading, setUploadLoading] = useState(false)

  /* File Uploader Configuration */
  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 100)
  }
  const normFile = useCallback(e => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }, [])

  /* Upload File Mutation */
  const onUploadFileSuccess = useCallback(
    data => {
      setUploadLoading(false)
      if (data.uploadFile.success) {
        form.resetFields()
        toggleModalVisible()
        notification.success({
          message: 'Upload Success',
          description: 'File was successfully uploaded',
        })
        refetchFiles()
      } else {
        notification.warning({
          message: 'Upload Failure',
          description: 'An error occurred while uploading the file',
        })
      }
    },
    [form, setUploadLoading, toggleModalVisible, refetchFiles],
  )
  const onUploadFileError = useCallback(
    err => {
      setUploadLoading(false)
      return notification.warning({
        message: err.code,
        description: err.message,
      })
    },
    [setUploadLoading],
  )
  const [uploadFile] = useMutation(SINGLE_UPLOAD, {
    onCompleted: onUploadFileSuccess,
    onError: onUploadFileError,
  })

  /* File Tags */
  const [isTagModalVisible, setIsTagModalVisible] = useState(false)
  const toggleTagModalVisible = () => {
    setIsTagModalVisible(!isTagModalVisible)
  }
  const { data, error, loading, refetch } = useQuery(TAGS_FOR_CLASSROOM, {
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
        return (
          <Option key={tag.id} value={tag.id} label={tag.tag}>
            {tag.tag}
          </Option>
        )
      })
    }
    return []
  }, [data, loading, error])

  const onCancel = useCallback(() => {
    form.resetFields()
    toggleModalVisible()
  }, [form, toggleModalVisible])

  const onOk = useCallback(() => {
    form
      .validateFields()
      .then(values => {
        setUploadLoading(true)
        uploadFile({
          variables: {
            class_id: selectedClassId,
            file: values.file[0].originFileObj,
            tags: values.tags,
          },
        }).catch(() => {
          setUploadLoading(false)
          notification.warning({
            message: 'Upload Failure',
            description: 'An error occurred while uploading file',
          })
        })
      })
      .catch(err => {
        console.log('Upload File failed:', err)
      })
  }, [setUploadLoading, uploadFile, selectedClassId, form])

  const tagRender = props => {
    const { label, value, closable, onClose } = props
    return (
      <Tag
        color={data.fileTagsForClassroom.find(x => x.id === value).color}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }

  return (
    <ACL roles={['INSTRUCTOR']}>
      <Modal
        visible={isModalVisible}
        title={intl.formatMessage({ id: 'uploadFile.modal.title' })}
        okText={intl.formatMessage({ id: 'uploadFile.modal.okText' })}
        cancelText={intl.formatMessage({ id: 'uploadFile.modal.cancelText' })}
        confirmLoading={uploadLoading}
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Form.Item
            label={intl.formatMessage({ id: 'uploadFile.form.file' })}
            name="file"
            valuePropName="file"
            getValueFromEvent={normFile}
            noStyle
            rules={[{ required: true }]}
          >
            <Upload.Dragger customRequest={dummyRequest}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                <FormattedMessage id="uploadFile.modal.message" />
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="tags" label={intl.formatMessage({ id: 'uploadFile.form.tags' })}>
            <Select
              mode="multiple"
              tagRender={tagRender}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <a
                    aria-hidden="true"
                    role="button"
                    style={{ display: 'flex', padding: 8 }}
                    onClick={toggleTagModalVisible}
                  >
                    <h6 className="text-success">
                      <i className="fe fe-plus mr-1" />
                      <FormattedMessage id="uploadFile.form.createTag" />
                    </h6>
                  </a>
                </div>
              )}
            >
              {tagOptions}
            </Select>
          </Form.Item>
        </Form>
        <CreateFileTagModal
          isModalVisible={isTagModalVisible}
          toggleModalVisible={toggleTagModalVisible}
          refetchTags={refetch}
        />
      </Modal>
    </ACL>
  )
}

export default injectIntl(UploadFileModal)
