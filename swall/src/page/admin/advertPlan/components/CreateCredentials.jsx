/**
 * 模块名称: 新增资质
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Form, Input, Radio, Icon, Upload, message, DatePicker} from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import BtnGroup from '../../../../components/btnGroup'
import urls from '../../../../api/urls'
import moment from 'moment'


const { Dragger } = Upload
const RadioGroup = Radio.Group
const { TextArea } = Input

class CreateCredentials extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            imageUrl: '',
            expiredDate: '',
            expiredType: 0
        }
    }

    componentDidMount() {}

    onChangeUpload = (info) => {
        const {status, response} = info.file
        if (info.file.status === 'uploading') {
            this.setState({ 
                loading: true,
                imageUrl: ''
            })
            return
        }
        if (status === 'done') {
            if (response.code === 0) {
                this.setState({
                    imageUrl: response.data.url,
                    loading: false
                })
            } else {
                this.setState({
                    loading: false
                })
                message.error(response.msg || '服务器发生错误')
            }
        }
        else if (status === 'error') {
            this.setState({
                loading: false
            })
            message.error(`图片上传失败`)
        }
    }

    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields, setFields } = this.props.form

        validateFields((err, values) => {
            console.log('err ===> ', err)
            console.log('values ===> ', values)
            console.log('state ===> ', this.state)

            if (values.expired === 1) {
                const {expiredDate} = this.state
                if (expiredDate) {
                    values.expired = moment(this.state.expiredDate).format('YYYY-MM-DD')
                } else {
                    setFields({expired: {
                        value: values.expired,
                        errors: [new Error('请选择日期')]
                    }})
                    return
                }
            } else {
                values.expired = ''
            }

            if (!err) {
                values.image = values.image.file.response.data.url
                this.props.formSubmit(values)
            }
        })
    }

    onChangeExpired = (e) =>{
        this.setState({
            expiredType: e.target.value
        })
    }

    onChangePicker = (date, dateString) => {
        this.setState({expiredDate: date})

        const {setFields, getFieldValue} = this.props.form
        setFields({expired: {
            value: getFieldValue('expired'),
            errors: null
        }})
    }

    onDisabledDate = (current) => {
        return current && (current < moment().endOf('day'))
    }

    render() {
        const {loading, imageUrl, expiredType} = this.state
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }
        return (
            <Form onSubmit={this.formSubmit}>
                <FormItem label="资质名称" {...formItemLayout}>
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '不能为空'
                        }, {
                            max: 30, message: '长度不能超过30个字符'
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="类型" {...formItemLayout}>
                    {getFieldDecorator('type', {
                        initialValue: 0
                    })(
                        <RadioGroup>
                            <Radio value={0}>行业资质</Radio>
                            <Radio value={1}>投放资质</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="有效期" {...formItemLayout}>
                    {getFieldDecorator('expired', {
                        initialValue: 0
                    })(
                        <RadioGroup onChange={this.onChangeExpired}>
                            <Radio value={0}>永久有效</Radio>
                            <Radio value={1}>截至日期</Radio>
                        </RadioGroup>
                    )}
                    {expiredType === 1 && <DatePicker onChange={this.onChangePicker} disabledDate={this.onDisabledDate} />}
                </FormItem>
                <FormItem label="证件照" {...formItemLayout}>
                    {getFieldDecorator('image', {
                        rules: [{
                            required: true, message: '不能为空'
                        }]
                    })(
                        <Dragger
                            name="file"
                            action={`${urls.uploadImage}?token=${sessionStorage.getItem('token')}`}
                            onChange={this.onChangeUpload}
                            withCredentials={true}
                            showUploadList={false}
                            data={{size: 5}}
                        >
                            <div className="credentials-upload-content">
                                {imageUrl
                                    ? <img src={`/web/${imageUrl}`} alt="iamge" />
                                    : <Fragment>
                                        <Icon type={loading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">上传图片</div>
                                    </Fragment>}
                            </div>
                        </Dragger>
                    )}
                    <div className="image-required">
                        <p>图片不超过5M，不支持GIF格式</p>
                    </div>
                </FormItem>
                <BtnGroup cancel={this.props.onCancel} confirm={null} right loading={this.props.loading} />
            </Form>
        )
    }

}

export default Form.create()(CreateCredentials)