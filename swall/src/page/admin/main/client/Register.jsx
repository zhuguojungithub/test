/**
 * 模块名称: 广告主注册表单
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Form, Input, Select, Cascader, InputNumber, Upload, Icon, DatePicker} from 'antd'
import BtnGroup from '../../../../components/btnGroup'
import API from '../../../../api'
import UploadImage from '../../../../components/uploadImage'
import urls from '../../../../api/urls'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            baseData: {
                cate: [],
                province: []
            },
            tradeValues: [],
            address: '',
            imgs: null,
            errors: {
                address: ''
            }
        }
    }

    componentDidMount() {
        this.getData()
    }

    async getData() {
        const baseData = await API.getAdvertiserBaseData()
        this.setState({ baseData })
        if (this.props.type === 'edit') {
            this.initValue()
        }
    }

    async initValue() {
        const data = await API.getAdvertiserInfo(true)
        this.props.form.setFieldsValue({
            name: data.ma_corp_name,
            registCode: data.ma_corp_licence,
            city: data.ma_province,
            trade: [data.cate1, data.cate2],
            ICPNumber: data.icp_number,
            website: data.ma_corp_domain,
            permit: data.certification_image_url,
            date: [moment(data.ma_corp_licence_stime), moment(data.ma_corp_licence_etime)],
            passportFront: data.identification_front_url,
            passportBack: data.identification_back_url
        })

        const {cate} = this.state.baseData
        const cate1 = cate.find(item => item.si_id === data.cate1)
        const cate2 = cate1.child.find(item => item.si_id === data.cate2)
        
        this.setState({
            address: data.ma_corp_login_address,
            tradeValues: [cate1, cate2],
            imgs: {
                permit: data.certification_image_url,
                passportFront: data.identification_front_url,
                passportBack: data.identification_back_url
            }
        })
    }

    onSubmitRegister = (e) => {
        e.preventDefault()
        const { form, type } = this.props
        const { validateFields } = form
        validateFields((err, values) => {
            console.log('err ===> ', err)
            console.log('values ===> ', values)
            console.log('state ===> ', this.state)
            const { address, imgs } = this.state

            // 自定义校验
            if (address.trim() === '' || values.city === undefined) {
                this.setState(prevState => ({
                    errors: {...prevState.errors, address: '不能为空'}
                }))
                return
            }

            if (!err) {
                const data =  {
                    province: values.city,
                    login_address: address,
                    cate1: values.trade[0],
                    cate2: values.trade[1],
                    icp_no: values.ICPNumber,
                    site: values.website ? values.website : '',
                    license_url: values.permit,
                    license_stime: moment(values.date[0]).format('YYYY-MM-DD'),
                    license_etime:  moment(values.date[1]).format('YYYY-MM-DD'),
                    identification_front: values.passportFront,
                    identification_back: values.passportBack
                }

                if (type === 'edit') {
                    data.corp_name = values.name
                    data.license_no = values.registCode
                    if (data.license_url === imgs.permit) {
                        data.license_url = ''
                    }
                    if (data.identification_front === imgs.passportFront) {
                        data.identification_front = ''
                    }

                    if (data.identification_back === imgs.passportBack) {
                        data.identification_back = ''
                    }
                }
                this.props.formSubmit(data)
            }
        })
    }

    onChangeTrade = (value, selectedOptions) => {
        console.log(selectedOptions)
        this.setState({
            tradeValues: selectedOptions
        })
    }

    tradeDisplayRender = () => {
        return this.state.tradeValues.map(item => item.si_name).join('/')
    }

    onChangeddress = (e) => {
        const address = e.target.value     
        this.setState(prevState => ({
            address,
            errors: {...prevState.errors, address: ''}
        }))
    }

    onChangeCity = () => {
        this.setState(prevState => ({
            errors: {...prevState.errors, address: ''}
        }))
    }

    render() {
        const { form, onCancel, loading, type } = this.props
        const { getFieldDecorator } = form
        const { baseData, tradeValues, address, errors } = this.state

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        }
        
        return (
            <Form onSubmit={this.onSubmitRegister} className="register-advert-form">
                {type === 'edit' && [
                    <FormItem label="公司全称" key="name" {...formItemLayout}>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: '不能为空'
                            }, {
                                max: 50, message: '长度不能超过50个字符'
                            }]
                        })(<Input />)}
                    </FormItem>,
                    <FormItem label="营业执照注册号" key="registCode" {...formItemLayout}>
                        {getFieldDecorator('registCode', {
                            rules: [{required: true, message: '不能为空'}]
                        })(<Input />)}
                    </FormItem>
                ]}
                <FormItem label="企业注册地址"
                    {...formItemLayout}
                    validateStatus={errors.address ? 'error' : ''}
                    help={errors.address ? errors.address : ''}
                >
                    <div className="address">
                        {getFieldDecorator('city', {
                            rules: [{ required: true, message: '不能为空' }]
                        })(
                            <Select placeholder="地区" onChange={this.onChangeCity}>
                                {baseData.province.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                            </Select>
                        )}
                        <Input placeholder="详细地址" onChange={this.onChangeddress} maxLength={30} value={address} />
                    </div>
                </FormItem>
                <FormItem label="行业" {...formItemLayout}>
                    {getFieldDecorator('trade', {
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Cascader options={baseData.cate}
                            onChange={this.onChangeTrade}
                            placeholder="请选择行业"
                            displayRender={this.tradeDisplayRender}
                            filedNames={{
                                label: 'si_name',
                                value: 'si_id',
                                children: 'child'
                            }}
                        />
                    )}
                </FormItem>
                <FormItem label="ICP备案号" {...formItemLayout}>
                    {getFieldDecorator('ICPNumber', {
                        rules: [{required: true, message: '不能为空'}]
                    })(<Input type="number" />)}
                </FormItem>
                <FormItem label="企业网址" {...formItemLayout}>
                    {getFieldDecorator('website')(<Input />)}
                </FormItem>
                <FormItem label="营业执照" {...formItemLayout}>
                    {getFieldDecorator('permit', {
                        rules: [{required: true, message: '不能为空'}]
                    })(
                        <UploadImage url={urls.uploadImage} data={{size: 5}} placeholder="营业执照" />
                    )}
                </FormItem>
                <FormItem label="营业执照有效期" {...formItemLayout}>
                    {getFieldDecorator('date', {
                        rules: [{ required: true, message: '不能为空' }]
                    })(<RangePicker />)}
                </FormItem>
                <FormItem label="法人身份证" {...formItemLayout}>
                    {getFieldDecorator('passportFront', {
                        rules: [{required: true, message: '不能为空'}]
                    })(
                        <UploadImage url={urls.uploadImage} data={{size: 5}} placeholder="身份证正面" />
                    )}
                </FormItem>
                <FormItem label={<span></span>} {...formItemLayout} colon={false}>
                    {getFieldDecorator('passportBack', {
                        rules: [{required: true, message: '不能为空'}]
                    })(
                        <UploadImage url={urls.uploadImage} data={{size: 5}} placeholder="身份证反面" />
                    )}
                </FormItem>
                <BtnGroup confirmName="确定" right cancel={onCancel} loading={loading} />
            </Form>
        )
    }
}

export default Form.create()(Register)