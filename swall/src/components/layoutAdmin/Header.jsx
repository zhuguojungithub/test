import React, {Component} from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Layout, Menu, Avatar, Icon, Badge, Popover } from 'antd'
import logo from '../../assets/logo.png'
import Message from './Message'
import API from '../../api'
const { Header } = Layout

class HeaderComp extends Component  {
    constructor(props) {
        super(props)
        this.state = {
            messages: [], 
            fetching: false
        }
    }

    onVisibleChange = (visible) => {
        if (visible) {
            this.getMessageList()
        }
    }

    getMessageList() {
        this.setState({
            fetching: true,
            messages: []
        })

        API.getUserNewMessage().then(result => {
            this.setState({
                messages: result.list,
                fetching: false
            })
        })
        .catch(err => {
            this.setState({
                fetching: false
            })
        })
    }

    showName = (val) => {
        if (!val) return ''

        // 手机号
        if (val.match(/^\d{11}$/)) {
            return val.slice(-4)
        }
        
        // 英文名称
        if (val.match(/^[a-zA-Z]+$/)) {
            return val.slice(-5)
        }

        return val.slice(-1)
    }

    render () {
        const {userinfo, logout, menuData} = this.props
        const {messages, fetching} = this.state

        const content = (
            <ul>
                {userinfo.user_type === 0 && <li><Link to="/admin/personal">个人中心</Link></li>}
                <li><Link to="/login/reset">修改密码</Link></li>
                <li><a href="javascript:;" onClick={logout}>退出登录</a></li>
            </ul>
        )
        return (
            <Header className="admin-header">
                <div className="logo">
                    <Link className="logo-link" to="/" title="回到首页">
                        <img width="40" src={logo}/>
                        <h1>广联先锋</h1>
                    </Link>
                </div>
                <div className="header-right">
                    <nav className="admin-nav">
                        {menuData.map(item => {
                            if (item.jump === '/admin') {
                                return <NavLink key={item.jump} exact activeClassName="active-nav" to={item.jump}>{item.title}</NavLink>
                            }
                            return <NavLink key={item.jump} activeClassName="active-nav" to={item.jump}>{item.title}</NavLink>
                        })}
                    </nav>
                    <div className="user-wrap">
                        {/* 未读消息 */}
                        <NavLink
                            className="message-link"
                            activeClassName="active-link"
                            to="/admin/message"
                        >
                            {userinfo.messageCount > 0
                                ? <Popover
                                    content={<Message list={messages} fetching={fetching} />}
                                    className="message-popover"
                                    onVisibleChange={this.onVisibleChange}
                                >
                                    <Badge count={userinfo.messageCount} overflowCount={99}>
                                        <Icon type="message" />
                                    </Badge>
                                </Popover>
                                : <Badge count={userinfo.messageCount} overflowCount={99}>
                                    <Icon type="message" />
                                </Badge>}
                        </NavLink>
                    
                        <Popover content={content} trigger="hover">
                            {userinfo.logo_url 
                                ? <Avatar src={`/web/${userinfo.logo_url}`} title={userinfo.username} /> 
                                : <Avatar title={userinfo.username}>{this.showName(userinfo.username)}</Avatar>}
                        </Popover>
                    </div>
                </div>
            </Header>
        )
    }
}

export default HeaderComp