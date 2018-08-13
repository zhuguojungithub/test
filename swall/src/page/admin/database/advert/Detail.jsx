import React, { Component, Fragment } from 'react'
import { Table, DatePicker, Button } from "antd"
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Api from "../../../../api"
import Urls from "../../../../api/urls"
import "../assets/style.scss"


class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: '',
            ad_group_id: props.match.params.id,
            data: [],
            page: 1
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.myChart = echarts.init(document.getElementById('echarts'))
        }, 500);
        this.getDBOAdGroupDetail()
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props
        if (user.user_type !== prevProps.user.user_type && user.user_type !== undefined) {
            this.getDBOAdGroupDetail()
        }
    }

    async getDBOAdGroupDetail() {
        const { user } = this.props
        const { time, ad_group_id, page } = this.state
        let load = Api.getDBOAdGroupDetail
        if (user.user_type === undefined) {
            return
        }
        // 客户端
        else if (user.user_type === 0) {
            load = Api.getClientAdGroupDetail
        }
        const data = await load('GET', { time: time, ad_group_id: ad_group_id ,page: page }, true)
        this.setState({
            data: data
        }, () => {
            let { values } = data.show_data
            setTimeout(() => {
                this.myChart.setOption({
                    title: {
                        text: '广告维度'
                    },
                    legend: {
                        data: data.show_data.length === 0 ? [] : values.map(item => item.name),
                        show: true,
                        right: 100
                    },
                    tooltip: {
                        show: true
                    },

                    xAxis: {
                        type: 'category',
                        data: data.show_data.length === 0 ? [] : data.show_data.label,
                    },
                    yAxis: [

                        {
                            type: 'value',
                            name: '曝光量',
                            position: 'left',
                            splitNumber: 5,
                            axisLabel: {
                                formatter: '{value} （次）'
                            },
                            scale: true
                        },
                        {
                            type: 'value',
                            name: '点击量',
                            position: 'right',
                            splitNumber: 5,
                            axisLabel: {
                                formatter: '{value} （次）'
                            },
                            scale: true
                        }
                    ],
                    series: data.show_data.length === 0 ?
                        [
                            {
                                name: "",
                                data: [],
                                type: 'line',
                                yAxisIndex: 0
                            },
                            {
                                name: "",
                                data: [],
                                type: 'line',
                                yAxisIndex: 1
                            }
                        ] :
                        values.map((item, index) => {
                            return {
                                name: item.name,
                                data: item.data,
                                type: 'line',
                                yAxisIndex: index,
                            }
                        })
                })
            }, 500)
        }
        )
    }

    timeChange = (date, dateString) => {
        this.setState({
            time: dateString
        }, () => {
            this.getDBOAdGroupDetail()
        })
    }

    tableChange = (pagination) => {
        this.setState({
            page: pagination.current
        },() =>{
            this.getDBOAdGroupDetail()
        })
    }

    render() {
        const { data, time, ad_group_id } = this.state
        const { Column } = Table
        const { RangePicker } = DatePicker
        const { user } = this.props
        const exportUrl = `${user.user_type === 0
            ? Urls.exportClientAdGroupDetail
            : Urls.exportDBOAdGroupDetail}?time=${time}&ad_group_id=${ad_group_id}&token=${sessionStorage.getItem('token')}`
        
        return (
            <Fragment>
                <div className="adver">
                    <DatePicker onChange={this.timeChange} />
                    <a href={exportUrl}>导出</a>
                </div>
                <Table
                    className="data-table"
                    dataSource={data.list}
                    rowKey={ (record, index) =>{
                        return index
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        total: data.count
                    }}
                    onChange = {this.tableChange}
                >
                    <Column
                        title="时间"
                        dataIndex="mdr_date"
                        key="mdr_date"
                    />
                    <Column
                        title="广告"
                        dataIndex="mag_name"
                        key="mag_name"
                    />
                    <Column
                        title="广告主"
                        dataIndex="ma_corp_name"
                        key="ma_corp_name"
                    />
                    <Column
                        title="投放计划"
                        dataIndex="mc_campaign_name"
                        key="mc_campaign_name"
                    />
                    <Column
                        title="广告预算"
                        dataIndex="mag_daily_budget"
                        key="mag_daily_budget"
                    />
                    <Column
                        title="花费"
                        dataIndex="cost"
                        key="cost"
                    />
                    <Column
                        title="曝光次数"
                        dataIndex="impression"
                        key="impression"
                    />
                    <Column
                        title="点击次数"
                        dataIndex="click"
                        key="click"
                    />
                    <Column
                        title="点击率"
                        dataIndex="click_rate"
                        key="click_rate"
                    />

                    <Column
                        title="转化指标"
                        dataIndex="conversion"
                        key="conversion"
                    />
                    <Column
                        title="转化成本"
                        dataIndex="conversion_cost"
                        key="conversion_cost"
                    />
                </Table>
                <div id="echarts" style={{ height: 500, position: 'relative' }}></div>
            </Fragment>
        )
    }
}

export default Details