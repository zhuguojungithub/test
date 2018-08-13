import React, { Component, Fragment } from 'react'
import { Button, DatePicker, Table } from "antd"
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Api from '../../../../api'
import urls from '../../../../api/urls'
import "../assets/style.scss"

class PlanDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'date',
            mcid: props.match.params.id,
            time: '',
            month: '',
            data: [],
            show_data: {},
            page: 1
        }
        this.myChart = null
    }
    componentDidMount() {
        console.log('计划详情', this.props)
        setTimeout(() => {
            this.myChart = echarts.init(document.getElementById('echarts'))
        }, 500);
        this.getDBOCampaignsDetail()

    }

    componentDidUpdate(prevProps) {
        const { user } = this.props
        if (user.user_type !== prevProps.user.user_type && user.user_type !== undefined) {
            this.getDBOCampaignsDetail()
        }
    }

    async getDBOCampaignsDetail() {
        const { user } = this.props
        const { mcid, time, month, page } = this.state
        let load = Api.getDBOCampaignsDetail
        if (user.user_type === undefined) {
            return
        }
        // 客户端
        else if (user.user_type === 0) {
            load = Api.getClientCampaignsDetail
        }

        const data = await load('GET', { mcid, time, month, page });
        this.setState({
            data: data,
            show_data: data.show_data
        }, () => {
            let {values} = data.show_data
            setTimeout(() => {

                this.myChart.setOption({
                    title: {
                        text: '推广计划'
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
                        data:data.show_data.length === 0 ? [] : this.state.show_data.label,
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
                    series:data.show_data.length === 0 ? 
                    [
                        {
                            data: [],
                            yAxisIndex: 0
                        },
                        {
                            data: [],
                            yAxisIndex: 1
                        }
                    ]       
                    :
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
    typeSelect(types) {
        this.setState({
            type: types
        })
    }


    timeChange = (date, dateString) => {
        if (this.state.type === 'date') {
            let times;
            if (dateString[0] !== '') {
                times = {
                    start: dateString[0],
                    end: dateString[1]
                }
                times = JSON.stringify(times)
            } else {
                times = ''
            }

            this.setState({
                time: times,
                month: ''
            }, () => {
                this.getDBOCampaignsDetail()
            })
        } else if (this.state.type === 'month') {
            this.setState({
                month: dateString,
                time: ''
            }, () => {
                this.getDBOCampaignsDetail()
            })
        }
    }

    tableChange = (pagination) =>{
        this.setState({
            page:pagination.current
        },() => {
            this.getDBOCampaignsDetail()
        })
    }

    render() {
        const { type, data, maid, time, month } = this.state
        const { RangePicker, MonthPicker } = DatePicker
        const { Column } = Table
        const { user } = this.props

        const exportUrl = `${user.user_type === 0
            ? urls.exportClientCampaignsDetail
            : urls.exportDBOCampaignsDetail}?maid=${maid}&time=${time}&month=${month}&token=${sessionStorage.getItem('token')}`

        return (
            <Fragment>
                <div className="adver">
                    <div className="option-box">
                        <div className="option-type">
                            <Button onClick={this.typeSelect.bind(this, 'date')}>按日期</Button>
                            <Button onClick={this.typeSelect.bind(this, 'month')}>按月份</Button>
                        </div>
                        <div className="search-boxes">
                            {
                                (type === 'date' ?
                                    <RangePicker size="large" onChange={this.timeChange} /> :
                                    <MonthPicker size="large" onChange={this.timeChange} />
                                )
                            }
                        </div>
                    </div>
                    <a href={exportUrl}>导出</a>
                </div>
                <Table
                    dataSource={data.list}
                    rowKey={(record,index) => {
                        return index
                    }}
                    className="data-table"
                    pagination={{
                        pageSize: 10,
                        total: data.connt
                    }}
                    onChange = {this.tableChange}
                >
                    <Column
                        title="时间"
                        dataIndex="mdr_date"
                        key="mdr_date"
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
                        title="推广目标"
                        dataIndex="mc_product_type"
                        key="mc_product_type"
                    />
                    <Column
                        title="购买方式"
                        dataIndex="mc_buy_type"
                        key="mc_buy_type"
                    />
                    <Column
                        title="广告位"
                        dataIndex="mc_campaign_type"
                        key="mc_campaign_type"
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


export default PlanDetail