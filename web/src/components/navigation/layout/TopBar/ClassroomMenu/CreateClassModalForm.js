import { gql, useMutation } from '@apollo/client'
import { Form, Input, Modal, notification } from 'antd'
import ACL from 'components/navigation/system/ACL'
import React, { useCallback, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'

const CreateClassModalForm = ({ intl, isModalVisible, toggleModalVisible, refetchClassrooms }) => {
  const [createLoading, setCreateLoading] = useState(false)
  const userId = useSelector(state => state.user.id)
  const [form] = Form.useForm()
  const CREATE_CLASS = gql`
    mutation createClassroom(
      $name: String!
      $subject: String!
      $teacher_id: ID!
      $description: String
    ) {
      createClassroom(
        name: $name
        subject: $subject
        teacher_id: $teacher_id
        description: $description
      ) {
        class_id
        success
        message
      }
    }
  `

  const onCreationCompleted = useCallback(
    data => {
      setCreateLoading(false)
      if (data.createClassroom.success) {
        form.resetFields()
        toggleModalVisible()
        notification.success({
          message: 'Create Success',
          description: data.createClassroom.message,
        })
        refetchClassrooms()
      } else {
        notification.warning({
          message: 'Create Failure',
          description: 'An error occurred when creating new class',
        })
      }
    },
    [form, setCreateLoading, toggleModalVisible, refetchClassrooms],
  )

  const onCreationError = useCallback(
    error => {
      setCreateLoading(false)
      notification.warning({
        message: error.code,
        description: error.message,
      })
    },
    [setCreateLoading],
  )

  const [createClassroom] = useMutation(CREATE_CLASS, {
    onError: onCreationError,
    onCompleted: onCreationCompleted,
  })

  const onOk = useCallback(() => {
    form
      .validateFields()
      .then(values => {
        setCreateLoading(true)
        createClassroom({
          variables: {
            name: values.name,
            subject: values.subject,
            teacher_id: userId,
            description: values.description,
          },
        })
      })
      .catch(() => {
        setCreateLoading(false)
        notification.warning({
          message: 'Create Failure',
          description: 'An error occurred when creating new class',
        })
      })
  }, [form, userId, setCreateLoading, createClassroom])

  const onCancel = useCallback(() => {
    form.resetFields()
    toggleModalVisible()
  }, [form, toggleModalVisible])

  return (
    <ACL roles={['INSTRUCTOR']}>
      <Modal
        visible={isModalVisible}
        title={intl.formatMessage({ id: 'createClass.modal.title' })}
        okText={intl.formatMessage({ id: 'createClass.modal.okText' })}
        cancelText={intl.formatMessage({ id: 'createClass.modal.cancelText' })}
        confirmLoading={createLoading}
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form form={form} layout="vertical" requiredMark>
          <Form.Item
            label={intl.formatMessage({ id: 'createClass.form.className' })}
            name="name"
            max={127}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'createClass.form.classNameMissing' }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'createClass.form.classSubject' })}
            name="subject"
            max={127}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'createClass.form.classSubjectMissing' }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'createClass.form.classDescription' })}
            name="description"
            max={127}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </ACL>
  )
}

export default injectIntl(CreateClassModalForm)
