import React, { Component } from 'react'
import { Radio, Pagination, Button, Menu } from 'antd'
import API from '../../../api'
import './assets/style.scss'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            count: 0,
            filter: {
                status: '0',
                type: '',
                page: 1
            }
        }
    }

    componentDidMount() {
        this.getMessageList()
        console.log('message', this.props)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.items.length !== this.state.items.length) {

            // 给展示不全的信息添加点击展开
            const list = this.refs.messageList
            const items = list.querySelectorAll('.m-value')
            if (items.length) {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    if (item.scrollHeight > item.offsetHeight) {
                        item.classList.add('hover-pointer')
                        item.title = "点击查看全部"
                        item.onclick = function() {
                            this.title = ""
                            this.classList.remove('hover-pointer')
                            this.style.height = this.scrollHeight + 'px'
                        }
                    }
                }
            }
        }
    }

    async getMessageList() {
        const {type, status, page} = this.state.filter
        const {list, count} = await API.getMessageList({
            is_read: status,
            type: type === 'all' ? '' : type,
            page,
            limit: 10
        }, true)

        this.setState({
            items: list,
            count: count
        })
    }

    // 设为已读
    onSetRead = (items) => {
        const ids = items.map(item => item.mum_id)
        API.readedMessage('post', {
            mum_ids: ids
        }, true).then(result => {
            // 更新未读信息数量
            this.props.updateMsgCount(result.msgCount)

            // 重新加载
            this.getMessageList()
        })
    }

    // 类型切换
    onChangeMenu = ({ item, key, keyPath }) => {
        const { filter } = Object.assign({}, this.state)
        filter.type = key
        this.setState({ filter }, () => this.getMessageList())
    }

    // 状态切换
    onChangeStatus = (e) => {
        const { filter } = Object.assign({}, this.state)
        filter.status = e.target.value
        this.setState({
            filter,
            items: [],
            count: 0
        }, () => this.getMessageList())
        
    }

    // 翻页
    onChangePage = (page) => {
        const { filter } = Object.assign({}, this.state)
        filter.page = page
        this.setState({
            filter
        }, () => this.getMessageList())
        
    }

    render() {
        const {items, count, filter} = this.state
        const {Item} = Menu

        return (
            <section className="message-content">
                <Menu
                    onClick={this.onChangeMenu}
                    defaultSelectedKeys={['all']}
                    mode="horizontal"
                >
                    <Item key={'all'}>全部</Item>
                    <Item key={'0'}>系统</Item>
                    <Item key={'1'}>审核</Item>
                    <Item key={'2'}>通知</Item>
                </Menu>
                <div className="message-panel">
                    <div className="message-radio">
                        <RadioGroup onChange={this.onChangeStatus} defaultValue={'0'}>
                            <RadioButton value={'0'}>未读</RadioButton>
                            <RadioButton value={'1'}>已读</RadioButton>
                            <RadioButton value={'2'}>全部</RadioButton>
                        </RadioGroup>
                    </div>
                    {(filter.status === '0' && items.length > 0) && <Button onClick={() => this.onSetRead(items)}>全部设为已读</Button>}
                </div>
                <ul className="message-list" ref="messageList">
                    {items.map(item => <li key={item.mum_id}>
                        <h4 className="title">{item.mm_type?item.mm_type:'消息'}</h4>
                        <p className="m-value">{item.mm_content}</p>
                        <span className="m-time">{item.send_time}</span>
                        {item.mum_is_read === 0 && <span className="read-btn link" onClick={() => this.onSetRead([item])}>设为已读</span>}
                    </li>)}
                </ul>
                <div>
                    <Pagination hideOnSinglePage={true} onChange={this.onChangePage} defaultPageSize={10} defaultCurrent={1} total={count} />
                </div>
            </section>
        )
    }
}

export default Message