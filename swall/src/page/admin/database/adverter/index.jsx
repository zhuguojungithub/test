/**
 * 模块名称: 广告主维度
 * @author 
 */


import React, { Component, Fragment } from 'react'
import { Input, DatePicker, Table ,Button } from 'antd'
import { Link } from "react-router-dom"
import Api from "../../../../api"
import Urls from "../../../../api/urls"
import "../assets/style.scss"


class Adverter extends Component {
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
        this.getDBOAdvertiserData()
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
            this.getDBOAdvertiserData()
        } )
        
    }

    search(val){
        this.setState({
            name:val
        },() => {
            this.getDBOAdvertiserData()
        })
    }
    

    async getDBOAdvertiserData() {
        const { time, name,page } = this.state
        const dataList = await Api.getDBOAdvertiserData('GET' , {time:time , name:name, page:page })
        this.setState({
            loading: true
        })
        this.setState({
            tableData:dataList.list,
            count:dataList.count,
            loading: false
        })
    } 

    tableChange = (pagination) =>{
        this.setState({
            page:pagination.current
        },() => {
            this.getDBOAdvertiserData()
        })
    }
    render() {
        const { Search } = Input
        const { RangePicker } = DatePicker
        const { Column } = Table
        const { tableData ,count ,time ,name, loading } = this.state
        const { match } = this.props
        const exportUrl = `${Urls.exportDBOAdvertiserData}?time=${time}&name=${name}&token=${sessionStorage.getItem('token')}`
        return (
            <Fragment>
                <div className="adver"> 
                    <div className="select-box">
                        <Search
                            placeholder="请输入广告主名称或者原始id"
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
                    dataIndex = "mfr_date"
                    key = "mfr_date"
                />
                <Column
                    title = "广告主"
                    dataIndex = "corp_name"
                    key = "corp_name"
                    render={(corp_name,record) => (
                        <Link to={`${match.path}/${record.mfr_maid}`}>{corp_name}</Link>
                    )}
                />
                <Column
                    title = "余额"
                    dataIndex = "mfr_remain"
                    key = "mfr_remain"
                />
                <Column
                    title = "总消耗"
                    dataIndex = "mfr_total_cost"
                    key = "mfr_total_cost"
                />
                <Column
                    title = "现金消耗"
                    dataIndex = "mfr_general_cash"
                    key = "mfr_general_cash"
                />
                <Column
                    title = "虚拟金消耗"
                    dataIndex = "mfr_general_gift"
                    key = "mfr_general_gift"
                />
                <Column
                    title = "分成消耗"
                    dataIndex = "mfr_general_shared"
                    key = "mfr_general_shared"
                />
                <Column
                    title = "银证消耗"
                    dataIndex = "mfr_bank"
                    key = "mfr_bank"
                />
                 </Table>
            </Fragment>
        )
    }
}



export default Adverter