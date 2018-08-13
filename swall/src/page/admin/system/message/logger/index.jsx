/**
 * 模块名称: 发送记录
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../../api'
import { Table, Button, Switch, Modal , message} from 'antd'
import NewMessage from '../system/NewMessage'

const { Column } = Table

class MsgLogger extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            count: 0,
            loading: false,
            page: 1,
            limit: 10,
            showMsgModal: false
        }
    }

    componentDidMount() {
        // console.log('发送记录', this.props)
        this.getMsgData()
    }

    async getMsgData() {
        this.setState({
            loading: true
        })
        const {page, limit} = this.state
        const data = await API.getMsgList({
            page,
            limit
        })
        this.setState({
            list: data.list,
            count: data.count,
            loading: false
        })
    }

    onNewMessage = () => {
        this.setState({
            showMsgModal: true
        })
    }

    onHideMsgModel = () => {
        this.setState({
            showMsgModal: false
        })
    }

    onSubmitNewMsg = (values) => {
        API.postMessage('post', {
            title: values.name,
            content: values.body,
            scope: values.target,
            time: values.date
        }).then(() => {
            this.setState({
                showMsgModal: false
            })
            message.success('发送成功', 2)
            this.getMsgData()
        })
    }

    onChangeTable = (pagination) => {
        this.setState({
            page: pagination.current
        }, () => this.getMsgData())
    }

    render() {
        const {list, count, loading, showMsgModal} = this.state

        return (
            <section className="system-content">
                <div className="handle-bar">
                    <ul></ul>
                    <Button type="primary" onClick={this.onNewMessage}>发送新消息</Button>
                </div>
                <div className="system-list">
                    <Table
                        dataSource={list}
                        rowKey="mm_id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            total: count
                        }}
                        onChange={this.onChangeTable}
                    >
                        <Column title="时间" dataIndex="mm_send_time" />
                        <Column title="消息标题" dataIndex="mm_title" />
                        <Column title="消息内容" dataIndex="mm_content" />
                        <Column title="发送对象" dataIndex="mm_scope" />
                    </Table>
                </div>
                <Modal
                    visible={showMsgModal}
                    title="发送新消息"
                    footer={null}
                    closable={false}
                    destroyOnClose
                >
                    <NewMessage cancel={this.onHideMsgModel} onCommit={this.onSubmitNewMsg} />
                </Modal>
            </section>
        )
    }
}

export default MsgLogger