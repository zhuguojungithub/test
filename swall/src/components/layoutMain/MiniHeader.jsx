import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './assets/style.scss'
import logo from '../../assets/logo.png'
import {Icon} from 'antd'

const MiniHeader = () => {
    const token = sessionStorage.getItem('token')
    return (
        <div className="m-menu-box">
            <nav className="menu-nav">
                <NavLink to="/" exact activeClassName="active-nav"><Icon type="home"/><span>首页</span></NavLink>
                <NavLink to="/combo" activeClassName="active-nav"><Icon type="shopping-cart" /><span>精品套餐</span></NavLink>
                <NavLink to="/case" activeClassName="active-nav"><Icon type="dot-chart" /><span>成功案例</span></NavLink>
                <NavLink to={token ? '/admin' : '/login'} activeClassName="active-nav">
                    <Icon type="appstore-o" />
                    <span>{token ? '投放平台' : '投放广告'}</span>
                </NavLink>
            </nav>
        </div>
    )
}

export default MiniHeader