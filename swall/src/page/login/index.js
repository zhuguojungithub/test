/**
 * 登录注册模块
 * xuzhongyuan@372163.com
 */

import React, { Component } from 'react'
import { Link, NavLink, Route } from 'react-router-dom'
import { message, Modal } from 'antd'
import './assets/style.scss'
import api from '../../api'
import Logo from '../../assets/logo.png'
import Main from './Main'
import Register from './Register'
import Additive from '../../page/admin/personal/Edit'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        const { location } = this.props
        if (location.state && location.state.from) {
            message.warning('请登录后再访问！')
        }
    }

    // 登陆提交
    loginSubmit = (values) => {
        const {requestLogin, location} = this.props
        const state = location.state
        requestLogin(values, state ? state.from : {pathname: '/admin'})
    }

    // 注册提交
    registerSubmit = (values) => {
        console.log('registerSubmit', values)
        this.props.requestRegister(values)
    }

    // 忘记密码提交
    forgetSubmit = (values) => {
        const data = {
            mobile: values.mobile,
            send: values.send,
            password: values.password,
            code: values.securityCode,
            update: 1
        }
        this.props.requestRegister(data)
    }

    // 提交补充资料
    onSubmitAdditive = (values) => {
        api.updateUserinfo('post', {
            name: values.name,
            mail: values.email,
            phone: values.phone,
            qq: values.qq,
            address: values.address,
            corp_name: values.company,
            post: values.position,
            logo: values.avatar
        }, true).then(() => {
            message.success('保存成功，即将跳转到后台', 2, () => this.props.history.push('/admin'))
        })
    }

    // 取消补充资料
    onCancelAdditive = () => {
        this.props.history.push('/admin')
    }
    
    render() {
        const {location} = this.props
        return (
            <div className="login-wrap">
                <div className="login-header">
                    <div className="logo-wrap">
                        <Link to="/"><img src={Logo} alt="logo" /></Link>
                    </div>
                    <h1>全时系统</h1>
                    <p>朋友圈广告投放快捷通道</p>
                </div>
                <div className="login-nav">
                    {location.pathname === '/login/reset'
                    ? <h2 className="password-title">忘记密码</h2> 
                    : <nav className="nav-list">
                        <NavLink exact activeClassName="active-link" to="/login">登录</NavLink>
                        <NavLink activeClassName="active-link" to="/login/register">注册</NavLink>
                    </nav>}
                </div>
                <div className="loging-content" id="formLogin">
                    {/* 登陆 */}
                    <Route exact path={this.props.match.url} render={props => <Main
                        {...props}
                        loginSubmit={this.loginSubmit}
                    />} />

                    {/* 注册 */}
                    <Route path={`${this.props.match.url}/register`} render={props => <Register
                        {...props}
                        api={api}
                        button="注册"
                        formSubmit={this.registerSubmit}
                    />} />
                    
                    {/* 补充资料 */}
                    <Route path={`${this.props.match.url}/additive`} render={props => <Modal 
                        title="补充资料"
                        visible={true}
                        footer={null}
                        closable={false}
                    >
                        <Additive onCancel={this.onCancelAdditive} onConfirm={this.onSubmitAdditive} />
                    </Modal>} />

                    {/* 忘记密码 */}
                    <Route path={`${this.props.match.url}/reset`} render={props => <Register
                        {...props}
                        api={api}
                        button="确认修改密码"
                        formSubmit={this.forgetSubmit}
                    />} />
                    
                </div>
            </div>
        )
    }
}

export default Login