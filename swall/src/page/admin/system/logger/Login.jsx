/**
 * 模块名称: 登录日志
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import { Table, Input, DatePicker } from 'antd'

const Search = Input.Search
const { RangePicker } = DatePicker
const { Column } = Table

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            count: 0,
            name: '',
            page: 1,
            time: {
                start: '',
                end: ''
            },
            loading: false
        }
    }

    componentDidMount() {
        this.getLoginLog()
    }

    async getLoginLog() {
        this.setState({
            loading: true
        })
        const { name, page, time } = this.state
        const { list, count } = await API.getLoginLog({
            name,
            page,
            ...time 
        })
        this.setState({
            list,
            count,
            loading: false
        })
    }

    onChangeTable = (page) => {
        this.setState({
            page: page.current
        }, () => [
            this.getLoginLog()
        ])
    }

    onSearch = (value) => {
        this.setState({
            name: value
        }, () => [
            this.getLoginLog()
        ])
    }

    onchangePicker = (date, dateString) => {
        this.setState({
            time: {start: dateString[0], end: dateString[1]}
        }, () => [
            this.getLoginLog()
        ])
    }

    render() {
        const { list, count, loading } = this.state

        return (
            <section className="login-content">
                <div className="handle-bar">
                    <Search style={{ width: 350 }} onSearch={this.onSearch} placeholder="输入用户名搜索" enterButton />
                    <RangePicker  onChange={this.onchangePicker} />
                </div>
                <div className="login-list">
                    <Table
                        dataSource={list}
                        rowKey="sll_id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            total: count
                        }}
                        onChange={this.onChangeTable}
                    >
                        <Column title="登录时间"  dataIndex="sll_login_time" />
                        <Column title="用户名"  dataIndex="sll_relname" />
                        <Column title="IP"  dataIndex="sll_login_ip" />
                        <Column title="操作系统"  dataIndex="sll_os" />
                        <Column title="代理"  dataIndex="sll_broswer" />
                    </Table>
                </div>
            </section>
        )
    }
}

export default Login