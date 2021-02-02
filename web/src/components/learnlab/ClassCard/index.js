import { Card } from 'antd'
import Pattern from 'components/learnlab/Pattern'
import React from 'react'

const ClassCard = ({ classroom, setSelectedClass }) => {
  return (
    <div key={classroom.id} className="col-md-4">
      <Card
        hoverable
        className="card border-0 m-2"
        style={{ width: 350 }}
        onClick={() => {
          setSelectedClass(classroom)
        }}
        cover={
          <Pattern patternString={classroom.name}>
            <div style={{ width: 350, height: 100 }} />
          </Pattern>
        }
      >
        <h6>{classroom.name}</h6>
      </Card>
    </div>
  )
}

export default ClassCard
