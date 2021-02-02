import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Planet } from 'react-kawaii'

const ErrorState = () => (
  <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto d-flex flex-column align-items-center">
    <Planet size={100} mood="sad" color="#42baf9" />
    <h3 className="text-secondary">
      <FormattedMessage id="error.message.oops" />
    </h3>
  </div>
)

export default ErrorState
