/**
 * 侧栏导航
 */

import React, { Component, Fragment } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
const { SubMenu } = Menu
const { Sider } = Layout

class SiderMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultOpenKeys: []
        }
    }

    componentDidMount() {
        this.setDefaultOpenKeys()
    }

    componentDidUpdate(prevProps) {
        // console.log('p', prevProps)
        // console.log('t', this.props)
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setDefaultOpenKeys()
        }
    }

    siderMenuRender(data) {
        // 递归渲染侧栏导航
        return data.map(item => item.routes.length ?
            <SubMenu key={item.jump} data-key={item.jump} title={item.title}>
                {this.siderMenuRender(item.routes)}
            </SubMenu>
            :
            <Menu.Item key={item.jump}><Link to={item.jump}>{item.title}</Link></Menu.Item>
        )
    }

    setDefaultOpenKeys = () => {
        const { pathname } = this.props.location
        const defaultOpenKeys = []
        let index = pathname.indexOf('/', 1)
        while (index !== -1) {
            defaultOpenKeys.push(pathname.slice(0, index))
            index = pathname.indexOf('/', index + 1)
        }
        this.setState({
            defaultOpenKeys
        })
    }

    onClickMenu = (openKeys) => {
        this.setState({
            defaultOpenKeys: openKeys
        })
    }

    render() {
        const {location, menuData} = this.props
        const {defaultOpenKeys} = this.state
        // console.log('defaultOpenKeys', defaultOpenKeys)

        return (
            <Sider width={200}>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    openKeys={defaultOpenKeys}
                    onOpenChange={this.onClickMenu}
                >
                    {this.siderMenuRender(menuData)}
                </Menu>
            </Sider>
        )
    }
}

export default SiderMenu