/**
 * 模块名称: 计划列表
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Input, Table, Button, Icon, Popconfirm, Modal } from 'antd'
import {Link} from 'react-router-dom'
import {getQueryStringArgs} from '../../../tools/utils'
import API from '../../../api'

const Search = Input.Search
const { Column } = Table

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            count: 0,
            items: [],
            name: '',
            search: getQueryStringArgs(props.location.search),
            statusId: '',
            pTypeId: '',
            page: 1,
            limit: 10,
            pTypeData: [],
            statusData: []
        }
    }

    componentDidMount() {
        console.log('plan main props ===> ', this.props)
        this.getPlanList()
    }

    async getPlanList() {
        const {name, search, statusId, pTypeId, page, limit} = this.state
        this.setState({loading: true})
        const { list, count, status, p_type } = await API.getPlanList({
            maid: search.uid,
            page: page,
            name: name,
            limit: limit,
            status: statusId && statusId !== 'all' ? statusId : '',
            p_type: pTypeId && pTypeId !== 'all' ? pTypeId : ''
        })

        this.setState({
            items: list,
            count: count,
            statusData: status.map(item => ({text: item.name, value: item.id === '' ? 'all' : item.id})),
            pTypeData: p_type.map(item => ({text: item.name, value: item.id === '' ? 'all' : item.id})),
            loading: false
        })
    }

    onSearchUser = (value) => {
        this.setState({
            name: value
        }, () => {
            this.getPlanList()
        })
    }

    onTableChange = (pagination, filters) => {
        console.log(filters)
        const {mc_status, mc_product_type} = filters
        this.setState({
            page: pagination.current,
            statusId: mc_status ? mc_status[0] : '',
            pTypeId: mc_product_type ? mc_product_type[0] : ''
        }, () => {
            this.getPlanList()
        })
    }

    async onRemovePlan(id) {
        await API.removePlanItem('post', {
            c_id: id
        }, true)
        this.getPlanList()
    }

    async onCreatePlan() {
        const {history, location, match} = this.props
        const items = await API.getUserService({
            maid: getQueryStringArgs(location.search).uid
        }, true)

        if (items.some(item => item.show)) {
            history.push({
                pathname: `${match.path}/create-plan`,
                state: {search: location.search}
            })
        } else {
            Modal.info({
                title: '资质未通过',
                content: (
                    <div>
                        <p>该用户尚未通过任何资质审核</p>
                    </div>
                )
            })
        }
    }

    render() {
        const {loading, count, items, statusData, pTypeData} = this.state
        const {location, match} = this.props
        return (
            <section className="content">
                <div className="bar">
                    <Search
                        placeholder="广告计划搜索"
                        enterButton
                        style={{ width: 400 }}
                        size="large"
                        onSearch={value => this.onSearchUser(value)}
                    />
                    <Button type="primary" onClick={() => this.onCreatePlan()}>创建新计划</Button>
                </div>
                <Table 
                    dataSource={items}
                    loading={loading}
                    rowKey="mc_id"
                    locale={{emptyText: '暂无数据'}}
                    scroll={{x: 1300 }}
                    className="plan-list"
                    pagination={{
                        defaultPageSize: 10,
                        total: count
                    }}
                    onChange={this.onTableChange}
                >
                    <Column title="计划名称" key="mc_campaign_name" render={(text, record) => (
                        <Link to={{pathname: `/admin/advertPlan/${record.mc_id}`, state: {search: location.search}}}>
                            {record.mc_campaign_name}
                        </Link>
                    )} />
                    <Column 
                        title="状态" 
                        dataIndex="mc_status" 
                        filterMultiple={false} 
                        filters={statusData}
                    />
                    <Column title="操作" key="handle" render={(text, record) => {
                        return (
                            <Fragment>
                                <Link
                                    className="edit-icon"
                                    title="编辑"
                                    to={{
                                        pathname: `${match.path}/create-plan`,
                                        state: {
                                            search: location.search,
                                            planId: record.mc_id
                                        }
                                    }}
                                >
                                    <Icon type="edit" />
                                </Link>
                                <Popconfirm 
                                    title="确认删除这条广告计划吗?"
                                    onConfirm={() => this.onRemovePlan(record.mc_id)}
                                >
                                    <a className="delete-icon" title="删除" href="javascript:;"><Icon type="delete" /></a>
                                </Popconfirm>
                            </Fragment>
                        )
                    }} />
                    <Column title="推广目标" dataIndex="mc_product_type" filterMultiple={false} filters={pTypeData} />
                    <Column title="购买类型" dataIndex="mc_buy_type" />
                    <Column title="花费 (元)" dataIndex="cost" />
                    <Column title="曝光次数" dataIndex="impression" />
                    <Column title="点击次数" dataIndex="click" />
                    <Column title="点击率" dataIndex="click_rate" />
                </Table>
            </section>
        )
    }

}

export default Main