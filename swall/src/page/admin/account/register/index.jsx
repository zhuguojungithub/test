/**
 * 模块名称: 注册用户管理
 * @author xuzhongyuan@372163.com
 */

import React, {Component} from 'react'
import {Table, Input, Switch } from 'antd'
import API from '../../../../api'

const Search = Input.Search
const { Column } = Table

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            count: 0,
            loading: false,
            search: '',
            page: 1,
            limit: 10,
        }
    }

    componentDidMount() {
        this.getClientList()
    }

    onSearchUser = (value) => {
        this.setState({
            search: value
        }, () => {
            this.getClientList()
        })
    }

    // 获取列表
    async getClientList() {
        this.setState({
            loading: true
        })
        const {page, search} = this.state
        const data = await API.getClientList({page, mui_name: search})
        this.setState({
            items: data.list,
            count: data.count,
            loading: false
        })
    }

    onTableChange = (pagination, filters) => {
        this.setState({
            page: pagination.current
        }, () => this.getClientList())
    }

    onChangeItem = (checked, id) => {
        console.log(checked, id)
        this.setState(prevState => ({
            items: prevState.items.map(item => item.su_id === id ? {...item, loading: true} : item)
        }))
        API.onChangeUserStatus('post', {
            su_id: id,
            is_del: checked
        })
        .then(() => {
            this.setState(prevState => ({
                items: prevState.items.map(item => item.su_id === id ? {...item, is_del: checked, loading: false} : item)
            }))
        })
    }

    render() {
        const {items, loading, count} = this.state
        return (
            <section className="register-content">
                <div className="bar">
                    <Search
                        placeholder="搜索"
                        enterButton
                        style={{ width: 400 }}
                        size="large"
                        onSearch={value => this.onSearchUser(value)}
                    />
                </div>
                <Table 
                    dataSource={items}
                    loading={loading}
                    rowKey="su_id"
                    locale={{emptyText: '暂无数据'}}
                    scroll={{x: 1300 }}
                    className="client-list"
                    pagination={{
                        defaultPageSize: 10,
                        total: count
                    }}
                    onChange={this.onTableChange}
                >
                    <Column title="ID" dataIndex="su_id" />
                    <Column title="名称" dataIndex="mui_name" />
                    <Column title="手机号" dataIndex="mui_mobile" />
                    <Column title="邮箱" dataIndex="mui_email" />
                    <Column title="所属广告主" dataIndex="ma_corp_name" />
                    <Column title="冻结" render={(text, record) => <Switch
                        loading={record.loading}
                        onChange={(checked) => this.onChangeItem(checked, record.su_id)} 
                        checked={!!record.is_del} />} 
                    />
                    <Column title="注册时间" dataIndex="create_time" />
                </Table>
            </section>
        )
    }
}

export default Register