import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { Button, Form, Input, List, message } from 'antd'
import QuestionCard from 'components/learnlab/QuestionCard'
import ACL from 'components/navigation/system/ACL'
import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { CardBody, CardHeader } from 'reactstrap'

const GET_QUESTIONS = gql`
  query getQuestionsForRoom($room_id: ID!) {
    questions(room_id: $room_id) {
      id
      room_id
      student_id
      text
      upvotes
      created_at
      deleted_at
    }
  }
`

const ON_QUESTION_ADDED = gql`
  subscription onQuestionAdded($room_id: ID!) {
    questionAdded(room_id: $room_id) {
      id
      room_id
      student_id
      text
      upvotes
      created_at
      deleted_at
    }
  }
`

const ON_QUESTION_ANSWERED = gql`
  subscription onQuestionAnswered($room_id: ID!) {
    questionAnswered(room_id: $room_id) {
      id
    }
  }
`

const SUBMIT_QUESTION = gql`
  mutation submitQuestion($room_id: ID!, $student_id: ID!, $text: String!) {
    submitQuestion(room_id: $room_id, student_id: $student_id, text: $text) {
      id
      created_at
      success
      message
    }
  }
`

const { TextArea } = Input

const styles = {
  questionsContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  questionsWrapper: {
    width: '100%',
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  label: {
    fontSize: '24px',
    textAnchor: 'middle',
  },
}

const QuestionList = ({ questions }) => (
  <div className="mb-2" style={styles.questionsWrapper}>
    <List
      dataSource={questions}
      locale={{ emptyText: 'No Questions' }}
      itemLayout="vertical"
      renderItem={item => <QuestionCard item={item} />}
    />
  </div>
)

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <ACL roles={['STUDENT']}>
    <h6>
      <FormattedMessage id="room.questions.editor" />
    </h6>
    <Form.Item>
      <TextArea
        allowClear={true}
        showCount={true}
        maxLength={400}
        rows={3}
        onChange={onChange}
        value={value}
      />
    </Form.Item>
    <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
      <FormattedMessage id="room.questions.button" />
    </Button>
  </ACL>
)

const Questions = () => {
  const user = useSelector(state => state.user)
  const [questions, setQuestions] = useState([])
  const [isQuestionSubmitting, setIsQuestionSubmitting] = useState(false)
  const [askedQuestion, setAskedQuestion] = useState('')

  /* Submitting a Question */
  const onSubmitSuccess = useCallback(
    data => {
      setIsQuestionSubmitting(false)
      setAskedQuestion('')
      if (data.submitQuestion.success) {
        message.success('Question submitted successfully')
      } else {
        message.error('An error occurred when submitting question')
      }
    },
    [setAskedQuestion, setIsQuestionSubmitting],
  )
  const onSubmitError = useCallback(
    err => {
      setIsQuestionSubmitting(false)
      setAskedQuestion('')
      return message.error(err.message)
    },
    [setAskedQuestion, setIsQuestionSubmitting],
  )
  const [submitQuestion] = useMutation(SUBMIT_QUESTION, {
    onCompleted: onSubmitSuccess,
    onError: onSubmitError,
  })

  const handleQuestionChange = useCallback(
    e => {
      setAskedQuestion(e.target.value)
    },
    [setAskedQuestion],
  )

  const handleQuestionSubmit = useCallback(() => {
    if (askedQuestion !== '') {
      setIsQuestionSubmitting(true)
      submitQuestion({
        variables: {
          room_id: user.selectedRoom.id,
          student_id: user.id,
          text: askedQuestion,
        },
      }).catch(() => {
        setIsQuestionSubmitting(false)
        setAskedQuestion('')
        message.error('An error occurred when submitting question')
      })
    }
  }, [user, askedQuestion, submitQuestion, setIsQuestionSubmitting, setAskedQuestion])

  /* Queries and Subscriptions */
  const { data: initialQuestionsData } = useQuery(GET_QUESTIONS, {
    variables: { room_id: user.selectedRoom.id },
    fetchPolicy: 'no-cache',
  })
  const { data: questionAddedData } = useSubscription(ON_QUESTION_ADDED, {
    variables: { room_id: user.selectedRoom.id },
  })
  const { data: questionAnsweredData } = useSubscription(ON_QUESTION_ANSWERED, {
    variables: { room_id: user.selectedRoom.id },
  })

  useEffect(() => {
    if (initialQuestionsData) {
      setQuestions(initialQuestionsData.questions.filter(q => q.deleted_at === null))
    }
  }, [setQuestions, initialQuestionsData])

  useEffect(() => {
    if (questionAddedData) {
      setQuestions(prevState => [...prevState, questionAddedData.questionAdded])
    }
  }, [setQuestions, questionAddedData])

  useEffect(() => {
    if (questionAnsweredData) {
      setQuestions(prevState =>
        prevState.filter(q => q.id !== questionAnsweredData.questionAnswered.id),
      )
    }
  }, [setQuestions, questionAnsweredData])

  return (
    <>
      <CardHeader className="card-header-borderless">
        <h5 className="mb-0 mr-2">
          <i className="fe fe-help-circle mr-2 font-size-18 text-muted" />
          <FormattedMessage id="room.title.questions" /> ({questions.length})
        </h5>
      </CardHeader>
      <CardBody style={{ maxWidth: '30vw', minWidth: '30vw' }}>
        <div style={styles.questionsContainer}>
          <QuestionList questions={questions} />
          <div>
            <Editor
              onChange={handleQuestionChange}
              onSubmit={handleQuestionSubmit}
              submitting={isQuestionSubmitting}
              value={askedQuestion}
            />
          </div>
        </div>
      </CardBody>
    </>
  )
}

export default Questions
