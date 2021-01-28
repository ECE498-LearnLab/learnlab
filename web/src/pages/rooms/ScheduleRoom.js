import { gql, useMutation, useQuery } from '@apollo/client'
import { DatePicker, Form, Input, Modal, notification } from 'antd'
import ACL from 'components/navigation/system/ACL'
import moment from 'moment'
import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'

const ScheduleRoom = ({ intl, onSuccess }) => {
  const selectedClassId = useSelector(state => state.menu.selectedClassId)
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
  const GET_CLASSROOM = gql`
    query GetClassroomDetails($id: ID!, $role: Role!) {
      classroomDetails(id: $id, role: $role) {
        students {
          id
          first_name
          last_name
          email
        }
      }
    }
  `

  const INVITE_PARTICIPANTS = gql`
    mutation inviteToRoom($student_ids: [ID!]!, $room_id: ID!) {
      invite(student_ids: $student_ids, room_id: $room_id) {
        success
        message
      }
    }
  `

  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [show, setShow] = useState(false)

  const toggleShow = () => setShow(!show)

  const onCreateRoomSuccess = res => {
    if (res.createRoom.success) {
      const student_ids = data.classroomDetails.students.map(r => r.id)
      inviteParticipants({
        variables: {
          student_ids,
          room_id: res.createRoom.id,
        },
      })
      onSuccess()
      notification.success({
        message: 'Schedule Success',
        description: 'Room successfully scheduled',
      })
    } else {
      notification.warning({
        message: 'Schedule Failure',
        description: 'An error occurred scheduling the room',
      })
    }
  }

  const onCreateRoomError = err => {
    notification.warning({
      message: err.code,
      description: err.message,
    })
  }

  const onInviteParticipantsError = err => {
    notification.warning({
      message: 'Invite Participants Failure',
      description: err.message,
    })
  }

  const { data } = useQuery(GET_CLASSROOM, {
    variables: { id: selectedClassId, role: 'INSTRUCTOR' },
  })

  const [createRoom] = useMutation(CREATE_ROOM, {
    onCompleted: onCreateRoomSuccess,
    onError: onCreateRoomError,
  })

  const [inviteParticipants] = useMutation(INVITE_PARTICIPANTS, {
    onError: onInviteParticipantsError,
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

  const disabledDate = current => {
    // Can not select days before today
    return current && current < moment().startOf('day')
  }

  const onSubmit = values => {
    createRoom({
      variables: {
        class_id: selectedClassId,
        name: values.name,
        start_time: values.time[0],
        end_time: values.time[1],
      },
    })
  }

  const onSubmitFailed = errorInfo => {
    console.log('Submit failed:', errorInfo)
  }

  return (
    <ACL roles={['INSTRUCTOR']}>
      <Button color="success" className="mr-3" onClick={toggleShow}>
        {intl.formatMessage({ id: 'scheduleRoom.button' })}
      </Button>

      <Modal
        visible={show}
        title={intl.formatMessage({ id: 'scheduleRoom.modal.title' })}
        okText={intl.formatMessage({ id: 'scheduleRoom.modal.okText' })}
        cancelText={intl.formatMessage({ id: 'scheduleRoom.modal.cancelText' })}
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Form.Item
            label={intl.formatMessage({ id: 'scheduleRoom.form.roomName' })}
            name="name"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'scheduleRoom.form.roomNameMissing' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'scheduleRoom.form.roomName' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'scheduleRoom.form.time' })}
            name="time"
            rules={[
              {
                type: 'array',
                required: true,
                message: intl.formatMessage({ id: 'scheduleRoom.form.timeMissing' }),
              },
            ]}
          >
            <RangePicker
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00', 'HH:mm')],
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ACL>
  )
}

export default injectIntl(ScheduleRoom)
