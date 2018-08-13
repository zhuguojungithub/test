import { combineReducers } from 'redux'

const user = (state={}, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, action.user)
        case 'UPDATE_MESSAGE_COUNT':
            return Object.assign({}, state, { messageCount: action.count })
        case 'UPDATE_USER_ADVERT':
            return Object.assign({}, state, { hasAdvertiser: 1 })
        case 'UPDATE_AVATAR':
            return Object.assign({}, state, { logo_url: action.data })
        case 'LOGOUT':
            return {}
        default:
            return state
    }
}

const posts = (state={
    items: []
}, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return Object.assign({}, state, { items: action.data })
        default:
            return state
    }
}

const showLoading = (state = false, action) => {
    switch (action.type) {
        case 'SHOW_LOADING':
            return true
        case 'HIDE_LOADING':
            return false
        default:
            return state
    }
}

const rootReducer = combineReducers({
    showLoading,
    user,
    posts
})

export default rootReducer