/**
 * 后台首页入口
 * @author xuzhongyuan@372163.com
 */

import React, {Component, Fragment} from 'react';
import Client from './client'
import Manager from './manager'
import Public from './public'
import './assets/style.scss'

class AdminIndex extends Component {

    componentDidMount() {
        console.log('Admin Index Main ===>', this.props)
    }

    render() {
        switch (this.props.userinfo.user_type) {
            case undefined:
                return <div>加载中...</div>
            case 0:
                return <Client {...this.props} />
            case 3: case 4:
                return <Manager {...this.props} />
            default:
                return <Public {...this.props} />
        }
    }
}

export default AdminIndex