/**
 * 模块名称: 广告详情
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import { Link } from 'react-router-dom'

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: null
        }
    }

    componentDidMount() {
        console.log('广告详情 props ===> ', this.props)
        this.getAdvertDetail()

    }

    async getAdvertDetail() {
        const { advertId } = this.props.location.state
        const detail = await API.getAdvertDetail({
            mag_id: advertId
        }, true)
        this.setState({ detail })
    }

    render() {
        const { detail } = this.state
        if (!detail) {
            return <div className="content wrapper">数据加载中...</div>
        }
        return (
            <div className="content wrapper">
                <h2>{detail.mag_name}</h2>
                <div className="advert-detail-wrap">
                    <div className="block">
                        <h4>定向人群</h4>
                        <ul className="items">
                            <li>
                                <span>年龄</span>
                                <p>{detail.age.join('~')}</p>
                            </li>
                            <li>
                                <span>性别</span>
                                <p>{detail.gender}</p>
                            </li>
                            <li>
                                <span>地域</span>
                                <p>{detail.geo_location.join('、')}</p>
                            </li>
                            <li>
                                <span>兴趣</span>
                                <p>{detail.business_interest.join('、')}</p>
                            </li>
                            <li>
                                <span>学历</span>
                                <p>{detail.education.join('、')}</p>
                            </li>
                            <li>
                                <span>婚恋状态</span>
                                <p>{detail.relationship_status.join('、')}</p>
                            </li>
                            <li>
                                <span>操作系统</span>
                                <p>{detail.user_os.join('、')}</p>
                            </li>
                            <li>
                                <span>手机价格</span>
                                <p>{detail.device_price.join('、')}</p>
                            </li>
                            <li>
                                <span>运营商</span>
                                <p>{detail.network_operator.join('、')}</p>
                            </li>
                            <li>
                                <span>联网方式</span>
                                <p>{detail.network_type.join('、')}</p>
                            </li>
                        </ul>
                    </div>

                    <div className="block">
                        <h4>投放时间</h4>
                        <ul className="items">
                            <li>
                                <span>开始 / 结束日期</span>
                                <p>{detail.mag_begin_date} 至 {detail.mag_end_date}</p>
                            </li>
                            <li>
                                <span>展示时间段</span>
                                <ul className="show-list">
                                    {typeof detail.mag_times === 'string' 
                                    ? <li>{detail.mag_times}</li> 
                                    : detail.mag_times.map((item, index) => <li key={index}>{item.start}-{item.end}</li>)}
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className="block">
                        <h4>预算花费</h4>
                        <ul className="items">
                            <li>
                                <span>出价</span>
                                <p>{detail.mag_bid_amount}元/千次曝光</p>
                            </li>
                            <li>
                                <span>每日预算</span>
                                <p>{detail.mag_daily_budget}元/天</p>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        )
    }

}

export default Detail