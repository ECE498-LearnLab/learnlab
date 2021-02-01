import { gql, useMutation } from '@apollo/client'
import { Form, Input, Modal, notification } from 'antd'
import React, { useCallback, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

const EditProfile = ({ intl }) => {
  const user = useSelector(state => state.user)
  // console.log(user)
  const dispatch = useDispatch()

  const updateUserState = useCallback(
    values => {
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          first_name: values.first_name,
          last_name: values.last_name,
          middle_name: values.middle_name,
          phone_number: values.phone_number,
          email: values.email,
        },
      })
      console.log('ENTERING UPDATE USER STATE')
      console.log('UPDATED STATE???')
      console.log(values)
    },
    [dispatch],
  )

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

  const toggleShow = useCallback(() => {
    setShow(!show)
  }, [setShow, show])

  const onUpdateUserInfoSuccess = useCallback(() => {
    notification.success({
      message: 'Edit Profile Success',
      description: 'Profile successfully saved',
    })
  }, [])

  const onUpdateUserInfoError = useCallback(err => {
    notification.warning({
      message: 'Edit Profile Failure',
      description: err.message,
    })
  }, [])

  const [updateUserInfo] = useMutation(UPDATE_USER_INFO, {
    onCompleted: onUpdateUserInfoSuccess,
    onError: onUpdateUserInfoError,
  })

  const onCancel = useCallback(() => {
    form.resetFields()
    toggleShow()
  }, [form, toggleShow])

  const onSubmit = useCallback(
    values => {
      const valuesToChange = {
        user_id: user.id,
        first_name:
          values.first_name === '' || values.first_name == null
            ? user.first_name
            : values.first_name,
        middle_name:
          values.middle_name === '' || values.middle_name == null
            ? user.middle_name
            : values.middle_name,
        last_name:
          values.last_name === '' || values.last_name == null ? user.last_name : values.last_name,
        phone_number:
          values.phone_number === '' || values.phone_number == null
            ? user.phone_number
            : values.phone_number,
        email: values.email === '' || values.email == null ? user.email : values.email,
      }
      updateUserInfo({
        variables: valuesToChange,
      }).then(updateUserState(valuesToChange))
    },
    [
      user.id,
      user.first_name,
      user.middle_name,
      user.last_name,
      user.phone_number,
      user.email,
      updateUserInfo,
      updateUserState,
    ],
  )

  const onSubmitFailed = useCallback(errorInfo => {
    console.log('Submit failed:', errorInfo)
  }, [])

  const onOk = useCallback(() => {
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
  }, [form, onSubmit, toggleShow, onSubmitFailed])

  const onClickEditProfile = useCallback(
    e => {
      e.preventDefault()
      toggleShow()
    },
    [toggleShow],
  )

  return (
    <div>
      <a role="button" onClick={onClickEditProfile} aria-hidden="true">
        <i className="fe fe-user mr-2" />
        {intl.formatMessage({ id: 'topBar.profileMenu.editProfile' })}
      </a>

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
              },
            ]}
          >
            <Input placeholder={user.first_name} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.middleName' })}
            name="middle_name"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder={user.middle_name} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.lastName' })}
            name="last_name"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder={user.last_name} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.phoneNumber' })}
            name="phone_number"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder={user.phone_number} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'editProfile.form.email' })}
            name="email"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder={user.email} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default injectIntl(EditProfile)