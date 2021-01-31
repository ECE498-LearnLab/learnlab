import Login from 'components/navigation/system/Auth/Login'
import React from 'react'
import { Helmet } from 'react-helmet'

const SystemLogin = () => {
  return (
    <div>
      <Helmet title="Login" />
      <Login />
    </div>
  )
}

export default SystemLogin
