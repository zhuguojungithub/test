/**
 * 注册/修改密码
 * xuzhongyuan@372163.com
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, message, Spin, notification } from 'antd'
import loading from '../../assets/images/loading-ripple.gif'

const FormItem = Form.Item;

class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: null,
            seconds: 0,
            isReset: props.location.pathname === '/login/reset'
        }
    }

    componentDidMount() {
        this.getCode()
    }

    componentDidUpdate() {
        if (this.state.seconds === 0) {
            clearInterval(this.interval)
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    async getCode() {
        const code = await this.props.api.getCode()
        this.setState({ code })
    }

    onGetMCode() {
        const { validateFields } = this.props.form

        validateFields([
            'mobile',
            'password',
            'securityCode'
        ], (err, values) => {
            if (!err) {
                this.getMCode(values)
            }
        })
    }

    getMCode(values) {
        const { code, isReset } = this.state
        this.props.api.getMCode('post', {
            mobile: values.mobile,
            code: values.securityCode,
            code_key: code.img_key,
            update: isReset ? 1 : 0 //1修改， 0注册
        })
        .then(result => {
            if (!result) {
                return Promise.reject({msg: '服务器发生错误'})
            }
            message.success('短信发送成功，请注意查收')
            this.setState(prveState => ({
                seconds: 120
            }), () => {
                this.interval = setInterval(() => this.tick(), 1000)
            })
        })
        .catch(err => {
            this.getCode()
            console.log('err', err)
            return err
        })
    }

    tick = () => {
        this.setState(prevState => ({
            seconds: prevState.seconds - 1
        }))
    }

    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form

        validateFields((err, values) => {
            if (!err) {
                this.props.formSubmit(values)
            }
        })
    }

    render() {
        const { form, button } = this.props
        const { getFieldDecorator } = form
        const { code, seconds, isReset } = this.state

        return (
            <Form onSubmit={this.formSubmit}>
                <FormItem>
                    {getFieldDecorator('mobile', {
                        rules: [{
                            required: true, message: '手机号码不能为空' 
                        },{
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号码格式不正确'
                        }],
                    })(
                        <Input placeholder="手机号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '密码不能为空' 
                        }, {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{7,30}$/, message: '密码须同时含大、小写字母和数字，长度7~30位'
                        }],
                    })(
                        <Input type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem className="security-code">
                    {getFieldDecorator('securityCode', {
                        rules: [{ required: true, message: '图形验证码不能为空' }],
                    })(
                        <Input placeholder="图形验证码" />
                    )}
                    <div className="code-wrap">
                        <img src={code ? code.img_code : loading} alt="图形验证码" onClick={() => this.getCode()} title="看不清？点击更换" />
                    </div>
                </FormItem>
                <FormItem className="mobile-code">
                    {getFieldDecorator('send', {
                        rules: [{ required: true, message: '手机验证码不能为空' }],
                    })(
                        <Input placeholder="手机验证码" />
                    )}
                    {seconds ? <a href="javascript:;" className="watch-time">{seconds}</a>
                        : <a href="javascript:;" className="mobile-code" onClick={() => this.onGetMCode()}>获取验证码</a>
                    }
                </FormItem>
                <FormItem className={isReset?'reset-btn':''}>
                    <Button type="primary" htmlType="submit" className="login-form-button">{button}</Button>
                </FormItem>
                {isReset && <div className="login-link"><Link to="/login">登录</Link></div>}
            </Form>
        )
    }
}

export default Form.create()(Register)