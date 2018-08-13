/**
 * 模块名称: 首页 客户和运营共用
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'
import {Link} from 'react-router-dom'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

class Governor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            adCount: 0,
            allConsumeCount: 0,
            monthConsumeCount: 0,
            yData: {},
        }
    }

    componentDidMount() {
        if (this.props.from === 'client') {
            this.getClientData()
        } else {
            this.getManagerData()
        }
    }

    async getManagerData() {
        const data = await API.getManagerIndexData(true)
        this.setState({
            list: data.advertiserData,
            adCount: data.ad_count,
            allConsumeCount: data.month_cost,
            monthConsumeCount: data.total_cost,
            yData: data.yesterday
        })
        this.renderGraphics(data.show_data)
    }

    async getClientData() {
        const data = await API.getClientIndexData(true)
        this.setState({
            list: data.campaigns,
            adCount: data.ad_count,
            allConsumeCount: data.month_cost,
            monthConsumeCount: data.total_cost,
            yData: data.yesterday
        })
        this.renderGraphics(data.show_data)
    }

    renderGraphics = (data) => {
        if (data.length === 0) return
        const graphics = echarts.init(document.getElementById('graphicsBox'))
        graphics.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: data.values.map(item => item.name)
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.label
            },
            yAxis: {
                type: 'value'
            },
            series: data.values.map(item => ({
                name: item.name,
                type:'line',
                stack: '总量',
                data: item.data
            }))
        })
    }

    renderAdverterList(item) {
        return (
            <li key={item.ma_id}>
                <Link to={`/admin/customer/${item.ma_id}`}>{item.ma_corp_name}</Link>
                <span>{item.create_time.split(' ')[0]}</span>
            </li>
        )
    }

    renderPlanList(item) {
        return (
            <li key={item.mc_id}>
                <Link to={`/admin/planList/${item.mc_id}`}>{item.mc_campaign_name}</Link>
                <span>{item.create_time.split(' ')[0]}</span>
            </li>
        )
    }

    render() {
        const { list, adCount, allConsumeCount, monthConsumeCount, yData} = this.state
        const isClient = this.props.from === 'client'

        return (
            <section className="main-manager">
                <div className="content-box">
                    <div className="new-adverter">
                        <h4 className="title">{isClient ? '最新广告计划' : '最新广告主'}</h4>
                        <ul className="adverter-list">
                            {list.map(item => isClient ? this.renderPlanList(item) : this.renderAdverterList(item))}
                        </ul>
                        {list.length >= 5 && <div className="show-all"><Link to={`/admin/${isClient ? 'planList' : 'customer'}`}>查看更多</Link></div>}
                    </div>
                    <div className="base-info">
                        <div className="base-item">
                            <h4 className="title">投放中的广告总数</h4>
                            <span>{adCount}</span>
                        </div>
                        <div className="base-item">
                            <h4 className="title">总消耗</h4>
                            <span>￥{allConsumeCount}</span>
                        </div>
                        <div className="base-item">
                            <h4 className="title">当月总消耗</h4>
                            <div className="month-consume">
                                <span>￥{monthConsumeCount}</span>
                                <span>昨日消耗：￥{yData.cost}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="graphics-data">
                    <h4 className="title">投放数据</h4>
                    <div id="graphicsBox" style={{height: 400}}></div>
                </div>
            </section>
        )
    }

}

export default Governor