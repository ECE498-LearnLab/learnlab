import Error500 from 'components/navigation/system/Errors/500'
import React from 'react'
import { Helmet } from 'react-helmet'

const System500 = () => {
  return (
    <div>
      <Helmet title="Page 500" />
      <Error500 />
    </div>
  )
}

export default System500
