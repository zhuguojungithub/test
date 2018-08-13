/**
 * 模块名称: 广告主注册核查
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Form, Input } from 'antd'
import BtnGroup from '../../../../components/btnGroup'

const FormItem = Form.Item

class Verify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            number: '',
            error: {
                name: '',
                number: ''
            }
        }
    }

    componentDidMount() { }

    onSubmitRegister = (e) => {
        e.preventDefault()
        const {name, number} = this.state
        let errors = false
        if (name.trim() === '') {
            errors = true
            this.setState(prevState => ({
                error: {...prevState.error, name: '不能为空'}
            }))
        }
        
        if (number.trim() === '') {
            errors = true
            this.setState(prevState => ({
                error: {...prevState.error, number: '不能为空'}
            }))
        }

        if (!errors) {
            this.props.formSubmit({name, number})
        }
    }

    onChangeName = (e) => {
        const name = e.target.value
        this.setState(prevState => ({
            error: { ...prevState.error, name: '' }
        }))
        if (name.trim().length > 50) {
            this.setState(prevState => ({
                error: { ...prevState.error, name: '长度不得超出50个字符' }
            }))
        }
        this.setState({ name })
    }

    onChangeNumber = (e) => {
        const number = e.target.value
        this.setState(prevState => ({
            error: { ...prevState.error, number: '' }
        }))
        this.setState({ number })
    }

    render() {
        const { onCancel, loading } = this.props
        const { name, number, error } = this.state
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        }
        return (
            <Form onSubmit={this.onSubmitRegister} className="register-verify-form">
                <FormItem label="公司全称"
                    {...formItemLayout}
                    validateStatus={error.name ? 'error' : ''}
                    help={error.name}
                >
                    <Input onChange={this.onChangeName} value={name} />
                </FormItem>
                <FormItem label="营业执照注册号"
                    {...formItemLayout}
                    validateStatus={error.number ? 'error' : ''}
                    help={error.number}
                >
                    <Input onChange={this.onChangeNumber} value={number} />
                </FormItem>
                <BtnGroup confirmName="下一步" right cancel={onCancel} loading={loading} />
            </Form>
        )
    }
}

export default Verify