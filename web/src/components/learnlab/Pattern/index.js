import React from 'react'
import style from './style.module.scss'

const styleMap = Object.values(style).slice(1)

const Pattern = ({ patternString, children }) => {
  return (
    <div
      style={{ backgroundColor: uniqueHslColor(patternString) }}
      className={`card border-0 mb-4 ${uniquePattern(patternString)}`}
    >
      {children}
    </div>
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

function uniquePattern(str) {
  const i = str.length % styleMap.length
  return styleMap[i]
}
export default Pattern
