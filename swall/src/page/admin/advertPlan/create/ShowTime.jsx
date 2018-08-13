/**
 * 模块名称: 模块名称
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {TimePicker, Icon, Alert, Button} from 'antd'
import moment from 'moment'

class ShowTimeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start: props.defStart,
            end: props.defEnd,
            error: ''
        }
    }

    componentDidMount() {}

    onChangeStart =(time, timeString) => {
        this.setState({
            start: timeString,
            error: ''
        })
    }

    onChangeEnd = (time, timeString) => {
        this.setState({
            end: timeString,
            error: ''
        })
    }

    onConfirm = () => {
        const {start, end} = this.state

        if (!start && !end) {
            this.setState({
                error: '请设置开始时间和结束时间后再添加'
            })
            return
        }

        if (!start) {
            this.setState({
                error: '请设置开始时间'
            })
            return
        }

        if (!end) {
            this.setState({
                error: '请设置结束时间'
            })
            return
        }

        const [startHour, startMinute] = start.split(':')
        const [endHour, endMinute] = end.split(':')
        if (+endHour < +startHour) {
            this.setState({
                error: '结束时间不能早于开始时间'
            })
            return
        }

        if (+endHour === +startHour && +endMinute <= +startMinute) {
            this.setState({
                error: '结束时间不得早于或等于开始时间'
            })
            return
        }

        const {list} = this.props
        if (list.some(item => item.start === start && item.end === end)) {
            this.setState({
                error: '该时间段已存在！'
            })
            return
        }

        this.props.confirm({
            start: start,
            end: end
        })

        this.setState({
            start: null,
            end: null
        })
    }

    onClose = () => {
        this.setState({
            error: ''
        })
    }

    render() {
        const format = 'HH:mm'
        const {error, start, end} = this.state
        const {cancel, btnName="确认"} = this.props

        return (
            <div className="time-picker-wrap">
                <div className="time-wrap">
                    <TimePicker 
                        value={start ? moment(start, format) : null} 
                        placeholder="开始时间" 
                        onChange={this.onChangeStart} 
                        format={format}
                        minuteStep={30}
                    />
                    <span className="line">——</span>
                    <TimePicker 
                        value={end ? moment(end, format) : null} 
                        placeholder="结束时间" 
                        onChange={this.onChangeEnd} 
                        format={format}
                        minuteStep={30}
                    />
                    <Button onClick={this.onConfirm} className="btn-confirm">{btnName}</Button>
                    {cancel && <Button onClick={()=> cancel()}>取消</Button>}
                </div>
                {error && <div className="ant-form-explain error" onClick={this.onClose}>{error}</div>}
            </div>
        )
    }

}

export default ShowTimeForm