/**
 * 模块名称: 客户首页入口
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Button, Modal, Form, Input } from 'antd'
import Fully from './Fully'
import Simple from './Simple'

const FormItem = Form.Item

class Client extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        // console.log('index', this.props)
    }

    render() {
        const { userinfo } = this.props
        return (
            <section className="main-client">
                {userinfo.hasOwnProperty('hasAdvertiser') 
                ? userinfo.hasAdvertiser === 1 ? <Fully {...this.props} /> : <Simple {...this.props} />
                : null}
            </section>
        )
    }
}

export default Client