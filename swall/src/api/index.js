/**
 * @file api list
 * @author 徐忠元
 */

// 调用
/* GET请求: 
 * 1. api.suitList() // 不带任何参数的请求
 * 2. api.suitList(true) //开启全局loading的请求
 * 3. api.suitList({name: 'xuzhongyuan'}, true) // 带参数 带loading
 * 
 * POST请求: 
 * api.suitList('post', {name: 'xuzhongyuan', age: 28}, true) 
 */

import { message } from 'antd'
import { eventChannel, END } from 'redux-saga'
import urls from './urls'

const API = {}

// 用来获取向saga抛事件能力
let sagaEmitter

for (let k in urls) {
    API[k] = (type, query, isLoading) => {
        if (typeof type === 'string') {
            return fetchHandle(urls[k], type, query, isLoading)
        // git请求，没有任何参数，可能有loading
        } else if (typeof type === 'boolean') {
            return fetchHandle(urls[k], 'GET', null, type)
        }
        // get请求
        return fetchHandle(urls[k], 'GET', type, query)
    }
}

const fetchHandle = (url, type, query, isLoading) => {
    const config = {
        method: type ? type : 'GET',
        credentials: 'include'
    }

    if (type.toUpperCase() === 'POST') {
        // 以后支持json格式了，这个地方需要改
        const formData = new FormData()
        for (let v in query) {
            let value
            switch(typeof query[v]) {
                case 'object':
                    value = JSON.stringify(query[v])
                    break
                case 'undefined':
                    value = ''
                    break
                default:
                    value = query[v]
            }
            formData.append(v, value)
        }
        config.body = formData
    } else if (query) {
        url += url.indexOf('?') === -1 ? '?' : '&'
        for (let k in query) {
            url += `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}&`
        }
        url = url.slice(0, -1)
    }

    // 添加token
    const token = sessionStorage.getItem('token')
    if (token) {
        url += url.indexOf('?') === -1 ? '?' : '&'
        url += `token=${token}`
    }

    // 全局loading
    // const startLoading = isLoading ? message.loading('加载中...', 0) : null
    isLoading && sagaEmitter('SHOW_LOADING')

    return fetch(url, config)
        .then(response  => response.json())
        .then(result => {
            // startLoading && startLoading()
            isLoading && sagaEmitter('HIDE_LOADING')
            if (+result.code === 0) {
                return result.data || result.msg
            }
            return Promise.reject(result)
        })
        .catch(err => {
            // startLoading && startLoading()
            isLoading && sagaEmitter('HIDE_LOADING')
            console.error('fetch error: ', err)
            if (err.code === 1001) {
                sessionStorage.removeItem('token')
            }
            message.error(err.msg || '请求发生错误，请稍后重试', 3)
            return Promise.reject(err || { msg: '请求发生错误，请稍后重试' })
        })
}

export const sagaEmitterChannel = () => {
    return eventChannel(emitter => {
        // 将emitter暴露出去
        sagaEmitter = emitter
        return () => {}
    })
}

export default API