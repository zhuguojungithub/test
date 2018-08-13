/**
 * 模块名称: 通用首页
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import bannerClient from '../assets/public_banner.jpg'
import { Link } from 'react-router-dom'
import API from '../../../../api'
import errorImg from '../../../../assets/images/load_error.png'

class Public extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        this.getSuitList()
    }

    async getSuitList() {
        const items = await API.suitList(true)
        this.setState({ items })
    }

    imageError(e) {
        e.target.src = errorImg
    }

    render() {
        const {items} = this.state
        const {match} = this.props

        return (
            <section className="public-content">
                <div className="banner-wrap"><img src={bannerClient} alt="banner"/></div>
                <div className="product-wrap">
                    <ul className="product-list">
                        {items.map(item=> (
                            <li key={item.tds_id}>
                                <Link to={`${match.path}/product/${item.tds_id}`} className="product-item" title="点击查看套餐详情">
                                    <div className="p-left card-shadow">
                                        <img src={item.image} alt="image" onError={(e) => this.imageError(e)}/>
                                        <span className="price">￥{item.price}</span>
                                    </div>
                                    <div className="p-right">
                                        <h4 className="title">{item.name}</h4>
                                        <p className="desc">{item.desc.length > 50 ? `${item.desc.slice(0, 47)}...`: item.desc}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        )
    }

}

export default Public