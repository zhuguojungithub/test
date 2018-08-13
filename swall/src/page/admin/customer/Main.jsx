import React, { Component } from 'react'
import { Input, Table } from 'antd'
import API from '../../../api'
import {Link} from 'react-router-dom'

const Search = Input.Search
const { Column } = Table

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            count: 0,
            search: '',
            loading: false
        }
    }

    componentDidMount() {
        this.getCustomer()
    }

    async getCustomer(page=1, limit=10) {
        this.setState({loading: true})
        const {search} = this.state
        const data = await API.getCustomer({page: page, limit: limit, name: search})
        this.setState({
            items: data.list,
            count: data.count,
            loading: false
        })
    }

    onSearchUser = (value) => {
        this.setState({
            search: value
        }, () => {
            this.getCustomer()
        })
    }

    onTableChange = (pagination, filters, sorter) => {
        const { current } = pagination
        this.getCustomer(current)
    }

    render() {
        const {loading, items, count} = this.state
        return (
            <section className="customer-main">
                <Search
                    placeholder="客户搜索"
                    onSearch={value => console.log(value)}
                    enterButton
                    style={{ width: 400 }}
                    size="large"
                    onSearch={value => this.onSearchUser(value)}
                />
                <div className="content">
                    <Table 
                        dataSource={items}
                        loading={loading}
                        rowKey="ma_id"
                        locale={{emptyText: '暂无数据'}}
                        className="customer-list"
                        pagination={{
                            defaultPageSize: 10,
                            total: count
                        }}
                        onChange={this.onTableChange}
                    >
                        <Column title="广告主" key="ma_corp_name" render={(text, record, index) => {
                            return (
                                <Link to={`/admin/customer/${record.ma_id}`}>
                                    {record.ma_corp_name}
                                </Link>
                            )
                        }}/>
                        <Column title="状态" render={(text, record) => (
                            <ul style={{marginBottom: 0}}>
                                {record.audit_status.map(item => <li key={item.name}>{item.name}：{item.status}</li>)}
                            </ul>
                        )}/>
                        <Column title="行业" key="cate" render={(text, record) => `${record.cate1}/${record.cate2}`}/>
                        <Column title="操作" key="handle" render={(text, record) => (
                            <Link target="_blank"
                                to={`/admin/advertPlan?uid=${record.ma_id}&name=${record.ma_corp_name}`}
                            >广告投放</Link>
                        )} />
                    </Table>
                </div>
            </section>
        )
    }
}

export default Main