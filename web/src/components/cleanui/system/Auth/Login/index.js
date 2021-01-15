import { Button, Form, Input } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'

const mapStateToProps = ({ user, dispatch }) => ({
  dispatch,
  user,
})

const Login = ({ dispatch, user }) => {
  const onFinish = values => {
    dispatch({
      type: 'user/LOGIN',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${style.container}`}>
        <div className="text-center mb-4">
          <h1 className="px-3">
            <strong>Welcome back!</strong>
            <span role="img" aria-label="waving hand">
              {' '}
              👋{' '}
            </span>
          </h1>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your e-mail address' }]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            className="text-center w-100"
            htmlType="submit"
            loading={user.loading}
          >
            <strong>Sign in</strong>
          </Button>
        </Form>
        <div className="text-center pt-2 mb-auto">
          <span className="mr-2">Don&#39;t have an account?</span>
          <Link to="/auth/register" className="kit__utils__link font-size-16">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Login)
