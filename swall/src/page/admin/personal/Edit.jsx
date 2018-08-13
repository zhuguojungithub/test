/**
 * 模块名称: 个人信息编辑
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Form, Input, Select } from 'antd'
import BtnGroup from '../../../components/btnGroup'
import API from '../../../api'
import UploadImage from '../../../components/uploadImage'
import urls from '../../../api/urls'

const FormItem = Form.Item
const Option = Select.Option

class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            positionData: []
        }
    }

    componentDidMount() {
        const { data, positionData } = this.props
        console.log('edit props ==> ', this.props)

        // 修改
        if (data) {
            this.initValue(data, positionData)
        } 
        // 新增
        else {
            this.getData()
        }
    }

    async getData() {
        const { post } = await API.getUserDetails(true)
        this.setState({
            positionData: post
        })
    }

    initValue = (data, position) => {
        this.setState({
            positionData: position
        }, () => {
            this.props.form.setFieldsValue({
                avatar: data.logo_url,
                name: data.mui_name,
                email: data.mui_email,
                phone: data.mui_phone,
                qq: data.mui_qq,
                address: data.mui_address,
                company: data.mui_corp_name,
                position: data.mui_post
            })
        })
    }

    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form

        validateFields((err, values) => {
            console.log('err ===> ', err)
            console.log('values ===> ', values)

            if(!err) {
                this.props.onConfirm(values)
            } 
        })
    }

    render() {
        const { form, onCancel } = this.props
        const { getFieldDecorator } = form
        const { positionData } = this.state
        const isEdit = !!this.props.data

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
        }

        return (
            <Form onSubmit={this.formSubmit}>
                <FormItem label="头像" {...formItemLayout}>
                    {getFieldDecorator('avatar', {
                        rules: [{required: true, message: '不能为空'}]
                    })(
                        <UploadImage url={urls.uploadImage} data={{size: 5}} placeholder="上传头像" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="姓名">
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '不能为空'
                        }, {
                            max: 10, message: '不得超过10个字符'
                        }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="邮箱">
                    {getFieldDecorator('email', {
                        rules: [{
                            pattern: /\w+@\w+/, message: '邮箱格式错误'
                        }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="座机">
                    {getFieldDecorator('phone', {
                        rules: [{
                            pattern: /^\d{11}$/, message: '只能输入11位数字'
                        }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="QQ">
                    {getFieldDecorator('qq', {
                        rules: [{
                            pattern: /^\d{1,12}$/, message: '只能输入12位以内的数字'
                        }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人地址">
                    {getFieldDecorator('address', {
                        rules: [{
                            max: 100, message: '不得超过100个字符'
                        }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="公司">
                    {getFieldDecorator('company', {
                        rules: [{
                            max: 50, message: '不得超过50个字符'
                        }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="职位">
                    {getFieldDecorator('position')(
                        <Select placeholder="选择职位">
                            {positionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                        </Select>
                    )}
                </FormItem>
                <BtnGroup cancel={onCancel} cancelName={isEdit?'取消':'跳过'} confirmName="保存" />
            </Form>
        )
    }

}

export default Form.create()(Edit)