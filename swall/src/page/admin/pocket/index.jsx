/**
 * 模块名称: 广告平台
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../api'
import WXItem from './WXItem'
import './assets/style.scss'
import {Modal, Form, Input, message} from 'antd'
import Loading from '../../../components/loading'
import Register from '../main/client/Register'

const FormItem = Form.Item

class Pocket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            wxId: '',
            bindWxUrl: '',
            editItem: null,
            isEditWXItem: false,
            uploading: false,
            showProveModal: false,
            showSweepModal: false,
            showEditModal: false,
            errors: {
                wxId: ''
            }
        }
    }

    componentDidMount() {
        console.log('企业平台 props ===> ', this.props)
        this.getData()
    }

    async getData() {
        const { list } = await API.getPlatformList(true)
        this.setState({ list })
    }

    onClickSubmit = () => {
        this.updateWxId()
    }

    onFormSubmit = (e) => {
        e.preventDefault()
        this.updateWxId()
    }

    // 提交补充微信资料
    async updateWxId() {
        const { wxId, editItem, isEditWXItem } = this.state
        if (wxId.trim() === '') {
            this.setState(prevState => ({
                errors: {...prevState.errors, wxId: '不能为空'}
            }))
            return
        }

        this.setState({
            uploading: true
        })

        try {
            await API.updateWxId('post', {
                service_id: editItem.id,
                type: editItem.type,
                wxid: wxId
            })
            
            this.setState({
                showProveModal: false,
                uploading: false,
                wxId: ''
            }, () => {
                this.getData()
                message.success(isEditWXItem ? '修改成功' : '提交成功，请等待审核', 2)
            })
        } catch (err) {
            this.setState({
                uploading: false
            })
        }
    }

    onUpdateWXId = (data) => {
        this.setState({
            editItem: data,
            isEditWXItem: false,
            showProveModal: true
        })
    }

    onCancelUpdate = () => {
        this.setState({
            wxId: '',
            showProveModal: false,
            errors: {...this.state.errors, wxId: ''}
        })
    }

    onChangeWxId = (e) => {
        if (this.state.errors.wxId) {
            this.setState(prevState => ({
                errors: {...prevState.errors, wxId: ''}
            }))
        }
        this.setState({
            wxId: e.target.value
        })
    }
    
    // 扫码认证
    onSweepCode = (data) => {
        this.setState({
            showSweepModal: true,
            editItem: data
        })
        API.bindWx({
            service_id: data.id
        }).then(result => {
            this.setState({
                bindWxUrl: result.locationUlr
            })
        })
    }

    onCancelSweep = () => {
        this.setState({
            showSweepModal: false
        })
    }

    onFinishedBind = () => {
        // 手动更新绑定状态
        this.setState(prevState => ({
            list: prevState.list.map(item => item.id === prevState.editItem.id ? {...item, is_wx_bind: 1} : item),
            showSweepModal: false
        }), () => {
            message.success('绑定完成后，请等待审核结果', 2)
        })
    }

    onEditSource = (data) => {
        this.setState({
            showEditModal: true
        })
    }

    onCancelEditSource = () => {
        this.setState({
            showEditModal: false
        })
    }

    // 修改企业资料
    onSubmitUpdate = (data) => {
        this.setState({
            uploading: true
        })
        API.registerAdverter('post', data)
        .then(result => {
            this.setState({
                uploading: false,
                showEditModal: false
            }, () => {
               message.success('修改成功', 2, () => this.getData())
            })
        })
        .catch(err => {
            this.setState({
                uploading: false
            })
        })
    }

    // 获取微信补充资料
    onEditWXItem = (data) => {
        this.setState({
            editItem: data,
            showProveModal: true
        })
        API.getPlatformInfo({
            service_id: data.id
        }).then(res => {
            this.setState({
                wxId: res.info.mi_wxid,
                isEditWXItem: true
            })
        })
    }

    onReloadWXItem = (item) => {
        API.reloadWXItem('post', {
            service_id: item.id
        }).then(() => message.success('提交成功', 2, () => this.getData()))
    }

    render() {
        const {
            list, 
            showProveModal, 
            errors, 
            wxId, 
            showSweepModal, 
            bindWxUrl, 
            showEditModal, 
            uploading
        } = this.state

        return (
            <section className="pocket-content">
                <ul className="pocket-items">
                    {list.map(item => {
                        switch(item.type) {
                            // 朋友圈
                            case 0:
                                return <WXItem 
                                    key={item.id} 
                                    data={item} 
                                    onUpdate={() => this.onUpdateWXId(item)} 
                                    onSweepCode={() => this.onSweepCode(item)}
                                    editSource={() => this.onEditSource(item)}
                                    editItem={() => this.onEditWXItem(item)}
                                    reload={() => this.onReloadWXItem(item)}
                                />
                            default:
                                return null
                        }
                    })}
                </ul>

                {/* 微信补充资料 */}
                <Modal 
                    visible={showProveModal} 
                    destroyOnClose 
                    title="微信认证补充资质"
                    onOk={this.onClickSubmit}
                    onCancel={this.onCancelUpdate}
                    confirmLoading={uploading}
                >
                    <Form onSubmit={this.onFormSubmit}>
                        <FormItem 
                            label="微信公众号原始id"
                            help={errors.wxId && errors.wxId}
                            validateStatus={errors.wxId && 'error'}
                        >
                            <Input name="wx_id" ref="wxInp" onChange={this.onChangeWxId} value={wxId}/>
                        </FormItem>
                    </Form>
                </Modal>

                {/* 扫描二维码 */}
                <Modal 
                    visible={showSweepModal} 
                    destroyOnClose 
                    title="扫描完成二维码认证"
                    onOk={this.onFinishedBind}
                    onCancel={this.onCancelSweep}
                    okText="已完成"
                >   
                    {bindWxUrl 
                        ? <iframe frameBorder="0" width="100%" height="100%" src={bindWxUrl}></iframe>
                        : <Loading type="ellipsis" />
                    }
                </Modal>

                {/* 修改企业资料 */}
                <Modal 
                    title="修改企业资料"
                    visible={showEditModal}
                    closable={false} 
                    footer={null}
                    destroyOnClose
                    width={750}
                    className="simple-main-modal"
                    maskClosable={false}
                    bodyStyle={{
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto'
                    }}
                >   
                    <Register
                        formSubmit={this.onSubmitUpdate}
                        onCancel={this.onCancelEditSource}
                        loading={uploading}
                        type="edit"
                    />
                </Modal>
            </section>
        )
    }

}

export default Pocket