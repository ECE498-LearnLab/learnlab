import ACL from 'components/cleanui/system/ACL'
import { DatePicker, Form, Input, Modal, notification } from 'antd'
import { apolloClient } from 'index'
import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { injectIntl } from 'react-intl'
import { Button } from 'reactstrap'

const ScheduleRoom = props => {
  // to:do
  // don't hardcode class
  // add translations for other locales
  // invite list
  // refresh
  const CREATE_ROOM = gql`
    mutation createRoom($class_id: ID!, $name: String!, $start_time: Date, $end_time: Date) {
      createRoom(class_id: $class_id, name: $name, start_time: $start_time, end_time: $end_time) {
        id
        room_uuid
        success
        message
      }
    }
  `
  const { intl } = props
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [show, setShow] = useState(false)

  const toggleShow = () => setShow(!show)

  const onSubmit = values => {
    console.log('Success:', values)
    createRoomGql(values)
  }

  const onSubmitFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const createRoomGql = async values => {
    await apolloClient
      .mutate({
        mutation: CREATE_ROOM,
        variables: {
          class_id: 2,
          name: values.name,
          start_time: values.time[0],
          end_time: values.time[1],
        },
      })
      .then(result => {
        if (result.data.success) {
          console.log('Mutation success:', result)
          return true
        }
        return false
      })
      .catch(error => {
        notification.warning({
          message: error.code,
          description: error.message,
        })
      })
  }

  return (
    <ACL roles="INSTRUCTOR">
      <Button className="mr-3" onClick={toggleShow}>
        {intl.formatMessage({ id: 'scheduleRoom.button' })}
      </Button>

      <Modal
        visible={show}
        title="Schedule Room"
        okText="Schedule"
        cancelText="Cancel"
        onCancel={toggleShow}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields()
              onSubmit(values)
              toggleShow()
            })
            .catch(info => {
              onSubmitFailed(info)
            })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={intl.formatMessage({ id: 'scheduleRoom.form.roomName' })}
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input the room name',
              },
            ]}
          >
            <Input placeholder="Room Name" />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'scheduleRoom.form.time' })}
            name="time"
            rules={[
              {
                type: 'array',
                required: true,
                message: 'Please input the time',
              },
            ]}
          >
            <RangePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
    </ACL>
  )
}

export default injectIntl(ScheduleRoom)
