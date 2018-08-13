/**
 * 模块名称: 创建推广页
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Form, Input} from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import BtnGroup from '../../../../components/btnGroup'

const { TextArea } = Input

class CreateOnlinePage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        console.log(this.props)
        const {data, form} = this.props
        if (data) {
            form.setFieldsValue({
                name: data.mrp_name,
                detail: data.mrp_desc,
                url: data.mrp_url
            })
        }
    }

    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            console.log('err ===> ', err)
            console.log('values ===> ', values)
            if (!err) {
                this.props.onSubmit(values)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        }
        return (
            <Form onSubmit={this.formSubmit}>
                <FormItem label="名称" {...formItemLayout}>
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '不能为空'
                        }, {
                            max: 10, message: '长度不能超过10个字符'
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="描述" {...formItemLayout}>
                    {getFieldDecorator('detail', {
                        rules: [{
                            required: true, message: '不能为空'
                        }, {
                            max: 40, message: '长度不能超过40个字符'
                        }]
                    })(
                        <TextArea rows={4} />
                    )}
                </FormItem>
                <FormItem label="地址" {...formItemLayout}>
                    {getFieldDecorator('url', {
                        rules: [{
                            required: true, message: '不能为空'
                        }, {
                            max: 255, message: '长度不能超过255个字符'
                        }]
                    })(
                        <Input placeholder="请输入完整的url" />
                    )}
                </FormItem>
                <BtnGroup cancel={this.props.onCancel} confirm={null} right loading={this.props.loading} />
            </Form>
        )
    }

}

export default Form.create()(CreateOnlinePage)