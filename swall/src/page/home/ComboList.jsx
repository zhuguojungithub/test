import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import api from '../../api'


class PackageList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        this.getSuitList({
            count: 3
        })
    }

    componentDidUpdate() {

    }

    // 异步函数
    async getSuitList(query) {
        const data = await api.suitList(query, true)
        this.setState({
            items: data
        })
    }

    render() {
        const { items } = this.state
        return (

            <section className="section-package section">
                <div className="container">
                    <div className="moudle-title">
                        <span>精品套餐</span>
                        <div className="lines"></div>
                    </div>
                    <Row>
                        {items.map((item, index) => (
                            <Col key={item.tds_id} md={12} lg={8} className="package-item">
                                <div className="card-shadow text-center">
                                    <Link to={`/combo#${item.tds_id}`}>
                                        <div className="background-img package-image">
                                            <img src={item.image} />
                                        </div>
                                        <div className="package-value">
                                            <div className="package-name text-over">{item.name}</div>
                                            <div className="package-price text-over">￥{item.price}</div>
                                        </div>
                                    </Link>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="btn-wrap">
                        <Link className="index-btn" to="combo">全部套餐</Link>
                    </div>
                </div>
            </section>
        )
    }
}

export default PackageList