import { gql, useMutation } from '@apollo/client'
import { Form, Input, message, Modal } from 'antd'
import ACL from 'components/navigation/system/ACL'
import React, { useCallback, useState } from 'react'
import { CirclePicker } from 'react-color'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'

const CREATE_TAG = gql`
  mutation createTag($tag: String!, $class_id: ID!, $color: String!) {
    createTag(tag: $tag, class_id: $class_id, color: $color) {
      success
      message
    }
  }
`

const CreateFileTagModal = ({ intl, isModalVisible, toggleModalVisible, refetchTags }) => {
  const selectedClassId = useSelector(state => state.selectedClass.classId)
  const [createLoading, setCreateLoading] = useState(false)
  const [form] = Form.useForm()

  /* Create Tag Mutation */
  const onCreateSuccess = useCallback(
    data => {
      setCreateLoading(false)
      if (data.createTag.success) {
        toggleModalVisible()
        message.success('Tag was successfully created')
        refetchTags()
      } else {
        message.error('An error occurred when creating new tag')
      }
    },
    [setCreateLoading, toggleModalVisible, refetchTags],
  )
  const onCreateError = useCallback(
    err => {
      setCreateLoading(false)
      return message.error(err.message)
    },
    [setCreateLoading],
  )
  const [createTag] = useMutation(CREATE_TAG, {
    onCompleted: onCreateSuccess,
    onError: onCreateError,
  })

  const onCancel = useCallback(() => {
    form.resetFields()
    toggleModalVisible()
  }, [form, toggleModalVisible])

  const onOk = useCallback(() => {
    form
      .validateFields()
      .then(values => {
        setCreateLoading(true)
        createTag({
          variables: {
            class_id: selectedClassId,
            color: values.color.hex,
            tag: values.tagName,
          },
        }).catch(() => {
          setCreateLoading(false)
          message.error('An error occurred when creating new tag')
        })
      })
      .catch(err => {
        console.log('Create Tag failed:', err)
      })
  }, [setCreateLoading, createTag, selectedClassId, form])

  return (
    <ACL roles={['INSTRUCTOR']}>
      <Modal
        visible={isModalVisible}
        title={intl.formatMessage({ id: 'createTag.modal.title' })}
        okText={intl.formatMessage({ id: 'createTag.modal.okText' })}
        cancelText={intl.formatMessage({ id: 'createTag.modal.cancelText' })}
        confirmLoading={createLoading}
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form form={form} layout="horizontal" hideRequiredMark>
          <Form.Item
            name="tagName"
            label={intl.formatMessage({ id: 'createTag.form.name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label={intl.formatMessage({ id: 'createTag.form.color' })}
            rules={[{ required: true }]}
          >
            <ColorPicker />
          </Form.Item>
        </Form>
      </Modal>
    </ACL>
  )
}

const ColorPicker = ({ value, onChange }) => {
  const [selectedColor, setSelectedColor] = useState('')

  const triggerChange = useCallback(
    newColor => {
      if (value !== newColor) {
        setSelectedColor(newColor)
        onChange(newColor)
      }
    },
    [onChange, value, setSelectedColor],
  )

  return <CirclePicker color={selectedColor} onChangeComplete={triggerChange} />
}
export default injectIntl(CreateFileTagModal)
