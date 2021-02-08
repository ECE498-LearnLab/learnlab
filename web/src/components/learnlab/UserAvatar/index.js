import { Avatar } from 'antd'
import React from 'react'

const UserAvatar = ({ user, size }) => {
  return (
    <Avatar
      shape="circle"
      size={size}
      style={{
        color: '#fff',
        backgroundColor: uniqueHslColor(`${user.first_name} ${user.last_name}`),
      }}
    >
      {user.first_name[0].toUpperCase() ?? 'N'}
      {user.last_name[0].toUpperCase() ?? 'A'}
    </Avatar>
  )
}

// generates a unique color based on the user's id, it's the same everytime
function uniqueHslColor(str) {
  const s = 30
  const l = 60
  let hash = 0

  for (let i = 0; i < str.length; i += 1) {
    /* eslint no-bitwise: [2, { allow: ["<<"] }] */
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return `hsl(${h}, ${s}%, ${l}%)`
}

export default UserAvatar
