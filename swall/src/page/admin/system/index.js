/**
 * 模块名称: 系统设置
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Switch, Route} from 'react-router-dom'

import Message from './message'
import Logger from './logger'
import Upload from './upload'
import './assets/style.scss'

class System extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { location, match, history } = nextProps
        if (location.pathname === match.url) {
            history.push(`${match.url}/message`)
        }
        return null
    }

    componentDidMount() {
        console.log('系统管理', this.props)
    }

    render() {
        const {match} = this.props
        return (
            <Switch>
                <Route path={`${match.path}/message`} component={Message} />
                <Route path={`${match.path}/logger`} component={Logger} />
                <Route path={`${match.path}/upload`} component={Upload} />
            </Switch>
        )
    }
}

export default System