import React from 'react'
import style from './style.module.scss'

const ClassBanner = ({ loading, classroom }) => {
  if (loading) {
    return <div className={`card-body ${style.banner}`} />
  }
  return (
    <div className={`card-body ${style.banner}`}>
      <h1 className="text-white mt-4">
        <strong>{classroom.name}</strong>
      </h1>
      <div className={style.desc}>
        <h6 className="text-white mt-2">{classroom.description}</h6>
      </div>
    </div>
  )
}

export default ClassBanner
