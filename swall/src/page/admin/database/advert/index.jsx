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


class Advert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time:'',
            name:'',
            start:'',
            end:'',
            tableData:[],
            count:'',
            page:1,
            loading: false
        }
        this.onChange = this.onChange.bind(this)
        this.search = this.search.bind(this)
    }

    componentDidMount() {
        this.getDBOAdGroup()
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props
        if (user.user_type !== prevProps.user.user_type && user.user_type !== undefined) {
            this.getDBOAdGroup()
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
        }, () => {
            this.getDBOAdGroup()
        } )
        
    }

    search(val){
        this.setState({
            name:val
        },() => {
            this.getDBOAdGroup()
        })
    }
    
    onChangeTable = (pagination) =>{
        this.setState({
            page:pagination.current
        },() => {
            this.getDBOAdGroup()
        })
    }

    async getDBOAdGroup() {
        const { user } = this.props
        const { time, name, page } = this.state
        let load = Api.getDBOAdGroup
        if (user.user_type === undefined) {
            return
        }
         // 客户端
         else if (user.user_type === 0) {
            load = Api.getClientAdGroupData
        }
        this.setState({
            loading: true
        })
        const dataList = await load('GET' , {time:time , name:name ,page:page})
        this.setState({
            tableData:dataList.list,
            count:dataList.count,
            loading: false
        })
    } 

    render() {
        const { Search } = Input
        const { RangePicker } = DatePicker
        const { Column } = Table
        const { tableData ,count ,time ,name, loading } = this.state
        const { match, user } = this.props
        const exportUrl = `${user.user_type === 0 ? urls.exportClientAdGroupData : urls.exportDBOAdGroupData}?time=${time}&name=${name}&token=${sessionStorage.getItem('token')}`
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
                    rowKey={(record, index) => {
                        return index
                    }}
                    pagination={{
                        defaultPageSize:10,
                        total:count
                    }}
                    onChange = {this.onChangeTable}
                    loading={loading}
                >
                <Column
                    title = "时间"
                    dataIndex = "mdr_date"
                    key = "mdr_date"
                />
                <Column
                    title = "广告"
                    dataIndex = "mag_name"
                    key = "mag_name"
                    render={(mag_name,record) => (
                        <Link to={`${match.path}/${record.mag_id}`}>{mag_name}</Link>
                    )}
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
                />
                <Column
                    title = "广告预算"
                    dataIndex = "mag_daily_budget"
                    key = "mag_daily_budget"
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

export default Advert