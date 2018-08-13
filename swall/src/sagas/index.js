/**
 * api接口会帮我们直接处理部分错误的提示
 * 请求：只有当data为0时，才算是成功的请求，其他都视为catch
 */



/* eslint-disable no-constant-condition */

import { take, takeEvery, put, call, fork, all, select, throttle, cancelled } from 'redux-saga/effects'
import { message } from 'antd'
import * as actions from '../actions'
import API from '../api'
import { sagaEmitterChannel } from '../api'

// action 常量
const { LOGIN, REGISTER } = actions

let history;


/****************************** 处理程序 ******************************/

/* export function fetchPostsApi(url) {
    console.log('fetchPostsApi')
    return fetch(url)
        .then(response => response.json())
        .then(result => ({result}))
        .catch(error => ({error}))
} */

/* export function* fetchPosts() {
    console.log('fetchPosts')
    const {result, error} = yield call(fetchPostsApi, '/api/initialization')
    if (result.status === 200) {
        yield put(actions.fatchPosts(result.articles.items))
    } else {
        yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
    }
} */

/* export function* initPosts() {
    // console.log('initPosts')
    yield takeEvery('FATCH_POSTS', fetchPosts)
} */

// 登录逻辑
function* loginRequest({login, from}) {
    try {
        const result = yield call(API.login, 'post', login, true)
        // 当code为0的时候才会执行下列代码
        yield sessionStorage.setItem('token', result.token)
        // yield put(actions.login.success(result))
        yield history.push(from.pathname)
    } catch (err) {
        // 当请求被reject的时候，会直接进入catch
        yield put(actions.login.failure(err))
    } finally {
        // 当请求被取消的时候，会进入finally
        if (yield cancelled()) {
            console.log('cancel')
        }
    }
}

// 注册
function* registerRequest(data) {
    try {
        const result = yield call(API.register, 'post', data, true)
        // 登陆
        if (data.update) {//0 注册 1修改密码
            message.success('修改成功')
            yield history.push('/login')
        }
        else {
            yield loginRequest({
                login: {
                    username: data.mobile,
                    password: data.password
                },
                from: { pathname: '/login/additive' }
            })
        }
    } catch (err) {

    }
}

/****************************** 监听 ******************************/

// function* watchSuitList() {
//     yield take('FETCH_SUIT_LIST')
//     console.log('watchSuitList')
//     // const suitList = yield call(API.suitList)
//     // console.log('suitList', suitList)
// }

// 获取路由对象history
function* watchHistory() {
    const router = yield take('SET_HISTORY')
    history = router.history
}

// 监听外部事件
export function* watchWithout() {
    const chan = yield call(sagaEmitterChannel)
    try {
        while (true) {
            let type = yield take(chan)
            if (type === 'SHOW_LOADING') {
                yield put(actions.showLoading())
            } else if (type === 'HIDE_LOADING') {
                yield put(actions.hideLoading())
            }
            // console.log(`type: ${type}`)
        }
    } finally {
        if (yield cancelled()) {
            chan.close()
            console.log('sagaEmitterChannel cancelled')
        }
    }
}

// 登录
function* watchLogin() {
    yield throttle(2000, LOGIN.REQUEST, loginRequest)
}

// 注册
export function* watchRegister() {
    while(true) { // 如果不使用while循环 只会监听一次
        const {data} = yield take(REGISTER.REQUEST)
        console.log('sage-REGISTER', data)
        yield fork(registerRequest, data)
    }
}

export default function* root() {
    yield all([
        // initPosts(),
        // watchSuitList(),
        watchLogin(),
        watchHistory(),
        watchWithout(),
        watchRegister()
    ])
}