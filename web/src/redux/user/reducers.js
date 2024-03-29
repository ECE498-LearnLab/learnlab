import actions from './actions'

const initialState = {
  id: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  phone_number: '',
  role: '',
  email: '',
  authorized: process.env.REACT_APP_AUTHENTICATED || false, // false is default value
  loading: false,
  isInRoomSession: false,
  videoGrantToken: '',
  selectedRoom: null,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
