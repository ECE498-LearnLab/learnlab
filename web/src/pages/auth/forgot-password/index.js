import React from 'react'
import { Helmet } from 'react-helmet'
import ForgotPassword from 'components/navigation/system/Auth/ForgotPassword'

const SystemForgotPassword = () => {
  return (
    <div>
      <Helmet title="Forgot Password" />
      <ForgotPassword />
    </div>
  )
}

export default SystemForgotPassword
