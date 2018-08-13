/**
 * 模块名称: 客户首页
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import ManagerIndex from '../manager'

class Fully extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {}

    render() {
        return (
            <ManagerIndex from="client" />
        )
    }
}

export default Fully