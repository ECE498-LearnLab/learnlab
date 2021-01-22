import ACL from 'components/cleanui/system/ACL'
import { DatePicker, Form, Input, Modal, notification } from 'antd'
import { apolloClient } from 'index'
import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { injectIntl } from 'react-intl'
import { Button } from 'reactstrap'

const ScheduleRoom = ({ intl, onSuccess }) => {
  // to:do
  // don't hardcode class (need list of class that teacher is teaching)
  // invite list (need list of students in that classroom)
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
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [show, setShow] = useState(false)

  const toggleShow = () => setShow(!show)

  const onSubmit = async values => {
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
        if (result.data.createRoom.success) {
          onSuccess()
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

  const onSubmitFailed = errorInfo => {
    console.log('Failed:', errorInfo)
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
