import { Switch } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ThemeSwitch = () => {
  const theme = useSelector(state => state.settings.theme)
  const dispatch = useDispatch()

  const setTheme = nextTheme => {
    dispatch({
      type: 'settings/SET_THEME',
      payload: {
        theme: nextTheme,
      },
    })
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'menuColor',
        value: nextTheme === 'dark' ? 'dark' : 'light',
      },
    })
  }

  return (
    <Switch
      onChange={checked => {
        setTheme(checked ? 'light' : 'dark')
      }}
      checkedChildren={<i className="fe fe-sun" />}
      unCheckedChildren={<i className="fe fe-moon" />}
      defaultChecked={theme !== 'dark'}
    />
  )
}

export default ThemeSwitch
