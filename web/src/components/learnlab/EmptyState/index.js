import React from 'react'
import { Ghost } from 'react-kawaii'

const EmptyState = ({ description }) => (
  <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto d-flex flex-column align-items-center">
    <Ghost size={100} mood="shocked" color="#42baf9" />
    <h3 className="text-secondary">{description}</h3>
  </div>
)

export default EmptyState
