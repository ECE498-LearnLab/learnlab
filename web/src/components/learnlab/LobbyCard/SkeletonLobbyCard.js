import { Skeleton } from 'antd'
import React from 'react'
import style from './style.module.scss'

const SkeletonLobbyCard = () => {
  return (
    <div>
      <div className="cui__utils__heading">
        <h3>
          <Skeleton.Input style={{ width: 250 }} active size="small" />
        </h3>
      </div>
      <div className="row">
        {[...Array(5).keys()].map(key => {
          return (
            <div key={key} className="col-md-4">
              <div className="card">
                <div className={`${style.container} pt-3`}>
                  <div className={`${style.status} ${style.skeleton}`} />
                  <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
                    <div className="mr-auto">
                      <h3>
                        <Skeleton.Input style={{ width: 150 }} active />
                      </h3>
                      <h5>
                        <small>
                          <Skeleton.Input style={{ width: 200 }} active size="large" />
                        </small>
                      </h5>
                    </div>
                    <div className="ml-2">
                      <Skeleton.Input style={{ width: 100 }} active />
                    </div>
                  </div>
                  <div className={`${style.footer} py-3 pl-4`}>
                    <Skeleton.Avatar active size="small" shape="circle" />
                    <div className="ml-1">
                      <Skeleton.Input style={{ width: 100 }} active size="small" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SkeletonLobbyCard
