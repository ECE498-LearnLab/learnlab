import React from 'react'
import { Helmet } from 'react-helmet'
import Register from 'components/navigation/system/Auth/Register'

const SystemRegister = () => {
  return (
    <div>
      <Helmet title="Register" />
      <Register />
    </div>
  )
}

export default SystemRegister
