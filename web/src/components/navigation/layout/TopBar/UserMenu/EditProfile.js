/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { gql, useMutation } from '@apollo/client'
import { Form, Input, Modal, notification } from 'antd'
import ACL from 'components/navigation/system/ACL'
import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'

const EditProfile = ({ intl }) => {
  const user = useSelector(state => state.user)
  console.log(user)
  const UPDATE_USER_INFO = gql`
    mutation updateUserInfo(
      $user_id: ID!
      $first_name: String
      $middle_name: String
      $last_name: String
      $phone_number: String
      $email: String
    ) {
      updateUserInfo(
        user_id: $user_id
        first_name: $first_name
        middle_name: $middle_name
        last_name: $last_name
        email: $email
        phone_number: $phone_number
      ) {
        user_id
        success
        message
      }
    }
  `

  const [form] = Form.useForm()
  const [show, setShow] = useState(false)

  const toggleShow = () => setShow(!show)

  const onUpdateUserInfoSuccess = () => {
    notification.success({
      message: 'Edit Profile Success',
      description: 'Profile successfully saved',
    })
  }

  const onUpdateUserInfoError = err => {
    notification.warning({
      message: 'Edit Profile Failure',
      description: err.message,
    })
  }

  const [updateUserInfo] = useMutation(UPDATE_USER_INFO, {
    onCompleted: onUpdateUserInfoSuccess,
    onError: onUpdateUserInfoError,
  })

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onSubmit(values)
        toggleShow()
      })
      .catch(err => {
        onSubmitFailed(err)
      })
  }

  const onCancel = () => {
    form.resetFields()
    toggleShow()
  }

  const onSubmit = values => {
    updateUserInfo({
      variables: {
        user_id: user.id,
        first_name: values.first_name === '' ? user.first_name : values.first_name,
        last_name: values.last_name === '' ? user.last_name : values.last_name,
        email: values.email === '' ? user.email : values.email,
      },
    })
  }

  const onSubmitFailed = errorInfo => {
    console.log('Submit failed:', errorInfo)
  }

  return (
    <ACL roles={['STUDENT', 'INSTRUCTOR']}>
      <div onClick={toggleShow}>
        <i className="fe fe-user mr-2" />
        {intl.formatMessage({ id: 'topBar.profileMenu.editProfile' })}
      </div>

      <Modal
        visible={show}
        title={intl.formatMessage({ id: 'editProfile.modal.title' })}
        okText={intl.formatMessage({ id: 'editProfile.modal.okText' })}
        cancelText={intl.formatMessage({ id: 'editProfile.modal.cancelText' })}
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.firstName' })}
            name="first_name"
            rules={[
              {
                required: false,
                // message: intl.formatMessage({ id: 'editProfile.form.firstNameMissing' }),
              },
            ]}
          >
            <Input placeholder={user.first_name} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.lastName' })}
            name="last_name"
            rules={[
              {
                required: false,
                // message: intl.formatMessage({ id: 'editProfile.form.lastNameMissing' }),
              },
            ]}
          >
            <Input placeholder={user.last_name} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.email' })}
            name="email"
            rules={[
              {
                required: false,
                // message: intl.formatMessage({ id: 'editProfile.form.emailMissing' }),
              },
            ]}
          >
            <Input placeholder={user.email} />
          </Form.Item>
        </Form>
      </Modal>
    </ACL>
  )
}

export default injectIntl(EditProfile)
