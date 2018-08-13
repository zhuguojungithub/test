import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import Flickity from 'flickity'
import * as uitls from '../../tools/utils'

import advantage_a from './assets/images/advantage-a.png'
import advantage_b from './assets/images/advantage-b.png'
import advantage_c from './assets/images/advantage-c.png'
import advantage_d from './assets/images/advantage-d.png'
import advantage_e from './assets/images/advantage-e.png'

class StandList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        const data = [{
            title: '海量优质资源',
            content: '拥有完整的媒体矩阵，囊括腾讯社交媒体独家资源，覆盖移动端十亿用户！',
            img: advantage_a,
        }, {
            title: '广告量身定制',
            content: '为您量身定制原生广告，拒绝千篇一律，让您的广告独具创意！',
            img: advantage_b,
        }, {
            title: '精准定向标签',
            content: '精准的用户定向标签，让你的广告随时随地触达目标人群！',
            img: advantage_c,
        }, {
            title: '自助投放广告',
            content: '操作简单方便，从广告投放到效果分析，为您带来一站式全新服务体验！',
            img: advantage_d,
        }, {
            title: '十五年服务经验',
            content: '十五年专业互联网营销推广经验，资深优化师一对一为您服务！',
            img: advantage_e,
        }]

        this.setState({
            items: data
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const  {items } = this.state
        if (uitls.isMobile() && items.length && items.length !== prevState.items.length) {
            this.flkty = new Flickity(this.refs.carousel, {
                wrapAround: true,
                imagesLoaded: true,
                prevNextButtons: false,
                pageDots: false,
                selectedAttraction: 0.02
            })
        }
    }

    render() {
        const { items } = this.state
        return (
            <section className="section-stand section">
                <div className="container">
                    <div className="moudle-title">
                        <span>平台优势</span>
                        <div className="lines"></div>
                    </div>
                    <div className="row-wrap" ref="carousel">
                        {items.map((item, index) => <div key={index} className="row-item carousel-cell">
                            <div className="img-box">
                                <img src={item.img} />
                            </div>
                            <h4>{item.title}</h4>
                            <p>{item.content}</p>
                        </div>)}
                    </div>
                    <div className="btn-wrap">
                        <Link className="index-btn" to="/login/register">试用注册</Link>
                    </div>
                </div>
            </section>
        )
    }
}

export default StandList