/**
 * 模块名称: 创建广告列表
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import BtnGroup from '../../../../components/btnGroup'
import {Icon, Button, Modal, Popconfirm, message} from 'antd'
import Loading from '../../../../components/loading'

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            detail: null,
            visible: false,
            fetching: false
        }
    }

    componentDidMount() {
        console.log('list props ====> ', this.props)
        this.getAdvertList()
    }

    async getAdvertList() {
        const {location} = this.props
        const list = await API.getAdvertList({
            mcid: location.state.planId
        }, true)
        this.setState({ list })
    }

    viewDetail = (id) => {
        this.setState({
            visible: true,
            fetching: true
        })

        API.getAdvertDetail({
            mag_id: id
        }).then(result => {
            this.setState({
                fetching: false,
                detail: result
            })
        })
    }

    onCopy = (id, e) => {
        e.stopPropagation()
        const {history, location} = this.props
        history.push({
            pathname: 'create-advert',
            state: {...location.state, advertId: id, type: 'copy'}
        })

    }

    onRemove = (id) => {
        API.removeAdvert('post', {
            mag_id: id
        }, true).then(() => {
            this.setState(prevState => ({
                list: prevState.list.filter(item => item.mag_id !== id)
            }))
        })
    }

    onEdit = (id, e) => {
        e.stopPropagation()
        const {history, location} = this.props
        history.push({
            pathname: 'create-advert',
            state: {...location.state, advertId: id, type: 'edit'}
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            detail: null
        })
    }

    showDeleteConfirm = (id, e) => {
        const that = this
        e.stopPropagation()
        Modal.confirm({
            title: '确认要删除这条广告吗？',
            content: '删除后不可恢复',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            style: {top: '30%'},
            onOk() {
                that.onRemove(id)
            }
        })
    }

    onAdd = () => {
        const {history, location} = this.props
        history.push({
            pathname: 'create-advert',
            state: {...location.state, advertId: undefined, type: 'new'}
        })
    }

    onConfirmCreate = () => {
        const {history, location} = this.props
        if (this.state.list.length === 0) {
            message.error('请至少创建一条广告，再进行下一步')
            return
        }
        history.push({
            pathname: 'create-idea',
            state: location.state
        })
    }

    onCancelCreate = () => {
        const {history, location} = this.props
        history.push({
            pathname: '/admin/advertPlan',
            search: location.state.search
        })
    }

    render() {
        const {list, visible, detail, fetching} = this.state

        return (
            <section className="list-section wrapper">
                <ul className="create-list">
                    {list.map(item => (
                        <li key={item.mag_id} onClick={() => this.viewDetail(item.mag_id)}>
                            <h2 className="title">{item.mag_name}</h2>
                            <div className="area-box">
                                <h4 className="title">定向人群</h4>
                                <p>地域：{item.geo_location}</p>
                            </div>
                            <div>
                                <h4 className="title">预算花费</h4>
                                <p>出价：{item.mag_bid_amount}元/千次曝光</p>
                                <p>每日预算：{item.mag_daily_budget}元/天</p>
                            </div>
                            <div className="handle-bar">
                                {list.length < 10 && <Icon type="copy" onClick={e => this.onCopy(item.mag_id, e)} title="复制并新建" />}
                                <Icon type="edit" onClick={e => this.onEdit(item.mag_id, e)} title="编辑" />
                                <Icon type="delete" onClick={e => this.showDeleteConfirm(item.mag_id, e)} title="删除" />
                            </div>
                        </li>
                    ))}
                    {list.length < 10 && <li className="add-advert-btn" title="点击新增" onClick={this.onAdd}><Icon type="plus" /></li>}
                </ul>

                {/* 预览详情 */}
                <Modal
                    title={detail ? detail.mag_name : '加载中...'}
                    width={725}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {fetching && <div className="advert-detail-wrap"><Loading type="ellipsis" /></div>}
                    {!fetching && detail && <div className="advert-detail-wrap">
                        <div className="block">
                            <h4>定向人群</h4>
                            <ul className="items">
                                <li>
                                    <span>年龄</span>
                                    <p>{detail.age.join('~')}</p>
                                </li>
                                <li>
                                    <span>性别</span>
                                    <p>{detail.gender}</p>
                                </li>
                                <li>
                                    <span>地域</span>
                                    <p>{detail.geo_location.join('、')}</p>
                                </li>
                                <li>
                                    <span>兴趣</span>
                                    <p>{detail.business_interest.join('、')}</p>
                                </li>
                                <li>
                                    <span>学历</span>
                                    <p>{detail.education.join('、')}</p>
                                </li>
                                <li>
                                    <span>婚恋状态</span>
                                    <p>{detail.relationship_status.join('、')}</p>
                                </li>
                                <li>
                                    <span>操作系统</span>
                                    <p>{detail.user_os.join('、')}</p>
                                </li>
                                <li>
                                    <span>手机价格</span>
                                    <p>{detail.device_price.join('、')}</p>
                                </li>
                                <li>
                                    <span>运营商</span>
                                    <p>{detail.network_operator.join('、')}</p>
                                </li>
                                <li>
                                    <span>联网方式</span>
                                    <p>{detail.network_type.join('、')}</p>
                                </li>
                            </ul>
                        </div>

                        <div className="block">
                            <h4>投放时间</h4>
                            <ul className="items">
                                <li>
                                    <span>开始 / 结束日期</span>
                                    <p>{detail.mag_begin_date} 至 {detail.mag_end_date}</p>
                                </li>
                                <li>
                                    <span>展示时间段</span>
                                    <ul className="show-list">
                                        {typeof detail.mag_times === 'string' 
                                        ? <li>{detail.mag_times}</li> 
                                        : detail.mag_times.map((item, index) => <li key={index}>{item.start}-{item.end}</li>)}
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="block">
                            <h4>预算花费</h4>
                            <ul className="items">
                                <li>
                                    <span>出价</span>
                                    <p>{detail.mag_bid_amount}元/千次曝光</p>
                                </li>
                                <li>
                                    <span>每日预算</span>
                                    <p>{detail.mag_daily_budget}元/天</p>
                                </li>
                            </ul>
                        </div>

                    </div>}
                </Modal>
                <BtnGroup cancel={this.onCancelCreate} confirm={this.onConfirmCreate} right confirmName="下一步" />
            </section>
        )
    }

}

export default List