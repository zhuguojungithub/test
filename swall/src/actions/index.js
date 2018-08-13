const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

// 用来快速生成三种状态handle
function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}

// actin handle
function action(type, payload = {}) {
    return {type, ...payload}
}

// 生成三种状态
export const LOGIN = createRequestTypes('LOGIN')
export const REGISTER = createRequestTypes('REGISTER')

/* 
    state 尽量存放有效数据
*/

// 登陆
export const login = {
    
    // 在sagas处理请求及逻辑，不需在reducer单独处理这个REQUEST
    request: (login, from) => action(LOGIN[REQUEST], {login, from}),
    
    // 登陆成功，需要通过reducer保存用户数据
    success: user => action(LOGIN[SUCCESS], {user}),
    
    // 在sagas处理错误，不需在reducer单独处理FAILURE。（除非组件需要用到错误信息）
    // 1. 在sagas里HIDE_LOADING 2.api模块负责提示错误信息
    failure: (login, error) => action(LOGIN[FAILURE], {login, error}) 

    // 一般情况下，request和failure这是用来处理loading状态的
}

export const register = {
    request: data => action(REGISTER[REQUEST], {data}),
    success: data => action(REGISTER[SUCCESS], {data}),
    failure: err => action(REGISTER[FAILURE], {err})
}


/* -------------------------------------------------- */


export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'

export const setUsername = (data) => ({
    type: 'SET_USERNAME',
    data
})

export const updateUserAdvert = () => ({
    type: 'UPDATE_USER_ADVERT'
})

export const fatchPosts = (data) => ({
    type: 'SET_POSTS',
    data
})

export const showLoading = () => ({
    type: SHOW_LOADING
})

export const hideLoading = () => ({
    type: HIDE_LOADING
})

export const updateMsgCount = (count) => ({
    type: 'UPDATE_MESSAGE_COUNT',
    count: count
})

export const updateAvatar = (data) => ({
    type: 'UPDATE_AVATAR',
    data
})

export const onLogout = () => ({
    type: 'LOGOUT'
})