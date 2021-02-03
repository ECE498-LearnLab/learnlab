import { gql, useMutation } from '@apollo/client'
import { Modal, notification } from 'antd'
import ACL from 'components/navigation/system/ACL'
import React, { useCallback, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import EmailTagGroup from './EmailTagGroup'

const AddStudentsModal = ({ intl, isModalVisible, toggleModalVisible, refetchUsers }) => {
  const [addLoading, setAddLoading] = useState(false)
  const [tags, setTags] = useState([])
  const selectedClassId = useSelector(state => state.menu.selectedClassId)
  const ADD_STUDENTS = gql`
    mutation addStudents($class_id: ID!, $students_emails: [String!]) {
      addStudentsToClassroom(class_id: $class_id, student_emails: $students_emails) {
        success
        message
      }
    }
  `

  const onAddCompleted = useCallback(
    data => {
      setAddLoading(false)
      if (data.addStudentsToClassroom.success) {
        toggleModalVisible()
        notification.success({
          message: 'Add Success',
          description: 'Students successfully added',
        })
        refetchUsers()
      } else {
        notification.warning({
          message: 'Add Failure',
          description: 'An error occurred when adding new students',
        })
      }
    },
    [setAddLoading, toggleModalVisible, refetchUsers],
  )

  const onAddError = useCallback(
    error => {
      setAddLoading(false)
      notification.warning({
        message: error.code,
        description: error.message,
      })
    },
    [setAddLoading],
  )

  const [addStudents] = useMutation(ADD_STUDENTS, {
    onError: onAddError,
    onCompleted: onAddCompleted,
  })

  const onOk = useCallback(() => {
    if (tags.length > 0 && validateEmails(tags)) {
      setAddLoading(true)
      addStudents({
        variables: {
          class_id: selectedClassId,
          students_emails: tags,
        },
      }).catch(() => {
        setAddLoading(false)
        notification.warning({
          message: 'Add Failure',
          description: 'An error occurred when adding student(s)',
        })
      })
      setTags([])
    } else {
      notification.warning({
        message: 'Invalid Input',
        description: 'Please ensure input is not empty and contains valid emails',
      })
    }
  }, [tags, setTags, selectedClassId, setAddLoading, addStudents])

  const onCancel = useCallback(() => {
    setTags([])
    toggleModalVisible()
  }, [setTags, toggleModalVisible])

  return (
    <ACL roles={['INSTRUCTOR']}>
      <Modal
        visible={isModalVisible}
        title={intl.formatMessage({ id: 'addStudents.modal.title' })}
        okText={intl.formatMessage({ id: 'addStudents.modal.okText' })}
        cancelText={intl.formatMessage({ id: 'addStudents.modal.cancelText' })}
        confirmLoading={addLoading}
        onCancel={onCancel}
        onOk={onOk}
      >
        <EmailTagGroup tags={tags} setTags={setTags} />
      </Modal>
    </ACL>
  )
}

function validateEmails(emails) {
  const reg = /\S+@\S+\.\S+/
  return emails.filter(email => reg.test(email)).length === emails.length
}

export default injectIntl(AddStudentsModal)
