/**
 * 模块名称: 广告计划详情
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import { Link } from 'react-router-dom'
import { Input, Table, Button, Icon, Popconfirm, message } from 'antd'
import Preview from '../../../../components/preview'
import {getQueryStringArgs} from '../../../../tools/utils'

const { Column } = Table

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: null,
            previewData: null,
            adverts: [],
            isManage: props.match.path.includes('advertPlan')
        }
    }

    componentDidMount() {
        console.log('广告计划详情 props ===> ', this.props)
        this.getPlanDetail()
        this.getAdvertList()
    }

    async getPlanDetail() {
        const {id} = this.props.match.params
        const {campaign, creative} = await API.getPlanData({c_id: id}, true)
        this.setState({
            data: campaign,
            previewData: creative
        })
    }

    async getAdvertList() {
        const {id} = this.props.match.params
        const {list, count} = await API.getPlanAdvertList({c_id: id})
        this.setState({
            adverts: list
        })
    }

    onEditPreview = () => {
        const {history, location, match} = this.props
        const {previewData} = this.state
        let pathname = 'create-idea'

        // 客户端
        if (match.url.includes('planList')) {
            pathname = `${match.url}/create-idea`
        }
        history.push({
            pathname,
            state: {
                ...location.state,
                type: 'edit',
                planId: match.params.id,
                ideaId: previewData.creative_id
            }
        })
    }

    onCreateAdvertIdea = () => {
        const {history, location, match} = this.props
        history.push({
            pathname: 'create-idea',
            state: {
                ...location.state,
                type: 'new',
                planId: match.params.id
            }
        })
    }

    onRemoveAdvert = (id) => {
        API.removeAdvert('post', {
            mag_id: id
        }, true).then(() => {
            this.setState(prevState => ({
                adverts: prevState.adverts.filter(item => item.mag_id !== id)
            }))
        })
    }

    onAddNewAdvert = () => {
        const {history, location, match} = this.props
        history.push({
            pathname: 'create-advert',
            state: {...location.state, advertId: undefined, from: 'planDetail', planId: match.params.id, type: 'new'}
        })
    }

    async onRemovePlan(id) {
        await API.removePlanItem('post', {
            c_id: id
        }, true)
        message.success('删除成功, 即将跳转至计划列表', 3, () => this.props.history.goBack())
    }

    onEditPlanItem = () => {
        const {history, location} = this.props
        const {data} = this.state

        history.push({
            pathname: 'create-plan',
            state: {
                ...location.state,
                planId: data.mc_id
            }
        })
    }

    async onSubmitAdvert(id) {
        await API.actionAdvert('post', {
            maid: getQueryStringArgs(this.props.location.state.search).uid,
            magid: id
        }, true)
        this.getAdvertList()
    }

    viewDetail = () => {
        const { match, history } = this.props
        history.push({
            pathname: `/admin/database/plan/${match.params.id}`
        })
    }

    render() {
        const {data, adverts, loading, previewData, isManage} = this.state
        const {match, location} = this.props
        if (!data) {
            return null
        }
        return (
            <div className="content plan-detail-content">
                <div className="plan-basic">

                    <div className="detail-wrap">
                        <div className="detail-content">
                            <h2 className="title">{data.mc_campaign_name}</h2>
                            <p className="detail-id">计划ID：{data.mc_id}</p>
                            <ul className="detail-items">
                                <li>
                                    <span>当前状态</span>
                                    <p>{data.mc_status}</p>
                                </li>
                                <li>
                                    <span>推广目标</span>
                                    <p>{data.mc_product_type}</p>
                                </li>
                                {data.mc_product_type === '微信本地门店推广' && <li>
                                    <span>推广门店</span>
                                    <p>{data.mc_mpid}</p>
                                </li>}
                                <li>
                                    <span>广告位置</span>
                                    <p>{data.mc_campaign_type}</p>
                                </li>
                                <li>
                                    <span>购买类型</span>
                                    <p>{data.mc_buy_type}</p>
                                </li>
                                <li>
                                    <span>所属服务商</span>
                                    <p>{data.mc_services}</p>
                                </li>
                                <li>
                                    <span>创建日期</span>
                                    <p>{data.create_time}</p>
                                </li>
                            </ul>
                        </div>
                        {isManage && <div className="detail-btns">
                            <Popconfirm
                                title="确认删除这条广告计划吗?"
                                onConfirm={() => this.onRemovePlan(data.mc_id)}
                            >
                                <Button>删除</Button>
                            </Popconfirm >
                            <Button onClick={this.onEditPlanItem}>修改</Button>
                            <Button onClick={this.viewDetail}>查看数据报表</Button>
                            <Button onClick={this.onAddNewAdvert} disabled={adverts.length >= 10}>新增投放广告</Button>
                        </div>}
                    </div>

                    {previewData 
                    ? <div className="preview">
                        <Preview 
                            content={previewData.mc_title}
                            imageUrl={previewData.image_url}
                            shareTitle={previewData.mc_share_title}
                            shareDetail={previewData.mc_share_desc}
                            link={previewData.mc_str_link}
                        />
                        <Button className="edit-preview" onClick={this.onEditPreview}>修改</Button>
                    </div>
                    : <div className="preview">
                        <div>该计划尚未创建广告创意</div>
                        <Button className="edit-preview" onClick={this.onCreateAdvertIdea}>添加广告创意</Button>
                    </div>}
                    
                </div>

                <div className="advert-list">
                    <h4>此计划包含以下广告</h4>
                    <Table 
                        dataSource={adverts}
                        loading={loading}
                        rowKey="mag_id"
                        locale={{emptyText: '暂无数据'}}
                        scroll={{x: 1300 }}
                        className="plan-list"
                        pagination={false}
                        onChange={this.onTableChange}
                    >
                        <Column title="名称" key="mag_name" render={(text, record) => (
                            <Link to={{pathname: `${match.url}/advert-detail`, state: {...location.state, advertId: record.mag_id}}}>
                                {record.mag_name}
                            </Link>
                        )} />
                        <Column title="状态" key="mag_system_status" render={(text, record) => record.mag_system_status.value} />
                        <Column title="操作" key="handle" render={(text, record) => {

                            if (isManage) {
                                return (
                                    <Fragment>
                                        <Link 
                                            className="edit-icon" 
                                            title="编辑" 
                                            to={{pathname: 'create-advert', state: {...location.state, advertId: record.mag_id, planId: match.params.id, type: 'edit'}}}
                                        >
                                            <Icon type="edit" />
                                        </Link>
                                        <Popconfirm 
                                            title="确认要删除这条广告吗？" 
                                            onConfirm={() => this.onRemoveAdvert(record.mag_id)}
                                            onCancel={null}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <a className="delete-icon" title="删除" href="javascript:;"><Icon type="delete" /></a>
                                        </Popconfirm>
                                        {record.mag_system_status.code === 1 && <Popconfirm 
                                            title="确认开始投放吗？"
                                            onConfirm={() => this.onSubmitAdvert(record.mag_id)}
                                            onCancel={null}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <a className="delete-icon" title="投放" href="javascript:;"><Icon type="upload" /></a>
                                        </Popconfirm>}
                                    </Fragment>
                                )
                            }
                            return <Link to={`/admin/database/advert/${record.mag_id}`}>查看数据</Link>
                        }} />
                        <Column title="投放时间" key="mc_buy_type" render={(text, record) => `${record.mag_begin_date}~${record.mag_end_date}`} />
                        <Column title="预算 (元)" dataIndex="mag_daily_budget" />
                        <Column title="花费 (元)" dataIndex="cost" />
                        <Column title="曝光次数" dataIndex="impression" />
                        <Column title="点击次数" dataIndex="click" />
                        <Column title="点击率" dataIndex="click_rate" />
                    </Table>
                </div>
            </div>
        )
    }

}

export default Detail