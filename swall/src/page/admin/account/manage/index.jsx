/**
 * 模块名称: 广告主管理
 * @author xuzhongyuan@372163.com
 */

import React, {Component} from 'react'
import { Table, Input, Button, Modal, message, Icon, Radio } from 'antd'
import API from '../../../../api'
import urls from '../../../../api/urls'
import {Link} from 'react-router-dom'

const Search = Input.Search
const { Column } = Table
const RadioGroup = Radio.Group

class Manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            count: 0,
            loading: false,
            search: '',
            page: 1,
            limit: 10,
            showModal: false,
            services: [],
            checkedService: '',
            currentAdvert: ''
        }
    }

    componentDidMount() {
        this.getClientList()
        console.log('开户管理', this.props)
    }

    onSearchUser = (value) => {
        this.setState({
            search: value
        }, () => {
            this.getClientList()
        })
    }

    // 获取列表
    async getClientList() {
        this.setState({
            loading: true
        })
        const {page, search} = this.state
        const data = await API.getCustomer({page, name: search})
        this.setState({
            items: data.list,
            count: data.count,
            loading: false
        })
        const services = await API.getService()
        this.setState({
            services
        })
    }

    onTableChange = (pagination, filters) => {
        this.setState({
            page: pagination.current
        }, () => this.getClientList())
    }

    onHideModal = () => {
        this.setState({
            showModal: false,
            checkedService: ''
        })
    }

    onEstablish = (id) => {
        this.setState({
            showModal: true,
            currentAdvert: id
        })
    }

    onSelectService = (e) => {
        this.setState({
            checkedService: e.target.value
        })
    }

    // 开户
    onSubmitOpen = () => {
        const {checkedService, currentAdvert} = this.state
        if (!checkedService) {
            return
        }
        API.openAccount('post', {
            maid: currentAdvert,
            services_id: checkedService
        }).then(() => {
            message.success('提交成功', 2)
            this.setState({
                showModal: false,
                checkedService: ''
            })
            this.getClientList()
        })
    }

    render() {
        const {items, loading, count, showModal, services} = this.state
        const {match} = this.props
        return (
            <section className="advert-content">
                <div className="advert-bar">
                    <Search
                        placeholder="搜索"
                        enterButton
                        style={{ width: 400 }}
                        size="large"
                        onSearch={value => this.onSearchUser(value)}
                    />
                </div>
                <div className="advert-list">
                    <Table 
                        dataSource={items}
                        loading={loading}
                        rowKey="ma_id"
                        locale={{emptyText: '暂无数据'}}
                        className="customer-list"
                        scroll={{x: 1300 }}
                        pagination={{
                            defaultPageSize: 10,
                            total: count
                        }}
                        onChange={this.onTableChange}
                    >
                        <Column title="企业名称" key="ma_corp_name" render={(text, record, index) => {
                            return (
                                <Link to={`${match.path}/${record.ma_id}`}>
                                    {record.ma_corp_name}
                                </Link>
                            )
                        }}/>
                        <Column title="操作" key="handle" render={(text, record) => (
                            <Button size="small" onClick={() => this.onEstablish(record.ma_id)}>开户</Button>
                        )} />
                        <Column title="审核状态" render={(text, record) => (
                            <ul style={{marginBottom: 0}}>
                                {record.audit_status.map(item => <li key={item.name}>{item.name}：{item.status}</li>)}
                            </ul>
                        )}/>
                         <Column title="日期" key="create_time" render={(text, record) => record.create_time && record.create_time.split(' ')[0] } />
                         <Column title="一级行业" dataIndex="cate1" />
                         <Column title="二级行业" dataIndex="cate2" />
                         <Column title="地域" dataIndex="ma_area" />
                    </Table>
                </div>
                <Modal
                    title="开户"
                    visible={showModal}
                    className="manage-modal"
                    destroyOnClose
                    onCancel={this.onHideModal}
                    onOk={this.onSubmitOpen}
                >
                    <RadioGroup onChange={this.onSelectService}>
                        {services.map(item => <Radio value={item.id} key={item.id}>{item.name}</Radio>)}
                    </RadioGroup>
                </Modal>
            </section>
        )
    }
}

export default Manage