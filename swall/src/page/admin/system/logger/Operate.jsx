/**
 * 模块名称: 操作日志
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import { Table, Input, DatePicker } from 'antd'

const Search = Input.Search
const { RangePicker } = DatePicker
const { Column } = Table

class Operate extends Component {
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
        const { list, count } = await API.getOperateLog({
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
                        rowKey="sal_id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            total: count
                        }}
                        onChange={this.onChangeTable}
                        scroll={{x: 1300}}
                    >
                        <Column title="操作模块"  dataIndex="sal_act" />
                        <Column title="用户名"  dataIndex="sal_relname" />
                        <Column title="请求类型"  dataIndex="method" />
                        <Column title="日志数据"  dataIndex="data" />
                        <Column title="IP" width={120} dataIndex="sal_ip" />
                        <Column title="操作系统"  dataIndex="sal_os" />
                        <Column title="代理"  dataIndex="sal_broswer" />
                        <Column title="时间"  dataIndex="sal_date" />
                    </Table>
                </div>
            </section>
        )
    }
}

export default Operate