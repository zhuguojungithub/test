/**
 * 模块名称: 客户未成为广告主首页
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Button, Modal, message } from 'antd'
import API from '../../../../api'
import Register from './Register'
import Verify from './Verify'

import bannerClient from '../assets/banner_client.jpg'
import graphicsPreview from '../assets/graphics_preview.png'

class Simple extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            currentForm: 1,
            register: {
                name: '',
                number: ''
            },
            creating: false
        }
    }

    componentDidMount() {
        console.log('simple props ===> ', this.props)
    }

    // 验证
    onSubmitRegisterVerify = (data) => {
        console.log('onSubmitRegisterVerify ===> ', data)
        this.setState({
            creating: true
        })
        API.matchAdvertiser('post', {
            name: data.name,
            license_no: data.number
        })
        .then(result => {
            if (result.maid === 0) {
                // 匹配失败 新增
                this.setState({
                    currentForm: 2,
                    register: data,
                    creating: false
                })
                return
            }
            // 匹配成功 进入广告平台
            this.props.history.push('/admin/pocket')
        })
        .catch(err => {
            this.setState({
                creating: false
            })
        })
    }

    // 提交注册
    onSubmitRegisterAd = (data) => {
        console.log('onSubmitRegisterAd ===> ', data)

        this.setState({
            creating: true
        })

        const {register} = this.state
        API.registerAdverter('post', {
            ...data, 
            corp_name: register.name, 
            license_no: register.number
        })
        .then(result => {
            this.setState({
                creating: false,
                showModal: false
            }, () => {
                const {history, updateUserAdvert} = this.props
                updateUserAdvert()
                const succModal = Modal.success({
                    title: '提交成功',
                    content: '即将跳转到广告平台',
                    okText: '立即跳转',
                    onOk: () => {
                        clearTimeout(this.timer)
                        history.push('/admin/pocket')
                    }
                })
                this.timer = setTimeout(() => {
                    succModal.destroy()
                    history.push('/admin/pocket')
                }, 3000)
            })
        })
        .catch(err => {
            this.setState({
                creating: false
            })
        })
    }

    onRegister = () => {
        this.setState({
            showModal: true,
            currentForm: 1
        })
    }

    onHideModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const {showModal, currentForm, creating} = this.state
        
        return (
            <div className="simple-main">
                <div className="banner-wrap"><img src={bannerClient} alt="banner" onClick={this.onRegister} /></div>
                <div className="graphics-preview"><img src={graphicsPreview} alt="preview" /></div>
                <Modal title="填写公司信息"
                    visible={showModal} 
                    onCancel={this.onHideModal} 
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
                    {currentForm === 1
                        ? <Verify
                            formSubmit={this.onSubmitRegisterVerify}
                            onCancel={this.onHideModal}
                            loading={creating}
                        />
                        : <Register
                            formSubmit={this.onSubmitRegisterAd}
                            onCancel={this.onHideModal}
                            loading={creating}
                            type="new"
                        />
                    }
                </Modal>
            </div>
        )
    }
}

export default Simple