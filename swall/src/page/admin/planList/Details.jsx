/**
 * 模块名称: 广告计划详情
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import PlanDetails from '../advertPlan/detail'

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {}

    render() {
        return (
            <section>
                <PlanDetails {...this.props} />
            </section>
        )
    }

}

export default Details