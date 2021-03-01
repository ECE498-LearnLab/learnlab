import { CheckCircleFilled, LikeFilled, MessageFilled } from '@ant-design/icons'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { Badge, Card, message, Skeleton } from 'antd'
import UserAvatar from 'components/learnlab/UserAvatar'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      user {
        id
        email
        first_name
        last_name
        role
      }
    }
  }
`

const ON_QUESTION_UPVOTED_CHANGED = gql`
  subscription onQuestionUpvoteChanged($question_id: ID!) {
    questionUpvoteChanged(question_id: $question_id) {
      id
      upvotes
    }
  }
`

const ANSWER_QUESTION = gql`
  mutation answerQuestion($id: ID!, $room_id: ID!) {
    answerQuestion(id: $id, room_id: $room_id) {
      success
      message
    }
  }
`

const UPVOTE_QUESTION = gql`
  mutation upvoteQuestion($id: ID!) {
    upvoteQuestion(id: $id) {
      upvotes
    }
  }
`

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionContainer: {
    fontSize: '16px',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}

const QuestionCard = ({ item }) => {
  const user = useSelector(state => state.user)
  const [liked, setLiked] = useState(false)
  const [numLikes, setNumLikes] = useState(item.upvotes)

  /* Queries and Subscriptions */
  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      id: item.student_id,
    },
  })
  const { data: questionUpvotesData } = useSubscription(ON_QUESTION_UPVOTED_CHANGED, {
    variables: { question_id: item.id },
  })

  /* Upvote Question Mutation */
  const onUpvoteSuccess = useCallback(
    res => {
      if (res.upvoteQuestion.upvotes) {
        setLiked(true)
      }
    },
    [setLiked],
  )
  const [upvoteQuestion] = useMutation(UPVOTE_QUESTION, {
    onCompleted: onUpvoteSuccess,
  })

  /* Answer Question Mutation */
  const [answerQuestion] = useMutation(ANSWER_QUESTION)

  const [studentAvatar, studentName] = useMemo(() => {
    if (loading) {
      return [
        <Skeleton.Avatar active={true} size="large" shape="circle" />,
        <Skeleton.Input active={true} />,
      ]
    }
    if (error) {
      return [
        <Skeleton.Avatar active={false} size="large" shape="circle" />,
        <Skeleton.Input active={false} />,
      ]
    }
    if (data) {
      return [
        <UserAvatar size="large" user={data.user.user} />,
        `${data.user.user.first_name} ${data.user.user.last_name}`,
      ]
    }
  }, [loading, error, data])

  useEffect(() => {
    if (questionUpvotesData) {
      setNumLikes(questionUpvotesData.questionUpvoteChanged.upvotes)
    }
  }, [questionUpvotesData, setNumLikes])

  const likeQuestion = useCallback(() => {
    if (!liked) {
      upvoteQuestion({
        variables: {
          id: item.id,
        },
      }).catch(() => {
        message.error('An error occurred when liking question')
      })
    }
  }, [item, upvoteQuestion, liked])

  const answerQuestionCallback = useCallback(() => {
    answerQuestion({
      variables: {
        id: item.id,
        room_id: user.selectedRoom.id,
      },
    }).catch(() => {
      message.error('An error occurred when marking question as answered')
    })
  }, [user, item.id, answerQuestion])

  const actions = useMemo(() => {
    if (user.role === 'INSTRUCTOR') {
      return [
        <div
          className={`${liked ? style.actionIconLiked : style.actionIcon}`}
          aria-hidden="true"
          role="button"
          onClick={likeQuestion}
          key="upvote"
        >
          <LikeFilled className={`mr-1 ${liked ? style.actionIconLiked : style.actionIcon}`} />
          {numLikes}
        </div>,
        <div className={style.actionIcon} aria-hidden="true" role="button">
          <CheckCircleFilled
            onClick={answerQuestionCallback}
            className={style.actionIcon}
            key="answer"
          />
        </div>,
      ]
    }
    return [
      <div
        className={`${liked ? style.actionIconLiked : style.actionIcon}`}
        aria-hidden="true"
        role="button"
        onClick={likeQuestion}
        key="upvote"
      >
        <LikeFilled className={`mr-1 ${liked ? style.actionIconLiked : style.actionIcon}`} />
        {numLikes}
      </div>,
    ]
  }, [user, answerQuestionCallback, likeQuestion, liked, numLikes])

  return (
    <Card className="m-2" style={{ borderRadius: '11px' }} actions={actions}>
      <div style={styles.container}>
        <Card.Meta
          avatar={
            <Badge offset={[-4, 4]} count={<MessageFilled style={{ color: 'green' }} />}>
              {studentAvatar}
            </Badge>
          }
          title={studentName}
          description={item.text}
        />
      </div>
    </Card>
  )
}

export default QuestionCard
