import { Card, Skeleton } from 'antd'
import React from 'react'
import style from './style.module.scss'

const SkeletonClassCard = ({ id }) => {
  return (
    <div key={id} className="col-md-4">
      <Card
        className="card border-0 m-2"
        style={{ width: 350 }}
        cover={
          <div className={`${style.skeleton}`}>
            <div style={{ width: 350, height: 100 }} />
          </div>
        }
      >
        <h6>
          <Skeleton.Input style={{ width: 200 }} active size="small" />
        </h6>
      </Card>
    </div>
  )
}

export default SkeletonClassCard
