/**
 * 登录模块
 * xuzhongyuan@372163.com
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, message, Spin } from 'antd'

const FormItem = Form.Item;

class IndexMain extends Component {

    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form

        validateFields((err, values) => {
            if (!err) {
                this.props.loginSubmit(values)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.formSubmit}>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '用户名不能为空' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码不能为空' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                </FormItem>
                <div className="login-link">
                    <Link to="/login/reset">忘记密码？</Link>
                </div>
            </Form>
        )
    }
}

export default Form.create()(IndexMain)