import { ProfileTwoTone } from '@ant-design/icons'
import { Avatar, Card, Divider, Skeleton, Tag } from 'antd'
import UserAvatar from 'components/learnlab/UserAvatar'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

const DATE_FORMAT_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

const ClassInfo = ({ classroom, instructor, students }) => {
  const locale = useSelector(state => state.settings.locale)
  const created_at = new Date(classroom.created_at).toLocaleDateString(locale, DATE_FORMAT_OPTIONS)
  const studentsAvatars = students.map(user => (
    <UserAvatar key={user.id} size="large" user={user} />
  ))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card
        className="card border-0"
        style={{ borderRadius: '11px', width: '100%', height: '100%' }}
        title={
          <div>
            <ProfileTwoTone twoToneColor="#52c41a" className="mr-2" />
            <FormattedMessage id="classInfo.classroom.title" />
          </div>
        }
      >
        <div className="mt-2" style={styles.container}>
          <div className="mb-2">
            <UserAvatar
              key={instructor.id}
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              user={instructor}
            />
          </div>
          <h5>
            {instructor.first_name} {instructor.last_name}
          </h5>
          <Tag className="mr-0">
            <FormattedMessage id="classInfo.classroom.instructor" />
          </Tag>
        </div>
        <Divider>
          <FormattedMessage id="classInfo.classroom.started" />
        </Divider>
        <div style={styles.container}>
          <h6>{created_at}</h6>
        </div>
        <Divider>
          <FormattedMessage id="classInfo.classroom.students" />
        </Divider>
        <div style={styles.container}>
          <Avatar.Group maxCount={10} maxStyle={{ color: '#fff', backgroundColor: '#a1a1c2' }}>
            {studentsAvatars}
          </Avatar.Group>
          <div>
            <FormattedMessage
              id="lobbyCard.participantsJoined"
              values={{
                count: studentsAvatars.length ?? 0,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export const SkeletonClassInfo = ({ active }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card
        className="card border-0"
        style={{ borderRadius: '11px', width: '100%', height: '100%' }}
        title={
          <div>
            <ProfileTwoTone twoToneColor="#52c41a" className="mr-2" />
            <FormattedMessage id="classInfo.classroom.title" />
          </div>
        }
      >
        <div className="mt-2" style={styles.container}>
          <div className="mb-2">
            <Skeleton.Avatar active={active} shape="circle" size={100} />
          </div>
          <Skeleton.Input style={{ width: 120 }} active={active} />
        </div>
        <Divider>
          <FormattedMessage id="classInfo.classroom.started" />
        </Divider>
        <div style={styles.container}>
          <Skeleton.Input style={{ width: 100 }} active={active} />
        </div>
        <Divider>
          <FormattedMessage id="classInfo.classroom.students" />
        </Divider>
        <div style={styles.container}>
          <Skeleton.Avatar active={active} shape="circle" size="large" />
          <div className="mt-2">
            <Skeleton.Input style={{ width: 160 }} active={active} />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ClassInfo
