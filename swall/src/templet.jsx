/**
 * react组件样板
 * @author xuzhongyuan@372163.com
 */


/**
 * 无状态组件
 *     1. 不需要使用组件的生命周期
 *     2. 不需要使用内部state
 *     3. 没有什么操作，只用来数据展示
 */


/**
 * 模块名称: 模块名称
 * @author xuzhongyuan@372163.com
 */

import React, { Fragment } from 'react'

const Name = (props) => (
    <div>
        我是一个没有任何脾气的无状态组件，只负责展示
    </div>
)

export default Name


/**
 * 有状态组件
 *     1. 需要使用组件的生命周期
 *     2. 需要使用内部state
 *     3. 有逻辑操作
 */


/**
 * 模块名称: 模块名称
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'

class Name extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {}

    render() {
        return (
            <section>我是一个有状态的组件，常出没在组件的顶层</section>
        )
    }

}

export default Name