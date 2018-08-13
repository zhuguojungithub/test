import React, { Component, Fragment } from 'react'
import { Button, DatePicker, Table } from "antd"
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Api from '../../../../api'
import Urls from '../../../../api/urls'
import "../assets/style.scss"

class AdverterDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'date',
            maid: props.match.params.id,
            time: '',
            month: '',
            data: [],
            page: 1
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.myChart = echarts.init(document.getElementById('echarts'))
        }, 500);
        this.getDBOAdvertiserDetail()
    }

    async getDBOAdvertiserDetail() {
        const { maid, time, month ,page } = this.state
        const data = await Api.getDBOAdvertiserDetail('GET', { maid: maid, time: time, month: month,page:page });
        this.setState({
            data: data
        }, () => {
            setTimeout(() => {

                this.myChart.setOption({
                    title: {
                        text: '推广计划'
                    },
                    legend: {
                        data: "总消耗",
                        show: true,
                        right: 100
                    },
                    tooltip: {
                        show: true
                    },

                    xAxis: {
                        type: 'category',
                        data: data.show_data.label,
                    },
                    yAxis: {
                        type: 'value',
                        name: '总消耗',
                        position: 'left',
                        splitNumber: 5,
                        axisLabel: {
                            formatter: '{value} （次）'
                        },
                        scale: true
                    },
                    series: {
                        name:"总消耗",
                        data: this.state.data.list.map( item => item.mfr_total_cost),
                        type: 'line',
                    }
                    // series: values.map((item, index) => {
                    //     return {
                    //         name: item.name,
                    //         data: item.data,
                    //         type: 'line',
                    //         yAxisIndex: index,
                    //     }
                    // })
                })
            }, 500)
        })
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
                this.getDBOAdvertiserDetail()
            })
        } else if (this.state.type === 'month') {
            this.setState({
                month: dateString,
                time: ''
            }, () => {
                this.getDBOAdvertiserDetail()
            })
        }
    }

    tableChange = (pagination) =>{
        this.setState({
            page: pagination.current
        },() => {
            this.getDBOAdvertiserDetail()
        })
    }

    render() {
        const { type, data, maid, time, month } = this.state
        const { RangePicker, MonthPicker } = DatePicker
        const { Column } = Table
        const exportUrl = `${Urls.exportDBOAdvertiserDetail}?maid=${maid}&time=${time}&month=${month}&token=${sessionStorage.getItem('token')}`
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
                    className='data-table'
                    rowKey={(record,index) =>{
                        return index
                    }}
                    pagination={{
                        pageSize: 10,
                        total: data.connt
                    }}
                    onChange={this.tableChange}
                >
                    <Column
                        title="时间"
                        dataIndex="mfr_date"
                        key="mfr_date"
                    />
                    <Column
                        title="广告主"
                        dataIndex="corp_name"
                        key="corp_name"
                    />
                    <Column
                        title="余额"
                        dataIndex="mfr_remain"
                        key="mfr_remain"
                    />
                    <Column
                        title="总消耗"
                        dataIndex="mfr_total_cost"
                        key="mfr_total_cost"
                    />
                    <Column
                        title="现金消耗"
                        dataIndex="mfr_general_cash"
                        key="mfr_general_cash"
                    />
                    <Column
                        title="虚拟金消耗"
                        dataIndex="mfr_general_gift"
                        key="mfr_general_gift"
                    />
                    <Column
                        title="分成消耗"
                        dataIndex="mfr_general_shared"
                        key="mfr_general_shared"
                    />
                    <Column
                        title="银证消耗"
                        dataIndex="mfr_bank"
                        key="mfr_bank"
                    />
                </Table>
                <div id="echarts" style={{ height: 500, position: 'relative' }}></div>
            </Fragment>
        )
    }
}

export default AdverterDetail