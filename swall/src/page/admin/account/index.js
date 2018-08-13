/**
 * 账号管理
 * xuzhongyuan@372163.com
 */

import React, {Component, Fragment} from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import Register from './register'
import Advert from './advert'
import Manage from './manage'
import './assets/style.scss'
import AdvertDetails from '../customer/details'
import ManageDetails from './manage/Details'

let menuDataTimer

class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    
    componentDidMount() {
        // const {history, match} = this.props
        // console.log('xuzhongyuan@372163.com', this.props)
        // history.push(`${match.url}/register`)
    }

    static getDerivedStateFromProps(nextProps) {
        const { location, match, history } = nextProps
        
        if (location.pathname === match.url) {
            // console.log('nextProps', nextProps)
            let menuData = JSON.parse(localStorage.getItem('menuData'))
            // console.log('menuData', menuData)
            if (!menuData) {
                // 这里先这样处理 以后可改为全局状态
                clearTimeout(menuDataTimer)
                menuDataTimer = setTimeout(() => {
                    menuData = JSON.parse(localStorage.getItem('menuData'))
                    // console.log('menuData2', menuData)
                    if (menuData) {
                        const path = menuData.find(item => item.jump === match.url).routes[0].jump
                        history.push(path)
                    }
                }, 100)
                return null
            }
            const path = menuData.find(item => item.jump === match.url).routes[0].jump
            history.push(path)
        }
        return null
    }

    render() {
        const { match } = this.props
        return (
           <Switch>
                <Route exact path={`${match.url}/advert`} component={Advert} />
                <Route path={`${match.url}/advert/:id`} component={AdvertDetails} />
                <Route path={`${match.url}/register`} component={Register} />
                <Route exact path={`${match.url}/manage`} component={Manage} />
                <Route path={`${match.url}/manage/:id`} component={ManageDetails} />
           </Switch>
        )
    }
}

export default Account