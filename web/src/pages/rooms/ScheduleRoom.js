import { gql, useMutation, useQuery } from '@apollo/client'
import { DatePicker, Form, Input, Modal, notification, Radio, Select } from 'antd'
import ACL from 'components/navigation/system/ACL'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'

const ParticipantsEnum = Object.freeze({ all: 1, custom: 2 })

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
  const { Option } = Select

  const [form] = Form.useForm()
  const [show, setShow] = useState(false)
  const [participants, setParticipants] = useState([])
  const [participantsType, setParticipantsType] = useState(ParticipantsEnum.all)

  const toggleShow = useCallback(() => setShow(!show), [setShow, show])
  const onParticipantsTypeChange = useCallback(e => setParticipantsType(e.target.value), [
    setParticipantsType,
  ])

  const { data, error, loading } = useQuery(GET_CLASSROOM, {
    variables: { id: selectedClassId, role: 'INSTRUCTOR' },
  })

  /* Invite Participants */
  const onInviteParticipantsSuccess = useCallback(() => {
    setParticipants([])
  }, [setParticipants])

  const onInviteParticipantsError = useCallback(
    err => {
      setParticipants([])
      notification.warning({
        message: 'Invite Participants Failure',
        description: err.message,
      })
    },
    [setParticipants],
  )

  const [inviteParticipants] = useMutation(INVITE_PARTICIPANTS, {
    onCompleted: onInviteParticipantsSuccess,
    onError: onInviteParticipantsError,
  })

  /* Create Room */
  const onCreateRoomSuccess = useCallback(
    res => {
      if (res.createRoom.success) {
        inviteParticipants({
          variables: {
            student_ids: participants,
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
    },
    [inviteParticipants, onSuccess, participants],
  )

  const onCreateRoomError = useCallback(err => {
    return notification.warning({
      message: err.code,
      description: err.message,
    })
  }, [])

  const [createRoom] = useMutation(CREATE_ROOM, {
    onCompleted: onCreateRoomSuccess,
    onError: onCreateRoomError,
  })

  const participantOptions = useMemo(() => {
    if (loading) {
      return []
    }
    if (error) {
      return []
    }
    if (data) {
      return data.classroomDetails.students.map(student => {
        return (
          <Option key={student.email} value={student.id} label={student.email}>
            {student.email}
          </Option>
        )
      })
    }
    return []
  }, [data, loading, error])

  const onCancel = useCallback(() => {
    form.resetFields()
    toggleShow()
  }, [form, toggleShow])

  const disabledDate = useCallback(current => {
    // Can not select days before today
    return current && current < moment().startOf('day')
  }, [])

  const onSubmit = useCallback(
    values => {
      createRoom({
        variables: {
          class_id: selectedClassId,
          name: values.name,
          start_time: values.time[0],
          end_time: values.time[1],
        },
      })
    },
    [createRoom, selectedClassId],
  )

  const onSubmitFailed = useCallback(errorInfo => {
    console.log('Submit failed:', errorInfo)
  }, [])

  const onOk = useCallback(() => {
    form
      .validateFields()
      .then(values => {
        setParticipants(() => {
          if (participantsType !== ParticipantsEnum.custom) {
            return data.classroomDetails.students.map(r => r.id)
          }
          if (values.participants) {
            return values.participants
          }
          return []
        })
        setParticipantsType(ParticipantsEnum.all)
        form.resetFields()
        onSubmit(values)
        toggleShow()
      })
      .catch(err => {
        onSubmitFailed(err)
      })
  }, [data, form, participantsType, setParticipantsType, onSubmit, toggleShow, onSubmitFailed])

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
          <Form.Item
            name="participantsType"
            label={intl.formatMessage({ id: 'scheduleRoom.form.participants' })}
          >
            <Radio.Group onChange={onParticipantsTypeChange} defaultValue={ParticipantsEnum.all}>
              <Radio value={ParticipantsEnum.all}>All</Radio>
              <Radio value={ParticipantsEnum.custom}>Custom</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="participants">
            <Select
              mode="multiple"
              optionFilterProp="label"
              allowClear
              disabled={participantsType === ParticipantsEnum.all}
              style={{ width: '100%' }}
              placeholder={intl.formatMessage({
                id: 'scheduleRoom.form.selectParticipants.placeholder',
              })}
            >
              {participantOptions}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ACL>
  )
}

export default injectIntl(ScheduleRoom)
