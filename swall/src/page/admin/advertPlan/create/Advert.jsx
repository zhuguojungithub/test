/**
 * 模块名称: 创建广告
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Form, Icon, Input, Slider, Radio, TreeSelect, Checkbox, DatePicker, InputNumber } from 'antd'
import moment from 'moment'
import ShowTime from './ShowTime'
import BtnGroup from '../../../../components/btnGroup'
import API from '../../../../api'
import {getQueryStringArgs, intoError} from '../../../../tools/utils'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const SHOW_PARENT = TreeSelect.SHOW_PARENT
const TreeNode = TreeSelect.TreeNode
const { RangePicker } = DatePicker

class Advert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            baseData: {
                education: [],
                relationship_status: [],
                device_price: [],
                gender: [],
                network_operator: [],
                network_type: [],
                user_os: []
            },
            area: {
                selected: [],
                areaTree: {},
                checkedArea: null
            },
            hobby: {
                data: [],
                selected: []
            },
            level: {
                selected: [],
                options: [],
                checkAll: true,
                alias: 'education'
            },
            life: {
                selected: [],
                options: [],
                checkAll: true,
                alias: 'relationship_status'
            },
            system: {
                selected: [],
                options: [],
                checkAll: true,
                alias: 'user_os'
            },
            price: {
                selected: [],
                options: [],
                checkAll: true,
                alias: 'device_price'
            },
            operator: {
                selected: [],
                options: [],
                checkAll: true,
                alias: 'network_operator'
            },
            network: {
                selected: [],
                options: [],
                checkAll: true,
                alias: 'network_type'
            },
            ageRange: [14, 66],
            expectDate: [],
            showTime: [],
            checkedShowTime: 'single',
            currentDate: moment(),
            showPicker: false,
            targetId: null,
            // 校验
            validate: {
                showTime: {
                    msg: '',
                    type: ''
                },
                picker: {
                    msg: '',
                    type: ''
                }
            }
        }
    }

    componentDidMount() {
        console.log('advert props ====> ', this.props)
        
        this.getHobby()
        this.getRegion()

        const {location} = this.props
        const {advertId} = location.state

        if (advertId !== undefined) {
            // 编辑和copy
            this.initData(advertId)

        } else {
            this.getBaseData()
        }
    }

    componentDidUpdate() {

    }

    async initData(id) {
        await this.getBaseData()
        this.getAdvertOrigin(id)
    }

    // 修改
    async getAdvertOrigin(id) {
        const data = await API.getAdvertOrigin({
            mag_id: id
        }, true)

        // 给表单设置默认值。有一部分数据初始化需要在组件的state中完成
        const { state } =  this.props.location
        this.props.form.setFieldsValue({
            advertName: state.type === 'copy' ? `${data.mag_name}-副本` : data.mag_name,
            gender: data.gender,
            area: data.geo_location.items,
            date: [moment(data.mag_begin_date), moment(data.mag_end_date)],
            hobby: data.business_interest,
            budget: data.mag_daily_budget,
            range: data.mag_bid_amount
        })

        this.setState(prevState => ({
            network: {
                ...prevState.network,
                selected: data.network_type,
                checkAll: prevState.baseData.network_type.length === data.network_type.length
            },
            operator: {
                ...prevState.operator,
                selected: data.network_operator,
                checkAll: prevState.baseData.network_operator.length === data.network_operator.length
            },
            price: {
                ...prevState.price,
                selected: data.device_price,
                checkAll: prevState.baseData.device_price.length === data.device_price.length
            },
            system: {
                ...prevState.system,
                selected: data.user_os,
                checkAll: prevState.baseData.user_os.length === data.user_os.length
            },
            life: {
                ...prevState.life,
                selected: data.relationship_status,
                checkAll: prevState.baseData.relationship_status.length === data.relationship_status.length
            },
            level: {
                ...prevState.level,
                selected: data.education,
                checkAll: prevState.baseData.education.length === data.education.length
            },
            area: {
                ...prevState.area,
                checkedArea: data.geo_location.type
            },
            ageRange: data.age,
            expectDate: [data.mag_begin_date, data.mag_end_date],
            showTime: data.mag_times === 'all' ? [] : data.mag_times,
            checkedShowTime: data.mag_times === 'all' ? 'all' : 'single',
            targetId: data.mag_target_id
        }))
    }

    // 获取地域
    async getRegion() {
        const data = await API.getRegion()
        this.setState(prevState => ({
            area: {...prevState.area, ...{areaTree: data}}
        }))
    }

    // 基础数据
    async getBaseData() {
        const {education, relationship_status, device_price, gender, network_operator, network_type, user_os} = await API.getAdvertData(true)
        this.setState(prevState => ({
            baseData: {
                education,
                relationship_status,
                device_price,
                gender,
                network_operator,
                network_type,
                user_os
            },
            level: {
                ...prevState.level,
                selected: education.map(item => item.alias),
                options: education.map(item => ({ label: item.name, value: item.alias })) 
            },
            life: {
                ...prevState.life,
                selected: relationship_status.map(item => item.alias),
                options: relationship_status.map(item => ({ label: item.name, value: item.alias })) 
            },
            system: {
                ...prevState.system,
                selected: user_os.map(item => item.alias),
                options: user_os.map(item => ({ label: item.name, value: item.alias }))
            },
            price: {
                ...prevState.price,
                selected: device_price.map(item => item.alias),
                options: device_price.map(item => ({ label: item.name, value: item.alias })) 
            },
            operator: {
                ...prevState.operator,
                selected: network_operator.map(item => item.alias),
                options: network_operator.map(item => ({ label: item.name, value: item.alias }))
            },
            network: {
                ...prevState.network,
                selected: network_type.map(item => item.alias),
                options: network_type.map(item => ({ label: item.name, value: item.alias }))
            }
        }))
    }

    // 获取兴趣行业
    async getHobby() {
        const data = await API.getHobby()
        this.setState(prevState => ({
            hobby: {...prevState.hobby, ...{data}}
        }))
    }

    // 表单提交
    formSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form

        validateFields((err, values) => {
            console.log('submit err ===> ', err)
            console.log('submit values ===> ', values)
            console.log('submit state ===> ', this.state)

            // 自定义校验
            const {showTime, checkedShowTime} = this.state
            if (checkedShowTime === 'single' && showTime.length === 0) {
                err ? err.showTime = '展示时间为空' : err = {showTime: '展示时间为空'}
                this.setState(prevState => ({
                    validate: {
                        ...prevState.validate,
                        showTime: {type: 'error', msg: '请至少添加一组展示时间'}
                    }
                }))
            }

            if (err) return setTimeout(() => intoError())

            const {location, history} = this.props
            const {uid} = getQueryStringArgs(location.state.search)
            const {area, level, life, system, price, operator, network, targetId, ageRange} = this.state
            const fromat = 'YYYY-MM-DD'

            const data = {
                mag_maid: uid,
                mag_mcid: location.state.planId,
                mag_name: values.advertName,
                mag_begin_date: moment(values.date[0]).format(fromat),
                mag_end_date: moment(values.date[1]).format(fromat),
                mag_times: checkedShowTime === 'single' ? showTime : checkedShowTime,
                mag_bid_amount: values.range,
                mag_daily_budget: values.budget,
                age: ageRange,
                gender: values.gender,
                geo_location: { type: area.checkedArea, items: values.area },
                business_interest: values.hobby ? values.hobby : [],
                education: level.selected,
                relationship_status: life.selected,
                user_os: system.selected,
                device_price: price.selected,
                network_operator: operator.selected,
                network_type: network.selected
            }

            const {advertId, type, from} = location.state

            if (advertId !== undefined && type === 'edit') {
                // 修改
                API.updateAdvert('post', {
                    mag_id: advertId,
                    mag_target_id: targetId,
                    ...data,
                }, true).then(() => history.goBack())
                return
            }

            // 新增
            API.addAdvert('post', data, true)
                .then(result => {
                    if (from === 'planDetail') {
                        history.goBack()
                        return
                    }
                    history.push({
                        pathname: 'create-list',
                        state: location.state
                    })
                })
        })
    }

    // 选择地域
    onChangeArea = (value, label, extra) => {
        // console.log('onChangeArea value ===> ', value);
        // console.log('onChangeArea label ===> ', label);
        // console.log('onChangeArea extra ===> ', extra);

        // 勾选项的详细信息
        // const selectList = extra.allCheckedNodes.map(item => item.node.props)
        // console.log(selectList)

        if (value.length) {
            this.setState(prevState => ({
                area: {...prevState.area, selected: value}
            }))
        } 
        else {
            this.setState(prevState => ({
                area: {...prevState.area, selected: [], checkedArea: null}
            }))
        }
    }

    // 控制交互
    onSelectArea = (value, node, extra) => {
        // console.log('value', value)
        // console.log('node', node)
        // console.log('extra', extra)

        // 勾选的是第一级
        if (value === 'core' || value === 'important' || value === 'other') {
            this.setState(prevState => ({
                area: {...prevState.area, ...{checkedArea: value}}
            }))
            return
        }

        const {halfCheckedKeys} = extra
        if (!!~halfCheckedKeys.indexOf('core')) {
            this.setState(prevState => ({
                area: {...prevState.area, checkedArea: 'core'}
            }))
        }
        else if (!!~halfCheckedKeys.indexOf('important')) {
            this.setState(prevState => ({
                area: {...prevState.area, checkedArea: 'important'}
            }))
        }
        else if (!!~halfCheckedKeys.indexOf('other')) {
            this.setState(prevState => ({
                area: {...prevState.area, checkedArea: 'other'}
            }))
        }
    }

    // 选择兴趣
    onChangeHobby = (value, label, extra) => {
        this.setState(prevState => ({
            hobby: {...prevState.hobby, selected: value}
        }))
    }

    // 地域树
    renderTreeNode(name, checkedArea, data) {
        if (!data) return null
        const disabled = checkedArea && checkedArea !== name
        const title = {
            core: '核心城市',
            important: '重点城市',
            other: '其他城市'
        }
        // 城市类型 => 市 => 大商圈(区) => 小商圈
        return (
            <TreeNode 
                value={name} 
                title={title[name]} 
                key={name} 
                type={name} 
                disabled={disabled}
            >
                {data.map(item => {
                    return (
                        <TreeNode 
                            value={item.t_id.toString()} 
                            title={item.name} 
                            key={item.t_id.toString()}
                            type={item.type}
                            disabled={disabled}
                        >
                            {item.child 
                                ? item.child.map(child => (
                                    <TreeNode 
                                        value={child.t_id.toString()} 
                                        title={child.name} 
                                        key={child.t_id.toString()}
                                        type={child.type}
                                        disabled={disabled}
                                    >
                                        {child.child ? child.child.map(val => (
                                            <TreeNode 
                                                value={val.t_id.toString()}
                                                title={val.name} 
                                                key={val.t_id.toString()}
                                                type={val.type}
                                                disabled={disabled}
                                            />
                                        )): null}
                                    </TreeNode>
                                    ))
                                : null
                            }
                        </TreeNode>
                    )
                })}
            </TreeNode>
        )
    }

    // 全选
    onCheckAll = (e, type) => {
        const checked = e.target.checked
        this.setState(prevState => {
            const data = prevState[type]
            const selected = checked ? data.options.map(item => item.value) : []
            return {
                [type]: {
                    ...data,
                    selected: selected,
                    checkAll: checked
                }
            }
        })
    }

    // 单选
    onCheckitem = (selected, type) => {
        this.setState(prevState => {
            const data = prevState[type]
            const checkAll = selected.length === data.options.length
            return {
                [type]: {
                    ...data,
                    selected: selected,
                    checkAll: checkAll
                }
            }
        })
    }

    // 兴趣树
    renderHobbyNode(data) {
        if (!data) return null
        return data.map(item => (
            <TreeNode value={item.t_id.toString()} title={item.name} key={item.t_id}>
                {item.child ? item.child.map(child => (
                    <TreeNode value={child.t_id.toString()} title={child.name} key={child.t_id}>
                        {child.child
                            ? child.child.map(node => <TreeNode value={node.t_id.toString()} title={node.name} key={node.t_id} />)
                            : null}
                    </TreeNode>)
                ) : null
                }
            </TreeNode>
            )
        )
    }

    // 修改展示时间
    onEditShowTime = (index) => {
        this.setState(prevState => ({
            showTime: [...prevState.showTime, ...prevState.showTime[index].edit = true]
        }))
    }

    onRemoveShowTime =(index) => {
        this.setState(prevState => {
            const showTime = prevState.showTime.filter((item, i) => index !== i)
            return {showTime}
        })
    }

    // 提交新增或修改展示时间
    onConfirmEditShowTime = (value, index) => {
        // 新增
        if (index === 'new') {
            this.setState(prevState => ({
                showTime: [...prevState.showTime, value], // 当value是数组时需要用三个 '...'
                validate: {...prevState.validate, ...{showTime: {type: '', msg: ''}}}
            }))
            return
        }

        // 修改
        this.setState(prevState => {
            const showTime = prevState.showTime
            showTime[index] = value
            return {showTime}
        })
    }

    // 取消展示时间的修改
    onCancelEditShowTime = (index) => {
        this.setState(prevState => {
            const showTime = prevState.showTime
            delete showTime[index].edit
            return {showTime}
        })
    }

    onDisabledDate = (current) => {
        // current 是今天之前的日期 moment().endOf('day')是今天的日期
        // console.log(moment(current).format('YYYY-MM-DD'))
        // console.log(moment().endOf('day').format('YYYY-MM-DD'))
        return current && (current < moment().endOf('day'))
    }

    onCalendarChange = (dates) => {
        // console.log('onCalendarChange', dates)
        // console.log(moment(dates[0]).format('YYYY-MM-DD'))
        this.setState(prevState => ({
            validate: {...prevState.validate, ...{picker: {msg: ''}} }
        }))
    }

    onChangePicker = (date, dateString) => {
        // console.log('onChangePicker', date, dateString)

        // console.log('开始时间', moment(date[0]).format('YYYY-MM-DD'))
        // console.log('结束时间', moment(date[1]).format('YYYY-MM-DD'))
        // console.log('选择的开始时间+10天', moment(date[0]).add(11, 'd').format('YYYY-MM-DD'))


        if (moment(date[0]).isSame(date[1])) {
            this.setState(prevState => ({
                validate: { ...prevState.validate, ...{ picker: { msg: '开始日期与结束日期不能相同' } } }
            }))
            return
        }

        if (!moment(date[1]).isBetween(date[0], moment(date[0]).add(10, 'd'))) {
            this.setState(prevState => ({
                validate: { ...prevState.validate, ...{ picker: { msg: '投放时间不得超出10天' } } }
            }))
            return
        }

        this.setState({
            showPicker: false,
            expectDate: dateString
        })
    }

    onClickPicker = (status) => {
        if (status) {
            this.setState({
                showPicker: true
            })
        }
    }

    onClosePicker = () => {
        const {validate, expectDate} = this.state

        if (validate.picker.msg) {
            this.setState(prevState => ({
                showPicker: false,
                validate: {...prevState.validate, ...{picker: {msg: ''}}}
            }), () => {
                // 值还原
                this.props.form.setFieldsValue({
                    date: expectDate.length ? [moment(expectDate[0]), moment(expectDate[1])] : []
                })
            })
        } else {
            this.setState({
                showPicker: false
            })
        }
        
    }

    onchangeAge = (value) => {
        this.setState({
            ageRange: value
        })
    }

    onchangeAgeMin = (value) => {
        this.setState(prevState => ({
            ageRange: [value, prevState.ageRange[1]]
        }))
    }

    onchangeAgeMax = (value) => {
        this.setState(prevState => ({
            ageRange: [prevState.ageRange[0], value]
        }))
    }

    onChangeShowTime = (e) => {
        this.setState({
            checkedShowTime: e.target.value
        })
    }

    onCancelCreate = () => {
        const {location, history} = this.props

        if (location.state.type) {
            history.goBack()
            return
        }
        history.push({
            pathname: '/admin/advertPlan',
            search: location.state.search
        })
    }

    render() {
        console.log('advert state ===> ', this.state)
        const { getFieldDecorator } = this.props.form
        const {
            baseData,
            area,
            hobby,
            level,
            life,
            system,
            price,
            operator,
            network,
            expectDate,
            showTime,
            checkedShowTime,
            validate,
            showPicker,
            ageRange
        } = this.state

        // 复选框数据
        const {gender} = baseData

        // 地域
        const { areaTree, checkedArea } = area
        const { core, important, other } = areaTree

        const ageMarks = {}
        for (let i = 14; i < 66; i++) {
            if (i % 5 === 0) {
                ageMarks[i] = i
            }
        }
        const priceRange = areaTree[checkedArea] ? areaTree[checkedArea].price_range.split('-') : null

        return (
            <section className="advert-section wrapper">
                <Form onSubmit={this.formSubmit} layout="horizontal">
                    <div className="area-name">
                        <FormItem label="广告名称">
                            {getFieldDecorator('advertName', {
                                rules: [{
                                    required: true, message: '广告名称不能为空'
                                }, {
                                    max: 30, message: '长度不能超过30个字符'
                                }, {
                                    pattern: /^[0-9a-zA-Z\u4e00-\u9fa5-]{1,30}$/, message: '名称不得使用特殊符号'
                                }]
                            })(
                                <Input placeholder="输入广告名称" />
                            )}
                        </FormItem>
                    </div>

                    {/* 基本配置 */}
                    <div className="area-wrap basic">
                        <div className="name-wrap">
                            <h2 className="title">定向人群</h2>
                            <p className="detail">选择合适的人群投放广告</p>
                        </div>
                        <FormItem label={[
                            <h4 key="age">年龄</h4>,
                            <span key="detail">支持14-66岁之间的年龄段</span>
                        ]}>
                            <div>
                                <InputNumber
                                    min={14}
                                    max={65}
                                    value={ageRange[0]}
                                    onChange={this.onchangeAgeMin}
                                />
                                {' —— '}
                                <InputNumber
                                    min={15}
                                    max={66}
                                    value={ageRange[1]}
                                    onChange={this.onchangeAgeMax}
                                />
                            </div>
                            <Slider 
                                className="age-slider" 
                                onChange={this.onchangeAge} 
                                range 
                                marks={ageMarks} 
                                step={1} 
                                min={14} 
                                max={66}
                                value={ageRange}
                            />
                        </FormItem>
                        <FormItem label={[<h4 key="gender">性别</h4>, <span key="detail">选择投放人群性别</span>]}>
                            {getFieldDecorator('gender', {
                                initialValue: 'ALL'
                            })(
                                <RadioGroup onChange={null}>
                                    {gender.map(item => <RadioButton key={item.alias} value={item.alias}>{item.name}</RadioButton>)}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label={[
                                <h4 key="area">地域</h4>,
                                <span key="detail">请选择投放城市(由于价格不同，每条广告每次只能选择一种城市类型)</span>
                            ]}>
                            {getFieldDecorator('area', {
                                rules: [{required: true, message: '至少选择一项'}]
                            })(<TreeSelect
                                onChange={this.onChangeArea}
                                onSelect={this.onSelectArea}
                                treeCheckable={true}
                                showCheckedStrategy={SHOW_PARENT}
                                searchPlaceholder='选择投放区域'
                                style={{width: 300}}
                                dropdownStyle={{maxHeight: 350}}
                            >
                                {this.renderTreeNode('core', checkedArea, core?core.data:[])}
                                {this.renderTreeNode('important', checkedArea, important?important.data:[])}
                                {this.renderTreeNode('other', checkedArea, other?other.data:[])}
                            </TreeSelect>)}
                        </FormItem>
                        <FormItem label={[
                                <h4 key="hobby">兴趣</h4>,
                                <span key="detail">请选择投放目标兴趣领域</span>
                            ]}>
                            {getFieldDecorator('hobby')(<TreeSelect
                                onChange={this.onChangeHobby}
                                treeCheckable={true}
                                showCheckedStrategy={SHOW_PARENT}
                                searchPlaceholder='选择投放兴趣'
                                style={{width: 300}}
                                dropdownStyle={{maxHeight: 350}}
                            >
                                {this.renderHobbyNode(hobby.data)}
                            </TreeSelect>)}
                        </FormItem>
                        <FormItem label={[
                                <h4 key="level">学历</h4>,
                                <Checkbox 
                                    key="checkbox" 
                                    checked={level.checkAll} 
                                    onChange={(e) => this.onCheckAll(e, 'level')}
                                >
                                    全选
                                </Checkbox>
                            ]}>
                                <CheckboxGroup 
                                    options={level.options}
                                    value={level.selected} 
                                    onChange={(selected) => this.onCheckitem(selected, 'level')}
                                />
                        </FormItem>
                        <FormItem label={[
                                <h4 key="life">婚恋状态</h4>,
                                <Checkbox 
                                    key="checkbox"
                                    checked={life.checkAll}
                                    onChange={(e) => this.onCheckAll(e, 'life')}
                                >
                                    全选
                                </Checkbox>
                            ]}>
                                <CheckboxGroup
                                    options={life.options}
                                    value={life.selected}
                                    onChange={selected => this.onCheckitem(selected, 'life')}
                                />
                        </FormItem>
                        <FormItem label={[
                                <h4 key="system">操作系统</h4>,
                                <Checkbox 
                                    key="checkbox"
                                    checked={system.checkAll}
                                    onChange={(e) => this.onCheckAll(e, 'system')}
                                >
                                    全选
                                </Checkbox>
                            ]}>
                                <CheckboxGroup
                                    options={system.options}
                                    value={system.selected}
                                    onChange={selected => this.onCheckitem(selected, 'system')}
                                />
                        </FormItem>
                        <FormItem label={[
                                <h4 key="price">手机价格</h4>,
                                <Checkbox 
                                    key="checkbox"
                                    checked={price.checkAll}
                                    onChange={(e) => this.onCheckAll(e, 'price')}
                                >
                                    全选
                                </Checkbox>
                            ]}>
                                <CheckboxGroup
                                    options={price.options}
                                    value={price.selected}
                                    onChange={selected => this.onCheckitem(selected, 'price')}
                                />
                        </FormItem>
                        <FormItem label={[
                                <h4 key="operator">运营商</h4>,
                                <Checkbox 
                                    key="checkbox"
                                    checked={operator.checkAll}
                                    onChange={(e) => this.onCheckAll(e, 'operator')}
                                >
                                    全选
                                </Checkbox>
                            ]}>
                                <CheckboxGroup
                                    options={operator.options}
                                    value={operator.selected}
                                    onChange={selected => this.onCheckitem(selected, 'operator')}
                                />
                        </FormItem>
                        <FormItem label={[
                                <h4 key="network">联网方式</h4>,
                                <Checkbox 
                                    key="checkbox"
                                    checked={network.checkAll}
                                    onChange={(e) => this.onCheckAll(e, 'network')}
                                >
                                    全选
                                </Checkbox>
                            ]}>
                                <CheckboxGroup
                                    options={network.options}
                                    value={network.selected}
                                    onChange={selected => this.onCheckitem(selected, 'network')}
                                />
                        </FormItem>
                    </div>
                    
                    {/* 时间配置 */}
                    <div className="area-wrap date">
                        <div className="name-wrap">
                            <h2 className="title">投放时间</h2>
                            <p className="detail">选择广告投放时间和设置每天展示时间</p>
                        </div>
                        <FormItem label={[<h4 key="date">上线日期</h4>, <span key="detail"></span>]}>
                            {getFieldDecorator('date', {
                                rules: [{required: true, message: '请选择投放日期'}],
                                initialValue: expectDate
                            })(<RangePicker 
                                onChange={this.onChangePicker}
                                disabledDate={this.onDisabledDate}
                                open={showPicker}
                                onOpenChange={this.onClickPicker}
                                onCalendarChange={this.onCalendarChange}
                                renderExtraFooter={() => {
                                    return (
                                        <div className="range-picker-foot">
                                            <span className="error-color">{validate.picker.msg && `提示：${validate.picker.msg}`}</span>
                                            <span className="close" onClick={this.onClosePicker}>取消</span>
                                        </div>
                                    )
                                }}
                            />)}
                        </FormItem>
                        <FormItem label={[
                            <h4 key="showTime">展示时间</h4>,
                            <span key="detail"></span>]}
                            validateStatus={validate.showTime.type}
                            help={validate.showTime.msg}
                            required
                        >
                            <RadioGroup onChange={this.onChangeShowTime} value={checkedShowTime}>
                                <Radio value="single">自定义时间</Radio>
                                <Radio value="all">全天展示</Radio>
                            </RadioGroup>
                            {checkedShowTime === 'single' 
                                ? showTime.map((item, index) => (
                                item.edit 
                                    ? <ShowTime 
                                        key={index}
                                        defStart={item.start}
                                        defEnd={item.end}
                                        list={showTime}
                                        confirm={(value) => this.onConfirmEditShowTime(value, index)} 
                                        cancel={()=>this.onCancelEditShowTime(index)}
                                    />
                                    : <div className="show-time" key={index}>
                                        <div>{item.start}</div>
                                        <span className="line">——</span>
                                        <div>{item.end}</div>
                                        <div className="handle-bar">
                                            <a className="edit-icon" 
                                                title="编辑" 
                                                onClick={() => this.onEditShowTime(index)} 
                                                href="javascript:;"
                                            >
                                                <Icon type="edit" />
                                            </a>
                                            <a className="delete-icon" 
                                                title="删除" 
                                                href="javascript:;"
                                                onClick={() => this.onRemoveShowTime(index)}
                                            >
                                                <Icon type="delete" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            : <div className="show-time">
                                <div>00:00</div>
                                <span className="line">——</span>
                                <div>23:59</div>
                            </div>}
                            {checkedShowTime === 'single' && <ShowTime btnName="添加" list={showTime} confirm={value => this.onConfirmEditShowTime(value, 'new')} />}
                        </FormItem>
                    </div>
                    
                    {/* 预算配置 */}
                    <div className="area-wrap budget">
                        <div className="name-wrap">
                            <h2 className="title">预算花费</h2>
                            <p className="detail">设置广告投放预算</p>
                        </div>
                        <FormItem label={[
                            <h4 key="budget">每日预算</h4>,
                            <span key="detail">范围1000~10000000元/天</span>
                        ]}>
                            {getFieldDecorator('budget', {
                                rules: [{
                                    required: true, message: '预算不能为空'
                                }]
                            })(
                                <InputNumber className="range-input" min={1000} max={10000000} step={1000} />
                            )}
                        </FormItem>
                        <FormItem label={[
                            <h4 key="range">出价</h4>,
                            <span key="detail">出价范围{priceRange ? `${priceRange[0]}~${priceRange[1]}` : null}/千次曝光</span>
                        ]}>
                            {getFieldDecorator('range', {
                                rules: [{
                                    required: true, message: '出价范围不能为空'
                                }]
                            })(
                                <InputNumber
                                    min={priceRange ? parseInt(priceRange[0]) : 0}
                                    max={priceRange ? parseInt(priceRange[1]) : 1000000}
                                    step={10}
                                    className="range-input"
                                />
                            )}
                        </FormItem>
                    </div>
                    <BtnGroup cancel={this.onCancelCreate} confirm={null} right />
                </Form>
            </section>
        )
    }
}

export default Form.create()(Advert)