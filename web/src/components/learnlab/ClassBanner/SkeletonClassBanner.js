import { Skeleton } from 'antd'
import React from 'react'
import style from './style.module.scss'

const SkeletonClassBanner = ({ active }) => {
  return (
    <div className={`card border-0 mb-4 ${style.skeleton}`}>
      <div className={`card-body ${style.banner}`}>
        <h1 className="text-white mt-4">
          <Skeleton.Input style={{ width: 400 }} active={active} />
        </h1>
        <div className={style.desc}>
          <Skeleton active={active} paragraph={{ rows: 1 }} />
        </div>
      </div>
    </div>
  )
}

export default SkeletonClassBanner
