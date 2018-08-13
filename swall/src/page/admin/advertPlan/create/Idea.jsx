/**
 * 模块名称: 广告创意
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import urls from '../../../../api/urls'
import {getQueryStringArgs} from '../../../../tools/utils'
import { Form, Icon, Input, Button, Radio, Checkbox, Upload, Select, message, Affix, Modal } from 'antd'
import BtnGroup from '../../../../components/btnGroup'
import Preview from '../../../../components/preview'
import CreateOnlinePage from '../components/CreateOnlinePage'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { TextArea } = Input
const {Dragger} = Upload
const Option = Select.Option

class Idea extends Component {
    constructor(props) {
        super(props)
        let uid = ''
        const search = props.location.state.search
        if (search) {
            uid = getQueryStringArgs(props.location.state.search).uid
        } else if (props.uid !== undefined) {
            uid = props.uid
        }

        this.state = {
            links: [],
            checkedLink: '',
            urlList: [],
            imageUrl: '',
            loading: false,
            content: '',
            shareTitle: '',
            shareDetail: '',
            source: null,
            showCreatePage: false,
            uid
        }
    }

    componentDidMount() {
        console.log('idea props ====> ', this.props)
        if (this.state.uid !== '') {
            this.initValue()
        }
    }

    initValue = () => {
        this.getCreateIdeaData()
        this.getPageList()
        if (this.props.location.state.type === 'edit') {
            this.getIdeaData()
        }
    }

    componentDidUpdate(prevProps) {
        // console.log('<=', prevProps)
        // console.log('=>', this.props)
        if (prevProps.uid !== this.props.uid && this.props.uid !== undefined) {
            this.setState({
                uid: this.props.uid
            }, () => this.initValue())
        }
    }

    // 修改
    async getIdeaData() {
        const { planId, ideaId } = this.props.location.state
        const data = await API.getIdeaData({
            maid: this.state.uid,
            mcid: planId,
            creative_id: ideaId
        })

        this.setState({
            imageUrl: data.image_url,
            content: data.mc_title,
            shareTitle: data.mc_share_title,
            shareDetail: data.mc_share_desc,
            checkedLink: data.mc_str_link,
            source: data
        })

        this.props.form.setFieldsValue({
            content: data.mc_title,
            title: data.mc_share_title,
            detail: data.mc_share_desc,
            link: data.mc_str_link,
            url: data.mc_page_id,
            image: data.image_url
        })
    }

    // 获取基础数据
    async getCreateIdeaData () {
        const { location } = this.props
        const data = await API.getCreateIdeaData({
            maid: this.state.uid,
            mcid: location.state.planId
        }, true)
        
        this.setState({
            links: data.str_link,
            checkedLink: data.str_link[0].alias
        })
    }

    // 获取推广页
    async getPageList() {
        const data = await API.getAllRecommendPage({
            maid: this.state.uid
        })
        this.setState({
            urlList: data
        })
    }

    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form

        validateFields((err, values) => {
            console.log('err ===> ', err)
            console.log('values ===> ', values)
            console.log('state ===> ', this.state)

            if (!err) {
                const { search, planId } = this.props.location.state

                const data = {
                    maid: this.state.uid,
                    mcid: planId,
                    title: values.content,
                    str_link: values.link,
                    page_id: values.url,
                    share_title: values.title,
                    share_desc: values.detail
                }

                // 修改，同时图片没有更新传图片id
                if (typeof values.image === 'string') {
                    data.image_id = this.state.source.mc_image_id
                    data.image_url = ''
                } 
                // 新增
                else {
                    data.image_url = values.image.file.response.data.url
                }
                
                API.addAdvertIdea('post', data, true).then(() => {
                    const { history, location } = this.props
                    if (location.state.type === 'edit') {
                        history.goBack()
                    } else {
                        history.push({
                            pathname: location.state.planId,
                            state: location.state
                        })
                    }
                })
            }
        })
    }

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

    onCancelCreate = () => {
        const {history, location} = this.props
        const {type, search} = location.state
        if (type === 'edit' || type === 'new') {
            history.goBack()
            return
        }
        history.push({
            pathname: '/admin/advertPlan',
            search: search
        })
    }

    onConfirmCreate = () => {
        
    }

    onChangeContent = (e) => {
        this.setState({
            content: e.target.value
        })
    }

    onChangeLink = (e) => {
        this.setState({
            checkedLink: e.target.value
        })
    }

    onChangeShareTitle = (e) => {
        this.setState({
            shareTitle: e.target.value
        })
    }

    onChangeShareDetail = (e) => {
        this.setState({
            shareDetail: e.target.value
        })
    }

    onShowCreatePage = () => {
        this.setState({
            showCreatePage: true
        })
    }

    // 创建推广页
    createOnlinePage = (value) => {
        console.log('submit value ===> ', value)
        const {location, form} = this.props
        API.addRecommendPage('post', {
            maid: this.state.uid,
            name: value.name,
            desc: value.detail,
            url: value.url
        }, true).then(result => {
            message.success('创建成功！')
            this.setState(prevState => ({
                urlList: [{mrp_id: result.page_id, mrp_name: value.name}, ...prevState.urlList],
                showCreatePage: false
            }), () => {
                form.setFieldsValue({
                    url: result.page_id
                })
            })
        })
    }

    onCancelCreatePage = () => {
        this.setState({
            showCreatePage: false
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { 
            links, 
            urlList, 
            imageUrl, 
            loading, 
            content, 
            checkedLink, 
            shareTitle, 
            shareDetail, 
            showCreatePage, 
        } = this.state

        return (
            <section className="idea-section wrapper">
                <div className="idea-wrap">
                    <h1 className="title">广告创意</h1>
                    <Form onSubmit={this.formSubmit} layout="horizontal">

                        <FormItem label={[
                            <h4 key="content">外层文案</h4>,
                            <a key="detail" href="https://ad.weixin.qq.com/learn/n3" target="_blank">查看文案规范</a>
                        ]}>
                            <div className="share-detail">
                                {getFieldDecorator('content', {
                                    rules: [{
                                        required: true, message: '不能为空'
                                    }, {
                                        max: 40, message: '长度不能超过40个字符'
                                    }, {
                                        pattern: /^[0-9a-zA-Z\u4e00-\u9fa5-]{1,30}$/, message: '名称不得使用特殊符号'
                                    }]
                                })(
                                    <TextArea rows={4} onChange={this.onChangeContent} />
                                )}
                                <span className="review-number">{content.length}/40</span>
                            </div>
                        </FormItem>

                        <FormItem label={[
                            <h4 key="image">外层图片</h4>,
                            <a key="detail" href="http://ad.weixin.qq.com/learn/n2" target="_blank">查看图片规范</a>
                        ]}>
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
                                >
                                    <div className="upload-content">
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
                                <p>图片大小：不超过300KB，不支持GIF格式，图片中文字篇幅不超过30%</p>
                                <p>图片尺寸（四选一）：800x640像素、640x800像素、800x800像素、800x450像素</p>
                                <p>图片格式：PNG、JPG、JPEG</p>
                            </div>
                        </FormItem>

                        <FormItem label={[<h4 key="link">文字链接</h4>]}>
                            {getFieldDecorator('link', {
                                initialValue: links.length ? links[0].alias : undefined
                            })(
                                <RadioGroup onChange={this.onChangeLink}>
                                    {links.map(item => <RadioButton key={item.alias} value={item.alias}>{item.name}</RadioButton>)}
                                </RadioGroup>
                            )}
                        </FormItem>

                        <FormItem label={[<h4 key="url">落地页URL</h4>]}>
                            {getFieldDecorator('url', {
                                rules: [{ required: true, message: '不能为空' }]
                            })(
                                <Select style={{ width: 300 }} onChange={null} placeholder="请选择落地页或新增">
                                    {urlList.map(item => <Option key={item.mrp_id} value={item.mrp_id}>{item.mrp_name}</Option>)}
                                </Select>
                            )}
                            <Button type="primary" icon="plus" className="add-page" onClick={this.onShowCreatePage}>新增</Button>
                        </FormItem>

                        <FormItem label={[<h4 key="title">分享标题</h4>]}>
                            <div className="share-title">
                                {getFieldDecorator('title', {
                                    rules: [
                                        { required: true, message: '不能为空' }, 
                                        { max: 14, message: '最大长度不能超过14个字符' },
                                        { pattern: /^[0-9a-zA-Z\u4e00-\u9fa5-]{1,30}$/, message: '名称不得使用特殊符号' }
                                    ]
                                })(
                                    <Input placeholder="请输入分享标题" onChange={this.onChangeShareTitle} />
                                )}
                                <span className="review-share">{shareTitle.length}/14</span>
                            </div>
                        </FormItem>

                        <FormItem label={[<h4 key="title">分享描述</h4>]}>
                            <div className="share-detail">
                                {getFieldDecorator('detail', {
                                    rules: [
                                        { required: true, message: '不能为空' }, 
                                        { max: 20, message: '最大长度不能超过20个字符' },
                                        { pattern: /^[0-9a-zA-Z\u4e00-\u9fa5-]{1,30}$/, message: '名称不得使用特殊符号' }
                                    ]
                                })(
                                    <TextArea rows={2} onChange={this.onChangeShareDetail} />
                                )}
                                <span className="review-number">{shareDetail.length}/20</span>
                            </div>
                        </FormItem>

                        {/* <FormItem label={[<h4 key="interact">用户社交互动</h4>]}>
                            {getFieldDecorator('interact', {
                                initialValue: true
                            })(<Switch defaultChecked />)}
                        </FormItem> */}

                        <BtnGroup cancel={this.onCancelCreate} confirm={null} right />
                    </Form>
                </div>

                {/* 预览 */}
                <Affix style={{ position: 'absolute', top: 40, right: 20}}>
                    <Preview 
                        content={content}
                        imageUrl={imageUrl}
                        shareTitle={shareTitle}
                        shareDetail={shareDetail}
                        link={checkedLink && links.length ? links.find(item => item.alias === checkedLink).name : null}
                    />
                </Affix>
                <Modal
                    title={'创建推广页'}
                    visible={showCreatePage}
                    onOk={this.handleOk}
                    onCancel={this.onCancelCreatePage}
                    footer={null}
                    destroyOnClose
                >
                    <CreateOnlinePage onSubmit={this.createOnlinePage} onCancel={this.onCancelCreatePage} />
                </Modal>
            </section>
        )
    }

}

export default Form.create()(Idea)