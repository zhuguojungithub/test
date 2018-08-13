/**
 * 后台布局组件
 * auth xuzhongyuan@372163.com
 * 
 */

import React, { Component } from 'react'
import './assets/style.scss'
import Header from './Header'
import API from '../../api'
import Breadcrumb from './Breadcrumb'
import { Layout } from 'antd'
import SiderMenu from './SiderMenu'
import ErrorBoundary from '../../ErrorBoundary'
// import {menuData} from  '../../menuData'
import UserContext from '../../userContext'

const { Content, Footer } = Layout
const localMenuData = localStorage.getItem('menuData')

class LayoutAdmin extends Component {

    // 用来定义哪些页面使用固定宽度
    static defaultProps = {
        fixedLayout: [
            '/admin/customer/*',
            '/admin/product/*',
            '/admin/personal',
            '/admin/planList/*/create-idea',
            '/admin/planList/*/advert-detail',
        ]
    }

    constructor(props) {
        super(props)
        this.state = {
            menuData: localMenuData ? JSON.parse(localMenuData) : [],
            siderMenuData: []
        }
    }

    componentDidMount() {
        // console.log('LayoutAdmin props ==> ', this.props)
        this.getUserInfo()
        this.getMenuInfo()
    }

    getUserInfo = () => {
        API.getUser()
        .then(data => {
            this.props.setUserinfo(data)
        })
        .catch(err => {
            // 登录过期
            if (err.code === 1001) {
                this.props.history.push('/login')
            }
        })
    }

    getMenuInfo = () => {
        API.getMenu().then(menuData => {
            const { pathname } = this.props.location
            let siderMenuData = []
            // 找到当前路由所对应的siderMenu的数据
            // 这里忽略了首页，如果首页也设置siderMenu，这里的逻辑要改
            for (let i = 0; i < menuData.length; i++) {
                if (pathname.includes(menuData[i].jump) && menuData[i].jump !== '/admin') {
                    if (menuData[i].routes.length) {
                        siderMenuData = menuData[i].routes
                        break
                    }
                }
            }

            this.setState({
                siderMenuData,
                menuData
            }, () => localStorage.setItem('menuData', JSON.stringify(menuData)))
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { location } = nextProps
        const len = location.pathname.split('/').filter(item => item).length
        if (len <= 2) {
            // 小于等于2则为一级路由切换，刷新对应的siderMenu
            const siderMenuItem = prevState.menuData.filter(item => item.jump === location.pathname)
            const siderMenuData = siderMenuItem.length ? siderMenuItem[0].routes : []
            return { siderMenuData }
        }
        return null
    }

    onLogout = () => {
        API.logout().then(result => {
            sessionStorage.removeItem('token')
            this.props.onLogout()
            this.props.history.push('/')
        })
    }

    isFixed = () => {
        const { location, fixedLayout } = this.props
        let fixed = false

        if (fixedLayout.includes(location.pathname)) {
            fixed = true
        }

        if (!fixed) {
            const pathname = location.pathname.split('/')
            pathname[pathname.length -1] = '*'
            if (fixedLayout.includes(pathname.join('/'))) {
                fixed = true
            }
        }

        if (!fixed) {
            const pathname = location.pathname.split('/')
            pathname[pathname.length -2] = '*'
            if (fixedLayout.includes(pathname.join('/'))) {
                fixed = true
            }
        }

        return fixed
    }

    render() {
        const { location, user } = this.props
        const { siderMenuData, menuData } = this.state

        return (
            <Layout className="layout-admin">

                {/* 导航条 */}
                <Header userinfo={user} logout={this.onLogout} location={location} menuData={menuData} />

                <Content className="admin-content">
                    
                    {/* 面包屑 */}
                    <Breadcrumb location={location} menuData={menuData} />
                    
                    <Layout className={this.isFixed() ? 'fixed-layout' : ''}>

                        {/* 侧边导航栏 */}
                        {siderMenuData.length > 0 && <SiderMenu
                            location={location}
                            menuData={siderMenuData}
                        />}

                        <Content>
                            <ErrorBoundary location={location}>
                                <UserContext.Provider value={user}>
                                    {this.props.children}
                                </UserContext.Provider>
                            </ErrorBoundary>
                        </Content>

                    </Layout>
                </Content>

                <Footer>全时系统 ©2018 研发部出品</Footer>
            </Layout>
        )
    }
}

export default LayoutAdmin

