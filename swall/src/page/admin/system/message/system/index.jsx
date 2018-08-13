/**
 * 模块名称: 系统消息
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../../api'
import { Table, Button, Switch, Modal , message} from 'antd'
import NewMessage from './NewMessage'

const { Column } = Table

class SysMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            count: 0,
            loading: false,
            page: 1,
            limit: 10,
            showMsgModal: false,
            editItem: null
        }
    }

    componentDidMount() {
        // console.log('系统消息', this.props)
        this.getMsgData()
    }

    async getMsgData() {
        this.setState({
            loading: true
        })
        const {page, limit} = this.state
        const data = await API.getMsgTemp({
            page,
            limit,
            type: 3
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
            showMsgModal: false,
            editItem: null
        })
    }

    onSubmitNewMsg = (values) => {

        const {editItem} = this.state
        // 修改系统消息
        if (editItem) {
            API.editMsgTemp('post', {
                mmt_id: editItem.mmt_id,
                title: values.name,
                content: values.body
            }).then(() => {
                this.setState({
                    showMsgModal: false,
                    editItem: null
                })
                message.success('修改成功', 2)
                this.getMsgData()
            })
            return
        }

        // 发送消息
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
            this.props.history.push('./logger')
        })
    }

    onChangeTable = (pagination) => {
        this.setState({
            page: pagination.current
        }, () => this.getMsgData())
    }

    onChangeSwitch = (checked, item) => {
        API.changeMsgStatus('post',  {
            mmt_id: item.mmt_id,
            status: item.mmt_is_send
        }).then(() => {
            this.getMsgData()
        })
    }

    onEditItem = (item) => {
        this.setState({
            showMsgModal: true,
            editItem: item
        })
    }

    render() {
        const {list, count, loading, showMsgModal, editItem} = this.state

        return (
            <section className="system-content">
                <div className="handle-bar">
                    <ul></ul>
                    <Button type="primary" onClick={this.onNewMessage}>发送新消息</Button>
                </div>
                <div className="system-list">
                    <Table
                        dataSource={list}
                        rowKey="mmt_id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            total: count
                        }}
                        onChange={this.onChangeTable}
                    >
                        <Column title="ID" dataIndex="mmt_id" />
                        <Column title="操作" key="set" render={(Text, record) => {
                            return (
                                <div className="system-set">
                                    <Button size="small" onClick={() => this.onEditItem(record)}>修改</Button>
                                    <Switch
                                        defaultChecked={!!record.mmt_is_send} 
                                        onChange={(checked) => this.onChangeSwitch(checked, record)} 
                                    />
                                </div>
                            )
                        }} />
                        <Column title="消息标题" dataIndex="mmt_title" />
                        <Column title="消息内容" dataIndex="mmt_content" />
                        <Column title="消息主题" dataIndex="mmt_subject" />
                    </Table>
                </div>
                <Modal
                    visible={showMsgModal}
                    title={editItem ? '修改系统消息' : '发送新消息'}
                    footer={null}
                    closable={false}
                    destroyOnClose
                >
                    <NewMessage cancel={this.onHideMsgModel} onCommit={this.onSubmitNewMsg} data={editItem}/>
                </Modal>
            </section>
        )
    }
}

export default SysMessage