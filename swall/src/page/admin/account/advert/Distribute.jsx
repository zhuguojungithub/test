/**
 * 模块名称: 分配客服
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Input, Select, Button, Tag, Icon, message } from 'antd'
import BtnGroup from '../../../../components/btnGroup'
import API from '../../../../api'

const Option = Select.Option

class Distribute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selected: [],
            current: [],
        }
    }

    componentDidMount() {
        this.initValue()
    }

    async initValue() {
        const data = await API.getSelectServices()
        this.setState({
            data: data.list
        })

        // 获取客户的客服
        let selectedData = await API.getSelectServices({
            maids: this.props.ids
        })

        this.setState({
            current: selectedData.list
        })
    }

    onChangeSelect = (value, option) => {
        this.setState(prevStatus =>({
            selected: value
        }))
    }

    onRemoveItem = (id) => {
        API.delSerices('post', {
            maids: this.props.ids,
            oaid: id
        }).then(() => {
            message.success('删除成功', 1.5)
            this.setState(prevStatus => ({
                current: prevStatus.current.filter(item => item.stf_id !== id)
            }))
            this.props.onRemove()
        })
    }

    onConfirmAdd = () => {
        this.props.onAdd({
            maids: this.props.ids,
            oaids: this.state.selected
        })
    }

    render() {
        const { selected, data, current } = this.state
        const { onCancel } = this.props
        console.log(this.state)
        return (
            <div className="distribute-content">
                <div>
                    <h4>已关联客服</h4>
                    <ul className="current-list">
                        {current.map(item => <li key={item.stf_id}>{item.stf_name}<Icon type="delete" onClick={() => this.onRemoveItem(item.stf_id)} /></li>)}
                    </ul>
                </div>
                <div>
                    <h4>分配客服</h4>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="搜索选择客服"
                        onChange={this.onChangeSelect}
                        optionFilterProp="children"
                    >
                        {data.map(item => <Option key={item.stf_id}>{item.stf_name}</Option>)}
                    </Select>
                </div>
                <BtnGroup right cancel={onCancel} confirm={this.onConfirmAdd} />
            </div>
        )
    }

}

export default Distribute