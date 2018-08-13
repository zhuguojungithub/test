import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './assets/style.scss'
import logo from '../../assets/logo.png'

const HeaderComp = (props) => {
    const token = sessionStorage.getItem('token')
    const { floating, className } = props
    const cls = `header ${floating ? 'floating': ''} ${className?className:''}`
    return (
        <header className={cls}>
            <div className="header-content">
                <h1 className="logo-wrapper"><Link to="/"><img src={logo} width="50" alt="logo" /></Link></h1>
                <ul className="nav">
                    <li><NavLink exact activeClassName="active-link" to="/">首页</NavLink></li>
                    <li><NavLink activeClassName="active-link" to="/combo">精品套餐</NavLink></li>
                    <li><NavLink activeClassName="active-link" to="/case">成功案例</NavLink></li>
                    <li>
                        <NavLink activeClassName="active-link" className="creatad-btn" to={token ? '/admin' : '/login'}>
                            {token ? '投放平台' : '投放广告'}
                        </NavLink>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default HeaderComp