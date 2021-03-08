import { Layout } from 'antd'
import classNames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  logo: settings.logo,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  authPagesColor: settings.authPagesColor,
})

const AuthLayout = ({
  children,
  logo,
  isGrayTopbar,
  isCardShadow,
  isSquaredBorders,
  isBorderless,
  authPagesColor,
}) => {
  return (
    <Layout>
      <Layout.Content>
        <div
          className={classNames(`${style.container}`, {
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
            [style.white]: authPagesColor === 'white',
            [style.gray]: authPagesColor === 'gray',
          })}
          style={{
            backgroundImage:
              authPagesColor === 'image' ? 'url(resources/images/content/photos/7.jpg)' : '',
          }}
        >
          <div
            className={classNames(`${style.topbar}`, {
              [style.topbarGray]: isGrayTopbar,
            })}
          >
            <div className={style.logoContainer}>
              <div className={style.logo}>
                <img
                  style={{ height: 32, width: 32 }}
                  src="resources/images/logo.svg"
                  className="mr-3"
                  alt="LearnLab"
                />
                <div className={style.name}>{logo}</div>
              </div>
            </div>
            <div className="d-none d-sm-block">
              <span className="mr-2">Don&#39;t have an account?</span>
              <Link to="/auth/register" className="font-size-16 kit__utils__link">
                Sign up
              </Link>
            </div>
          </div>
          <div className={style.containerInner}>{children}</div>
          <div className="mt-auto pb-5 pt-5">
            <ul
              className={`${style.footerNav} list-unstyled d-flex mb-0 flex-wrap justify-content-center`}
            >
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
            <div className="text-center">
              Copyright © 2021 LearnLab | <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
