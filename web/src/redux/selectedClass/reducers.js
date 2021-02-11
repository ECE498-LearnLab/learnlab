import actions from './actions'

const initialState = {
  selectedClassId: '',
  selectedClassName: '',
}

export default function classReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
