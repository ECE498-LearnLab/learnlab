import { notification } from 'antd'
import { history } from 'index'
import { all, call, put, putResolve, takeEvery } from 'redux-saga/effects'
import * as firebase from 'services/firebase'
import actions from './actions'

export function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(firebase.login, email, password)
  if (success) {
    yield putResolve({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    const user = yield call(firebase.currentAccount)
    if (user.id !== '' && user.id != null) {
      yield history.push('/')
      notification.success({
        message: 'Logged In',
        description: 'You have successfully logged in!',
      })
    } else {
      notification.error({
        message: 'User not found',
        description: 'User was not found in the database.',
      })
    }
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* REGISTER({ payload }) {
  const { role, first_name, last_name, email, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(firebase.register, role, first_name, last_name, email, password)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    yield history.push('/')
    notification.success({
      message: 'Succesful Registered',
      description: 'You have successfully registered!',
    })
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(firebase.currentAccount)
  if (response != null && response.id != null) {
    const { id, email, first_name, last_name, middle_name, phone_number, role } = response
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id,
        first_name,
        last_name,
        middle_name,
        phone_number,
        email,
        role,
        authorized: true,
        isInRoomSession: false,
        videoGrantToken: '',
        selectedRoom: null,
      },
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    yield put({
      type: 'user/LOGOUT',
    })
  }
}

export function* LOGOUT() {
  yield call(firebase.logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      phone_number: '',
      role: '',
      email: '',
      authorized: false,
      loading: false,
      isInRoomSession: false,
      videoGrantToken: '',
      selectedRoom: null,
    },
  })
  yield put({
    type: 'selectedClass/SET_STATE',
    payload: {
      classId: '',
      className: '',
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
