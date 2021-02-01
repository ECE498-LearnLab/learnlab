import { Dropdown, Menu } from 'antd'
import UserAvatar from 'components/learnlab/UserAvatar'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import EditProfile from './EditProfile'
import styles from './style.module.scss'

const ProfileMenu = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const logout = e => {
    e.preventDefault()
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <strong>
          <FormattedMessage id="topBar.profileMenu.hello" />, {user.first_name} {user.last_name}
        </strong>
        <div>
          <strong>
            <FormattedMessage id="topBar.profileMenu.role" />:{' '}
          </strong>
          {user.role || '—'}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <div>
          <strong>
            <FormattedMessage id="topBar.profileMenu.email" />:{' '}
          </strong>
          {user.email || '—'}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <EditProfile />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className={styles.dropdown}>
        <UserAvatar user={user} size="large" />
      </div>
    </Dropdown>
  )
}

export default ProfileMenu
