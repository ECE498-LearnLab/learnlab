import { Button, Form, Input, Radio } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'

const mapStateToProps = ({ user, dispatch }) => ({ user, dispatch })

const Register = ({ dispatch, user }) => {
  const onFinish = values => {
    dispatch({
      type: 'user/REGISTER',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className={`card card shadow-sm p-3 mb-5 bg-white rounded ${style.container}`}>
        <div className="mb-4">
          <strong className="text-dark font-size-24">Create your account</strong>
          <span className="text-dark font-size-24" role="img" aria-label="smiling face">
            {' '}
            😊{' '}
          </span>
          <div>
            <span className="mr-1">By signing up, you agree to the</span>
            <a href="#" onClick={e => e.preventDefault()} className="kit__utils__link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" onClick={e => e.preventDefault()} className="kit__utils__link">
              Privacy Policy
            </a>
          </div>
        </div>
        <Form
          layout="vertical"
          requiredMark="optional"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="role"
            label="I am a..."
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Radio.Group>
              <Radio.Button value="STUDENT">Student</Radio.Button>
              <Radio.Button value="INSTRUCTOR">Instructor</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: 'Please input your first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: 'Please input your last name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'The input is not a valid email',
              },
              {
                required: true,
                message: 'Please input your email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  // eslint-disable-next-line
                  return Promise.reject('Passwords do not match')
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="text-center w-100"
            loading={user.loading}
          >
            <strong>Sign up</strong>
          </Button>
        </Form>
        <div className="text-center pt-2 mb-auto">
          <span className="mr-2">Already have an account?</span>
          <Link to="/auth/login" className="kit__utils__link font-size-16">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Register)
