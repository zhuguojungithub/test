/**
 * 模块名称: 落地页管理 (客户端和运营端共用)
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Button, Table, Popconfirm, Icon, Popover, message, Modal} from 'antd'
import API from '../../../../api'
import {getQueryStringArgs} from '../../../../tools/utils'
import CreateOnlinePage from '../components/CreateOnlinePage'
import './style.scss'

const {Column} = Table

class Models extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            count: 0,
            loading: false,
            creating: false,
            uid: getQueryStringArgs(this.props.location.search).uid,
            showCreatePage: false,
            showReviewPage: false,
            currentPage: 1,
            editItem: null,
            reviewPage: '' //http://viewer.maka.im/k/T_DJNY44FL?mode=storeTemplate&TempAdmode=true
        }
    }

    componentDidMount() {
        this.getList()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.uid !== prevState.uid && nextProps.uid !== undefined) {
            return { uid: nextProps.uid }
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.uid !== this.state.uid) {
            this.getList()
        }
    }

    async getList() {
        const { uid, currentPage } = this.state
        if (uid === undefined) return
        this.setState({loading: true})
        const data = await API.getRecommendPage({
            maid: uid,
            page: currentPage
        })
        this.setState({
            items: data.list,
            count: data.count,
            loading: false
        })
    }

    onChangeTabal = (pagination) => {
        this.setState(prevState => ({
            currentPage: pagination.current
        }), () => this.getList())
    }

    onEditItem = (id) => {
        this.setState(prevState => ({
            editItem: prevState.items.find(item => item.mrp_id === id),
            showCreatePage: true
        }))
    }
    
    async onRemoveItem(id) {
        await API.delRecommendPage('post', {maid: this.state.uid, mrp_id: id})
        message.success('删除成功', 2)
        this.getList()
    }

    onHoverItem = (id) => {
        const item = this.state.items.find(item => item.mrp_id === id)
        return <div><img width="100" height="100" src={item.qrcode} /></div>
    }

    // 落地页预览
    onReviewItem = (id) => {
        this.setState(prevState => ({
            showReviewPage: true,
            reviewPage: prevState.items.find(item => item.mrp_id === id).mrp_url
        }))
    }

    onHideReview = () => {
        this.setState({
            showReviewPage: false
        })
    }

    onShowCreatePage = () => {
        this.setState({
            showCreatePage: true,
            editItem: null
        })
    }

    // 创建推广页
    onCreateOnlinePage = (value) => {
        console.log('submit value ===> ', value)
        this.setState({
            creating: true
        })
        const {uid, editItem} = this.state
        const data = {
            maid: uid,
            name: value.name,
            desc: value.detail,
            url: value.url
        }

        // 修改
        if (editItem) {
            data.mrp_id = editItem.mrp_id
        }

        API.addRecommendPage('post', data).then(result => {
            message.success(editItem ? '修改成功！' : '创建成功', 2)
            this.setState(prevState => ({
                creating: false,
                showCreatePage: false,
                currentPage: editItem ? prevState.currentPage : 1
            }), () => this.getList())
        })
    }

    onCancelCreatePage = () => {
        this.setState({
            showCreatePage: false
        })
    }

    onMouseEnterRow = (id) => {
        this.setState(prevState => ({
            items: prevState.items.map(item => item.mrp_id === id ? {...item, showMatrixCode: true} : item)
        }))
    }

    onMouseLeaveRow = (id) => {
        this.setState(prevState => ({
            items: prevState.items.map(item => item.mrp_id === id ? {...item, showMatrixCode: false} : item)
        }))
    }

    render() {
        const {
            items, 
            count, 
            loading, 
            showCreatePage, 
            currentPage, 
            editItem, 
            creating, 
            showReviewPage, 
            reviewPage
        } = this.state

        return (
            <section className="content models">
                <div className="mune-bar">
                    <Button type="primary" onClick={this.onShowCreatePage}>新增落地页</Button>
                </div>
                <Table dataSource={items}
                    rowKey="mrp_id"
                    pagination={{
                        defaultPageSize: 10,
                        total: count,
                        current: currentPage
                    }}
                    loading={loading}
                    onChange={this.onChangeTabal}
                    onMouseOut={() => this.onMouseLeaveTable}
                    onRow={(record) => {
                        return {
                            onMouseEnter: () => this.onMouseEnterRow(record.mrp_id),
                            onMouseLeave: () => this.onMouseLeaveRow(record.mrp_id)
                        }
                    }}
                >
                    <Column title="名称" key="mrp_name" render={(text, record) => (
                        <Popover content={this.onHoverItem(record.mrp_id)} visible={record.showMatrixCode} placement="right">
                            {record.mrp_name}
                        </Popover>
                    )} />
                    <Column title="描述" dataIndex="mrp_desc" />
                    <Column title="地址" dataIndex="mrp_url" />
                    <Column title="操作" width={120} key="edit" render={(text, record) => (
                        <div className="handle-bar">
                            <a className="edit-icon"
                                title="编辑"
                                onClick={() => this.onEditItem(record.mrp_id)}
                                href="javascript:;"
                            >
                                <Icon type="edit" />
                            </a>
                            <Popconfirm
                                title="确认删除吗?"
                                onConfirm={() => this.onRemoveItem(record.mrp_id)}
                            >
                                <a className="delete-icon"
                                    title="删除"
                                    href="javascript:;"
                                >
                                    <Icon type="delete" />
                                </a>
                            </Popconfirm>
                            <a className="review-icon"
                                title="预览"
                                onClick={() => this.onReviewItem(record.mrp_id)}
                                href="javascript:;"
                            >
                                <Icon type="eye-o" />
                            </a>
                        </div>
                    )} />
                </Table>
                <Modal title="创建推广页"
                    visible={showCreatePage}
                    onCancel={this.onCancelCreatePage}
                    footer={null}
                    destroyOnClose
                >
                    <CreateOnlinePage 
                        onSubmit={this.onCreateOnlinePage}
                        onCancel={this.onCancelCreatePage} 
                        data={editItem} 
                        loading={creating} 
                    />
                </Modal>
                <Modal
                    visible={showReviewPage}
                    onCancel={this.onHideReview}
                    footer={null}
                    destroyOnClose
                    width={375}
                    bodyStyle={{ padding: 0 }}
                    closable={false}
                ><iframe
                    src={reviewPage}
                    className="review-iframe"
                    allow="autoplay; fullscreen"
                    allowFullScreen="true"
                    webkitallfullscreen="true"
                    mozallowfullscreen="true">
                    </iframe>
                </Modal>
            </section>
        )
    }

}

export default Models