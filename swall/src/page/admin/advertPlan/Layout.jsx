/**
 * 模块名称: 计划列表
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Link, NavLink} from 'react-router-dom'
import {getQueryStringArgs} from '../../../tools/utils'

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            search: ''
        }
    }

    static defaultProps = {
        navList: [{
            path: '',
            name: '朋友圈广告'
        }, {
            path: '/models',
            name: '落地页管理'
        }, {
            path: '/credentials',
            name: '资质管理'
        }]
    }

    componentDidMount() {
        console.log('layout props ===> ', this.props)
        const {location} = this.props

        // 当页面刷新时，从location.state中取数据
        const {search} = location.search ? location : location.state
        const {name} = getQueryStringArgs(search)
        this.setState({
            name,
            search
        })
    }

    isActive(match, location, pathname) {
        if (location.pathname === pathname)
            return true
        return false
    }

    render() {
        let {name, search} = this.state
        const {navList} = this.props

        return (
            <div className="advert-layout">
                <header className="header">
                    <div className="userinfo">
                        <span className="username">公司名称：{name}</span>
                    </div>
                    <nav className="nav">
                        {navList.map((item, index) => {
                            const path = `/admin/advertPlan${item.path}`
                            return (
                                <NavLink
                                    key={index}
                                    to={`${path}${search}`}
                                    isActive={(match, location) => this.isActive(match, location, path)}
                                    activeClassName="active-nav"
                                >
                                    {item.name}
                                </NavLink>
                            )
                        })}
                    </nav>
                </header>
                <div className="breadcrumb">
                        {/* 面包屑 */}
                </div>
                <div className="main">{this.props.children}</div>
            </div>
        )
    }

}

export default Main