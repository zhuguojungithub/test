/**
 * 模块名称: 资质管理 (客户端和运营端共用)
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Button, Table, Popconfirm, Radio, message, Modal} from 'antd'
import API from '../../../../api'
import {getQueryStringArgs, filterHandle} from '../../../../tools/utils'
import './style.scss'
import CreateCredentials from '../components/CreateCredentials'
import Loading from '../../../../components/loading'

const RadioGroup = Radio.Group

class Credentials extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: getQueryStringArgs(props.location.search).uid,
            list: [],
            serviceList: [],
            count: 0,
            showCreatePage: false,
            editItem: null,
            currentPage: 1,
            limit: 8,
            creating: false,
            loading: false,
            fetching: false,
            showSubmitModal: false,
            currentService: null,
            currentItemId: null
        }
    }

    componentDidMount() {
        this.getCredentialsList()
        document.addEventListener('scroll', this.onScrollLoad)
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.onScrollLoad)
    }

    // 客户端 use
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.uid !== prevState.uid && nextProps.uid !== undefined) {
            return { uid: nextProps.uid }
        }
        return null
    }

    // 客户端 use
    componentDidUpdate(prevProps, prevState) {
        if (prevState.uid !== this.state.uid) {
            this.getCredentialsList()
        }
    }

    async getCredentialsList() {
        const {currentPage, uid, limit} = this.state
        if (uid === undefined) return
        this.setState({
            fetching: true
        })
        const data = await API.getCredentialsList({
            maid: uid, 
            page: currentPage, 
            limit
        })
        this.setState(prevState => ({
            list: filterHandle([...prevState.list, ...data.list], 'mc_id'),
            count: data.count,
            fetching: false
        }))
    }

    onScrollLoad = () => {
        const el = document.documentElement
        if (el.scrollHeight === el.scrollTop + el.clientHeight) {
            const { list, count, fetching } = this.state
            if (list.length === count || fetching) return
            this.setState(prevState => ({
                currentPage: prevState.currentPage + 1
            }), () => {
                this.getCredentialsList()
            })
        }
    }

    onCancelCreatePage = () => {
        this.setState({
            showCreatePage: false
        })
    }

    onShowCreatePage = () => {
        this.setState({
            showCreatePage: true,
            editItem: null
        })
    }

    // 新增
    onSubmitCreate = (data) => {
        console.log('submit data ===> ', data)
        this.setState({
            creating: true
        })
        const {uid} = this.state
        API.addCredentials('post', {
            maid: uid,
            name: data.name,
            expiry: data.expired,
            type: data.type,
            image_url: data.image
        }).then(item => {
            message.success('添加成功', 2)
            this.setState(prevState => ({
                showCreatePage: false,
                creating: false,
                count: prevState.count + 1,
                list: [item, ...prevState.list]
            }))
        })
    }

    // 删除
    onRemoveItem = (id) => {
        const {uid} = this.state
        API.removeCredentials('post', {maid: uid, mc_id: id}, true).then(() => {
            message.success('删除成功', 2)
            this.setState(prevState => ({
                list: prevState.list.filter(item => item.mc_id !== id),
                count: prevState.count - 1
            }))
            this.getCredentialsList()
        })
        /* 
            删除bug：
                当在第一页删除某项数据时，删除成功后，执行下拉翻页后，返回的是第二页的数据，而此时会少一条数据（因为这条数据已经属于第一页），以此类推
                解决办法：删除成功后，直接拉取最后一次请求页的数据
        
        */
    }

    async onShowConfirmModal(id) {
        this.setState({
            showSubmitModal: true,
            currentItemId: id
        })
        const {uid, serviceList} = this.state
        if (serviceList.length) {
            const shows = serviceList.filter(item => item.show)
            this.setState({
                currentService: shows.length === 1 ? shows[0].id : null
            })
            return
        }

        const data = await API.getUserService({
            maid: uid
        })
        const shows = data.filter(item => item.show)
        this.setState({
            serviceList: data,
            currentService: shows.length === 1 ? shows[0].id : null
        })
    }

    onCancelSubmit = () => {
        this.setState({
            showSubmitModal: false,
            currentItemId: null
        })
    }

    onChangeService = (e) => {
        this.setState({
            currentService: e.target.value
        })
    }

    // 提交资质
    onSubmitCredentials = () => {
        const {currentService, currentItemId, uid} = this.state
        if (!currentService) {
           return
        }
        API.submitCredentials('post', {
            maid: uid,
            mc_id: currentItemId,
            services_id: currentService
        }).then(() => {
            message.success('提交成功', 2)
            this.setState({
                currentItemId: null,
                showSubmitModal: false
            })
        })
    }

    render() {
        
        const { 
            list,
            showCreatePage, 
            editItem, creating, 
            showSubmitModal, 
            serviceList, 
            currentService, 
            fetching 
        } = this.state

        const lists = []
        for (let i = 0; i < list.length; i++) {
            if (i % 4 === 0) {
                lists.push(list.slice(i, i + 4))
            }
        }

        return (
            <section className="content credentials">
                <div className="mune">
                    <Button type="primary" onClick={this.onShowCreatePage}>新增资质</Button>
                </div>
                {lists.map(item => (
                    <ul className="credentials-list">
                        {item.map(item => (
                            <li key={item.mc_id}>
                                <a target="_blank" href={`/web/${item.image_url}`}>
                                    <img src={item.image_thumb} />
                                </a>
                                <div className="item-content">
                                    <h4>{item.mc_name}</h4>
                                    <div className="tag-list">
                                        <span className="mc-type">{item.mc_type}</span>
                                        <span className="update-time">{item.mc_expiry}</span>
                                    </div>
                                </div>
                                <div className="btn-items">
                                    <Popconfirm
                                        title="确认删除吗？"
                                        onConfirm={() => this.onRemoveItem(item.mc_id)}
                                    >
                                        <button>删除</button>
                                    </Popconfirm>
                                    <button onClick={() => this.onShowConfirmModal(item.mc_id)}>提交</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ))}
                {fetching && <Loading type="ellipsis" />}
                <Modal title="创建资质"
                    visible={showCreatePage}
                    onCancel={this.onCancelCreatePage}
                    footer={null}
                    destroyOnClose
                >
                    <CreateCredentials 
                        formSubmit={this.onSubmitCreate} 
                        loading={creating} 
                        onCancel={this.onCancelCreatePage} 
                        editItem={editItem} 
                    />
                </Modal>
                <Modal title="提交资质"
                    visible={showSubmitModal}
                    onOk={this.onSubmitCredentials}
                    onCancel={this.onCancelSubmit}
                    destroyOnClose
                    bodyStyle={{minHeight: 200}}
                >
                    <h4>请选择服务商</h4>
                    <RadioGroup value={currentService} onChange={this.onChangeService}>
                        {serviceList.map(item => (
                            <Radio key={item.id} value={item.id} disabled={!item.show}>
                                腾讯社交广告（{item.name}）
                            </Radio>
                        ))}
                    </RadioGroup>
                </Modal>
            </section>
        )
    }
}

export default Credentials