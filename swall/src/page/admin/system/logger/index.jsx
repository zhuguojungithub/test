/**
 * 模块名称: 日志管理
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Switch, Route} from 'react-router-dom'

import Login from './Login'
import Operate from './Operate'

class Logger extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { location, match, history } = nextProps
        if (location.pathname === match.url) {
            history.push(`${match.url}/operate`)
        }
        return null
    }

    componentDidMount() {}

    render() {
        const {match} = this.props
        return (
            <Switch>
                <Route path={`${match.path}/login`} component={Login} />
                <Route path={`${match.path}/operate`} component={Operate} />
            </Switch>
        )
    }
}

export default Logger