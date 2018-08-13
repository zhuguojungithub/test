/**
 * 模块名称: 创建广告计划
 * @author xuzhongyuan@372163.com
 */

import React, { Component } from 'react'
import { Form, Input } from 'antd'
import BtnGroup from '../../../../components/btnGroup'
import API from '../../../../api'
import {getQueryStringArgs, intoError} from '../../../../tools/utils'
import Card from './Card'

const FormItem = Form.Item

class Plan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            planName: '',
            target: {
                title: '推广目标',
                detail: '选择广告推广目标，实现营销目标',
                items: [],
                error: ''
            },
            position: {
                title: '广告位',
                detail: '广告展现的位置',
                items: [],
                error: ''
            },
            pattern: {
                title: '购买方式',
                detail: '目前仅支持竞价广告投放',
                items: [],
                error: ''
            },
            service: {
                title: '所属服务商',
                detail: '选择所属服务商',
                items: [],
                error: ''
            },
            filter: {
                c_type: null,
                p_type: null,
                b_type: null,
                s_type: null
            },
            shopInput: {
                showInput: false,
                inputValue: ''
            },
            errMsg: {
                adName: '',
                shopName: ''
            }
        }
        this.targetCard = React.createRef();
    }

    componentDidMount() {
        console.log('create plan props ===> ', this.props)
        if (this.props.location.state.planId !== undefined) {
            // 修改
            this.initData()
        } 
        else {
            // 新增
            this.getService()
            this.getData()
        }
    }

    async initData() {
        await this.getService()
        await this.getData()
        this.getPlanDetail()
    }

    // 修改数据
    async getPlanDetail() {
        const result = await API.getPlanDetail({
            c_id: this.props.location.state.planId
        }, true)
        this.setState({
            planName: result.mc_campaign_name,
            filter: {
                p_type: result.mc_product_type,
                c_type: result.mc_campaign_type,
                b_type: result.mc_buy_type,
                s_type: result.mc_services
            },
            shopInput: {
                showInput: result.mc_product_type === 'PRODUCT_TYPE_LBS_WECHAT',
                inputValue: result.mc_mpid
            }
        })
    }

    async getData() {
        // plan（推广目标）place（广告位）pay_type（购买方式）
        const {plan, place, pay_type } = await API.getCampaignsBaseData(true)
        const showPlan = plan.filter(item => item.show)
        const showPlace = place.filter(item => item.show)
        const showPayType = pay_type.filter(item => item.show)

        this.setState(prevState => ({
            target: {...prevState.target, items: plan},
            position: {...prevState.position, items: place},
            pattern: {...prevState.pattern, items: pay_type},
            filter: {
                ...prevState.filter,
                p_type: showPlan.length > 1 ? null : showPlan[0].id,
                c_type: showPlace.length > 1 ? null : showPlace[0].id,
                b_type: showPayType.length > 1 ? null : showPayType[0].id
            }
        }))
    }

    async getService() {
        const {uid} = getQueryStringArgs(this.props.location.state.search)
        const items = await API.getUserService({
            maid: uid
        })
        const showItems = items.filter(item => item.show)
        this.setState(prevState => ({
            service: {
                ...prevState.service,
                items
            },
            filter: {
                ...prevState.filter,
                s_type: showItems.length > 1 ? null : showItems[0].id
            }
        }))
    }

    // 推广目标
    targetClick= (e) => {
        const selected = e.target.value
        this.setState(prevState => ({
            filter: {...prevState.filter, p_type: selected},
            shopInput: {...prevState.shopInput, showInput: selected === 'PRODUCT_TYPE_LBS_WECHAT'},
            target: {...prevState.target, error: ''}
        }))
    }

    positionClick= (e) => {
        console.log(e.target.value)
    }

    patternClick= (e) => {
        console.log(e.target.value)
    }

    serviceClick = (e) => {
        console.log(e.target.value)
        this.setState(prevState => ({
            filter: {...prevState.filter, s_type: e.target.value}
        }))
    }

    // 提交
    onCanfirm = () => {
        // console.log(this.state)
        const {planName, filter, shopInput} = this.state
        if (planName.trim() === '') {
            this.setState(prevState => ({
                errMsg: {...prevState.errMsg, adName: '广告名称不能为空'}
            }), () => {
                this.refs.planName.focus()
            })
            return
        }

        if (!planName.match(/^[0-9a-zA-Z\u4e00-\u9fa5-]{1,30}$/)) {
            this.setState(prevState => ({
                errMsg: {...prevState.errMsg, adName: '名称不得使用特殊符号'}
            }), () => {
                this.refs.planName.focus()
            })
            return
        }

        if (filter.p_type === null || filter.c_type === null || filter.b_type === null || filter.s_type === null) {
            this.setState(prevState => ({
                target: {...prevState.target, error: filter.p_type != null ? '' : '请选择推广目标'},
                position: {...prevState.position, error: filter.c_type != null ? '' : '请选广告位'},
                pattern: {...prevState.pattern, error: filter.b_type != null ? '' : '请选择购买方式'},
                service: {...prevState.service, error: filter.s_type != null ? '' : '请选择服务商'}
            }), () => intoError())
            return
        }

        const { location, history } = this.props
        const { uid } = getQueryStringArgs(location.state.search)

        const data = {
            a_id: uid,
            c_name: planName,
            c_type: filter.c_type,
            p_type: filter.p_type,
            b_type: filter.b_type,
            services_id: filter.s_type
        }

        // 本地推广
        if (filter.p_type === 'PRODUCT_TYPE_LBS_WECHAT') {
            if (shopInput.inputValue.trim() === '') {
                this.setState(prevState =>({
                    errMsg: {...prevState.errMsg, shopName: '推广门店名称不能为空'}
                }), () => intoError())
                return
            } 
            data.pr_id = shopInput.inputValue
        }

        // 修改
        const {planId} = location.state
        if (planId !== undefined) {
            data.c_id = planId
            API.addPlan('post', data, true).then(reuslt => history.goBack())
            return
        }

        // 新增
        API.addPlan('post', data, true).then(reuslt => history.push({
            pathname: 'create-advert',
            state: {
                search: location.state.search,
                planId: reuslt
            }
        }))
    }

    onChangeName = (e) => {
        this.setState({
            planName: e.target.value
        })

        if (this.state.errMsg.adName) {
            this.setState(prevState => ({
                errMsg: {...prevState.errMsg, adName: ''}
            }))
        }
    }

    onChangeShopName = (e) => {
        const value = e.target.value
        this.setState(prevState =>({
            shopInput: {...prevState.shopInput, inputValue: value},
            errMsg: {...prevState.errMsg, shopName: ''}
        }))
    }

    onClose = () => {
        this.setState(prevState => ({
            errMsg: {...prevState.errMsg, adName: ''}
        }))
    }

    render() {
        const {history, location} = this.props
        const {errMsg, planName, target, pattern, position, filter, shopInput, service} = this.state
        return (
            <section className="create-section wrapper">
                <div className="name-wrap">
                    <FormItem 
                        label="计划名称"
                        help={errMsg.adName}
                        validateStatus={errMsg.adName ? 'error' : null}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 21 }}
                    >
                        <Input
                            placeholder="计划名称"
                            className="name-input"
                            ref="planName"
                            value={planName}
                            onChange={this.onChangeName}
                            maxLength={30}
                        />
                    </FormItem>
                </div>
                <Card {...service} click={this.serviceClick} defValue={filter.s_type} />
                <Card 
                    {...target}
                    {...shopInput}
                    click={this.targetClick}
                    defValue={filter.p_type}
                    errMsg={errMsg.shopName}
                    onChangeShopName={this.onChangeShopName}
                    ref={this.targetCard}
                />
                <Card {...position} click={this.positionClick} defValue={filter.c_type} />
                <Card {...pattern} click={this.patternClick} defValue={filter.b_type} />
                <BtnGroup
                    right
                    cancel={history.goBack}
                    confirm={this.onCanfirm}
                    confirmName={location.state.planId !== undefined ? '确认修改' : '下一步'}
                />
            </section>
        )
    }
}

export default Plan