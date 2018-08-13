import React, { Component } from 'react'
import './assets/style.scss'

class Business extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        const {items} = this.props
        return (
            <section className="business-content">
                <h1 className="title">充值记录</h1>
                <div>内容</div>
            </section>
        )
    }
}

export default Business