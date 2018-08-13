import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'

import jrzj from '../../assets/images/jrzj-logo.jpg'
import dz from '../../assets/images/dz-logo.jpg'
import mlyh from '../../assets/images/mlyh-logo.jpg'
import hhg from '../../assets/images/hhg-logo.jpg'

class StandList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        const data = [{
            id: 'jrzj',
            title: '居然之家',
            content: '带动顾客到店消费，提高实际转化率。利用微信朋友圈广告本地推广，吸引目标潜在用户关注居然之家的大型优惠促销活动，创建一个对家居设计及装修有需求或者感兴趣的线上客户资料群，通过分享以及互动，发掘目标客户、推动销售预约。',
            img: jrzj,
        }, {
            id: 'shdz',
            title: '上海大众',
            content: '推广公众号，为公众号增加粉丝；推广品牌活动，吸引客户到店。本次微信朋友圈广告投放，主要的营销痛点在于，如何精准捕捉目标用户，提升关注率和到店率。',
            img: dz,
        }, {
            id: 'mlyh',
            title: '麻辣诱惑',
            content: '门店新装升级盛大开业，提高到店率。希望通过投放本地推广广告，增强消费者对其门店地理位置的感知，拉近与消费者之间的距离感。同时，在提高门店知名度的基础上，麻辣诱惑还希望赢得更多消费者的好感，以小龙虾优惠券为契机，从而吸引消费者进店消费，提升转化。打造优质广告外层，拉近与消费者的距离感。',
            img: mlyh,
        }, {
            id: 'hhg',
            title: '花海阁',
            content: '通过投放本地推广广告，增强消费者对其门店地理位置的感知，拉近与消费者之间的距离感。同时，在提高门店知名度的基础上，花海阁婚礼策划还希望赢得更多消费者的好感，从而吸引消费者进店咨询，降低客咨获取成本。',
            img: hhg,
        }]

        this.setState({
            items: data
        })
    }

    componentDidUpdate() {

    }

    render() {
        const { items } = this.state
        return (
            <section className="section-case section">
                <div className="container">
                    <div className="moudle-title">
                        <span>成功案例</span>
                        <div className="lines"></div>
                    </div>
                    <Row gutter={16}>
                        {items.map((item, index) => <Col key={index} md={12} lg={6} className="case-item">
                            <Link className="card-shadow case-link text-center" to={`/case/${item.id}`}>
                                <div className="background-img package-image">
                                    <img src={item.img} />
                                </div>
                                <div className="package-name text-over">{item.title}</div>
                                <div className="package-text">{item.content}</div>
                            </Link>
                        </Col>)}
                    </Row>
                    <div className="btn-wrap">
                        <Link className="index-btn" to="case">全部案例</Link>
                    </div>
                </div>
            </section>
        )
    }
}

export default StandList