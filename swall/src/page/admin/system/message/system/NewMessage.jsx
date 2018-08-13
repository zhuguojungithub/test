/**
 * 模块名称: 发送消息
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import BtnGrounp from '../../../../../components/btnGroup'
import {Form, Input, Radio, Checkbox, DatePicker } from 'antd'
import API from '../../../../../api'
import moment from 'moment'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input

class NewMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetList: [],
            isCheckedAllTarget: false,
            showDatePicker: false,
            sendDate: ''
        }
    }

    componentDidMount() {
        const { data, form } = this.props

        if (data) {
            form.setFieldsValue({
                name: data.mmt_title,
                body: data.mmt_content
            })
        } else {
            this.getTargetList()
        }
    }

    async getTargetList() {
        const data = await API.getMsgUserGroup()
        this.setState({
            targetList: data.scopes.map(item => ({value: item.id, label: item.name}))
        })
    }

    onChangeTarget = (values) => {
        this.setState(prevState => ({
            isCheckedAllTarget: prevState.targetList.length === values.length
        }))
    }

    onChangeAllTarget = (e) => {
        const checked = e.target.checked
        const { targetList } = this.state
        const { setFieldsValue } = this.props.form
        if (checked) {
            setFieldsValue({
                target: targetList.map(item => item.value)
            })
            this.setState({
                isCheckedAllTarget: true
            })
        } else {
            setFieldsValue({
                target: []
            })
            this.setState({
                isCheckedAllTarget: false
            })
        }
    }

    formSubmit = (e) => {
        e.preventDefault()
        const {validateFields, setFields} = this.props.form
        validateFields((err, values) => {
            console.log('submit err ===> ', err)
            console.log('submit values ===> ', values)

            const { sendDate } = this.state
            if (values.date === '2' && sendDate === '') {
                setFields({date: {
                    value: values.date,
                    errors: [new Error('请选择日期和时间')]
                }})
                return
            }
            if (!err) {
                values.date = sendDate
                this.props.onCommit(values)
            }
        })
    }

    onChangeDate = (value, data) => {
        this.setState({
            sendDate: data
        })
        const { setFields, getFieldValue } = this.props.form
        setFields({
            date: {
                value: getFieldValue('date'),
                errors: null
            }
        })
    }

    onChangeDateRadio = (e) => {
        if (e.target.value === '2') {
            this.setState({
                showDatePicker: true
            })
        } else {
            this.setState({
                showDatePicker: false,
                sendDate: ''
            })
        }
    }

    render() {
        const { form, cancel, data } = this.props
        const { getFieldDecorator } = form
        const { targetList, isCheckedAllTarget, showDatePicker } = this.state

        return (
            <section>
                <Form onSubmit={this.formSubmit}>
                    <FormItem label="消息标题">
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: '不能为空'
                            }, {
                                max: 30, message: '不得超过30个字符'
                            }, {
                                pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,30}$/, message: '不得使用特殊符号'
                            }]
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="消息正文">
                        {getFieldDecorator('body', {
                            rules: [{
                                required: true, message: '不能为空'
                            }, {
                                max: 300, message: '不得超过300个字符'
                            }]
                        })(<TextArea />)}
                    </FormItem>
                    {!data && <FormItem label="发送对象">
                        <Checkbox
                            key="checkbox"
                            checked={isCheckedAllTarget}
                            onChange={this.onChangeAllTarget}
                        >
                            全选
                        </Checkbox>
                        {getFieldDecorator('target', {
                            rules: [{
                                required: true, message: '不能为空'
                            }],
                            initialValue: []
                        })(
                            <CheckboxGroup
                                options={targetList}
                                onChange={this.onChangeTarget}
                            />
                        )}
                    </FormItem>}
                    {!data && <FormItem label="发送时间">
                        {getFieldDecorator('date', {
                            rules: [{
                                required: true, message: '不能为空'
                            }]
                        })(
                            <RadioGroup onChange={this.onChangeDateRadio}>
                                <Radio value="1">立即发送</Radio>
                                <Radio value="2">定时发送</Radio>
                            </RadioGroup>
                        )}
                        {showDatePicker && <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="选择日期和时间"
                            onChange={this.onChangeDate}
                            disabledDate={current => current && current < moment().endOf('day')}
                        />}
                    </FormItem>}
                    <BtnGrounp right cancel={cancel} />
                </Form>
            </section>
        )
    }
}

export default Form.create()(NewMsg)