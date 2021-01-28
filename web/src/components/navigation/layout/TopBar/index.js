import { Divider } from 'antd'
import React from 'react'
import ClassroomMenu from './ClassroomMenu'
import LanguageSwitcher from './LanguageSwitcher'
import style from './style.module.scss'
import ThemeSwitch from './ThemeSwitch'
import UserMenu from './UserMenu'

const TopBar = () => {
  return (
    <div className={style.topbar}>
      <div className="mr-auto">
        <ClassroomMenu />
      </div>
      <div className="d-none d-sm-block">
        <UserMenu />
      </div>
      <Divider className="mx-3" type="vertical" />
      <div className="mr-3">
        <ThemeSwitch />
      </div>
      <div className="">
        <LanguageSwitcher />
      </div>
    </div>
  )
}

export default TopBar
