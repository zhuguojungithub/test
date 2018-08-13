/**
 * 模块名称: 投放计划维度
 * @author xuzhongyuan@372163.com
 */

/**
 * 模块名称: 广告维度
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Input, DatePicker, Table ,Button } from 'antd'
import { Link } from "react-router-dom"
import Api from "../../../../api"
import urls from '../../../../api/urls'
import "../assets/style.scss"


class Plan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time:'',
            name:'',
            start:'',
            end:'',
            tableData:[],
            count:'',
            page: 1,
            loading: false
        }
        this.onChange = this.onChange.bind(this)
        this.search = this.search.bind(this)
    }

    componentDidMount() {
        console.log('计划维度', this.props)
        this.getDBOCampaignsData()
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props
        if (user.user_type !== prevProps.user.user_type && user.user_type !== undefined) {
            this.getDBOCampaignsData()
        }
    }

    onChange(date,dateString) {
        let a;
        if(dateString[0] !== ""){
            a = {
                start:dateString[0],
                end:dateString[1]
            }
            a = JSON.stringify(a)
        }else{
            a=""
        }
        this.setState({
            time:a
        },() => {
            this.getDBOCampaignsData()
        } )
        
    }

    search(val){
        this.setState({
            name:val
        },() => {
            this.getDBOCampaignsData()
        })
    }
    

    async getDBOCampaignsData() {
        const { user } = this.props

        let load = Api.getDBOCampaignsData
        if (user.user_type === undefined) {
            return
        }
        // 客户端
        else if (user.user_type === 0) {
            load = Api.getClientCampaignsData
        }
        this.setState({
            loading: true
        })
        const { time, name, page } = this.state
        const dataList = await load('GET', { time, name, page })
        this.setState({
            tableData: dataList.list,
            count: dataList.count,
            loading: false
        })
    } 

    tableChange = (pagination) => {
        this.setState({
            page:pagination.current
        },() => {
            this.getDBOCampaignsData()
        })
    }
    render() {
        const { Search } = Input
        const { RangePicker } = DatePicker
        const { Column } = Table
        const { tableData, count, time, name, loading } = this.state
        const { match, user } = this.props

        const exportUrl = `${user.user_type === 0
            ? urls.exportClientCampaignsData
            : urls.exportDBOCampaignsData}?time=${time}&name=${name}&token=${sessionStorage.getItem('token')}`

        return (
            <Fragment>
                <div className="adver"> 
                    <div className="select-box">
                        <Search
                            placeholder="请输入广告主名称、广告名、投放计划"
                            onSearch={this.search}
                            enterButton
                            style={{ width: 350 }}
                        />
                        <RangePicker onChange={this.onChange} />
                    </div>
                    <a target="_blank" href={exportUrl} >导出</a>
                </div>
                <Table 
                    className="data-table" 
                    dataSource={tableData}
                    rowKey={(record,index) => {
                        return index
                    }}
                    pagination={{
                        defaultPageSize:10,
                        total:count
                    }}
                    onChange={this.tableChange}
                    loading={loading}
                >
                <Column
                    title = "时间"
                    dataIndex = "mdr_date"
                    key = "mdr_date"
                />
                <Column
                    title = "广告主"
                    dataIndex = "ma_corp_name"
                    key = "ma_corp_name"
                />
                 <Column
                    title = "投放计划"
                    dataIndex = "mc_campaign_name"
                    key = "mc_campaign_name"
                    render = {(mc_campaign_name,record,index) => 
                        <Link to={`${match.path}/${record.mc_id}`}>{mc_campaign_name}</Link>   
                    }
                />
                <Column
                    title = "推广目标"
                    dataIndex = "mc_product_type"
                    key = "mc_product_type"
                />
                <Column
                    title = "购买方式"
                    dataIndex = "mc_buy_type"
                    key = "mc_buy_type"
                />
                <Column
                    title = "广告位"
                    dataIndex = "mc_campaign_type"
                    key = "mc_campaign_type"
                />
                <Column
                    title = "花费"
                    dataIndex = "cost"
                    key = "cost"
                />
                <Column
                    title = "曝光次数"
                    dataIndex = "impression"
                    key = "impression"
                />
                <Column
                    title = "点击次数"
                    dataIndex = "click"
                    key = "click"
                />
                <Column
                    title = "点击率"
                    dataIndex = "click_rate"
                    key = "click_rate"
                />

                <Column
                    title = "转化指标"
                    dataIndex = "conversion"
                    key = "conversion"
                />
                <Column
                    title = "转化成本"
                    dataIndex = "conversion_cost"
                    key = "conversion_cost"
                />
                 </Table>
            </Fragment>
        )
    }
}


export default Plan