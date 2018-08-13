/**
 * 模块名称: 消息管理
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Switch, Route} from 'react-router-dom'

import SystemMessage from './system'
import Logger from './logger'

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        console.log('消息管理', this.props)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { location, match, history } = nextProps
        if (location.pathname === match.url) {
            history.push(`${match.url}/system`)
        }
        return null
    }

    render() {
        const {match} = this.props
        return (
            <Switch>
                <Route path={`${match.path}/system`} component={SystemMessage} />
                <Route path={`${match.path}/logger`} component={Logger} />
            </Switch>
        )
    }
}

export default Message