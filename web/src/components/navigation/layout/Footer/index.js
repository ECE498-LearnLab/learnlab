import React from 'react'
import { Link } from 'react-router-dom'
import style from './style.module.scss'

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <a href="" target="_blank" rel="noopener noreferrer" className={style.logo}>
          LearnLab
          <span />
        </a>
        <br />
        <p className="mb-0">
          Copyright © 2021| <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default Footer
