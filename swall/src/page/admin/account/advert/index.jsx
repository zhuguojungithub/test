/**
 * 模块名称: 广告主管理
 * @author xuzhongyuan@372163.com
 */

import React, {Component} from 'react'
import {Table, Input, Button, Modal, message, Upload, Icon } from 'antd'
import API from '../../../../api'
import urls from '../../../../api/urls'
import {Link} from 'react-router-dom'
import Distribute from './Distribute'

const Search = Input.Search
const { Column } = Table



class Advert extends Component {
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
            currentIds: []
        }
    }

    componentDidMount() {
        this.getClientList()
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
    }

    onTableChange = (pagination, filters) => {
        this.setState({
            page: pagination.current
        }, () => this.getClientList())
    }

    // 单个分配客服
    onDistributeItem = (id) => {
        this.setState({
            showModal: true,
            currentIds: [id]
        })
    }

    onHideModal = () => {
        this.setState({
            showModal: false,
            currentIds: []
        })
    }

    onAddService = (data) => {
        if (data.oaids.length === 0) {
            this.setState({
                showModal: false
            })
            return
        }

        API.addServices('post', data).then(() => {
            this.setState({
                showModal: false,
                currentIds: []
            })
            this.getClientList()
        })
    }

    onRowSelectionChange = (selectedRowKeys) => {
        this.setState({
            currentIds: selectedRowKeys
        })
    }

    onDistributeItems = () => {
        const {currentIds} = this.state
        if (currentIds.length === 0) {
            message.error('请勾选客户后再进行分配')
            return
        }
        this.setState({
            showModal: true
        })
    }

    onRemoveService = (id) => {
        this.getClientList()
    }

    onChangeUpload = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`, 2, () => this.getClientList())
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    }

    render() {
        const {items, loading, count, showModal, currentIds} = this.state
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
                    <Upload 
                        name='file'
                        action={`${urls.uploadAdvert}?token=${sessionStorage.getItem('token')}`}
                        onChange={this.onChangeUpload}
                        showUploadList={false}
                    >
                        <Button>
                            <Icon type="upload" /> 导入广告主
                        </Button>
                    </Upload>
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
                        rowSelection={{
                            onChange: this.onRowSelectionChange,
                            selectedRowKeys: currentIds
                        }}
                    >
                        <Column title="企业名称" key="ma_corp_name" render={(text, record, index) => {
                            return (
                                <Link to={`/admin/account/advert/${record.ma_id}`}>
                                    {record.ma_corp_name}
                                </Link>
                            )
                        }}/>
                        <Column title="操作" key="handle" render={(text, record) => (
                            <Button size="small" onClick={() => this.onDistributeItem(record.ma_id)}>分配客服</Button>
                        )} />
                        <Column title="所属优化师" dataIndex="operation" />
                        <Column title="所属团队" dataIndex="ma_group" />
                        <Column title="所属服务商" render={(text, record) => (
                            <ul style={{marginBottom: 0}}>
                                {record.audit_status.map(item => <li key={item.name}>{item.name}：{item.status}</li>)}
                            </ul>
                        )}/>
                         <Column title="日期" key="create_time" render={(text, record) => record.create_time && record.create_time.split(' ')[0] } />
                         <Column title="一级行业" dataIndex="cate1" />
                         <Column title="二级行业" dataIndex="cate2" />
                         <Column title="地域" dataIndex="ma_area" />
                    </Table>
                    <Button type="primary" className="batch-btn" onClick={this.onDistributeItems}>批量分配</Button>
                </div>
                <Modal
                    title="分配客服"
                    visible={showModal}
                    footer={null}
                    className="distribute-modal"
                    destroyOnClose
                    closable={false}
                >
                    <Distribute onCancel={this.onHideModal} ids={currentIds} onAdd={this.onAddService} onRemove={this.onRemoveService} />
                </Modal>
            </section>
        )
    }
}

export default Advert