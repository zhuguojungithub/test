/**
 * 模块名称: 计划列表
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Input, Table } from 'antd'
import {Link} from 'react-router-dom'
import API from '../../../api'

const Search = Input.Search
const { Column } = Table

class PlanList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            count: 0,
            items: [],
            name: '',
            uid: props.uid,
            statusId: '',
            pTypeId: '',
            page: 1,
            limit: 10,
            pTypeData: [],
            statusData: []
        }
    }

    componentDidMount() {
        console.log('广告计划列表 props ===> ', this.props)
        this.getPlanList()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.uid !== prevState.uid && nextProps.uid !== undefined) {
            return { uid: nextProps.uid }
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.uid !== this.state.uid) {
            this.getPlanList()
        }
    }

    async getPlanList() {
        const {name, uid, statusId, pTypeId, page, limit} = this.state

        if (uid === undefined) return
        this.setState({loading: true})
        const { list, count, status, p_type } = await API.getClientPlans({
            maid: uid,
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
                    style={{marginTop: 22}}
                >
                    <Column title="计划名称" key="mc_campaign_name" render={(text, record) => (
                        <Link to={`${match.path}/${record.mc_id}`}>
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
                                <Link
                                    className="edit-icon"
                                    to={{
                                        pathname: `/admin/database/plan/${record.mc_id}`,
                                        state: {
                                            search: location.search,
                                            planId: record.mc_id
                                        }
                                    }}
                                >
                                    查看消耗数据
                                </Link>
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

export default PlanList