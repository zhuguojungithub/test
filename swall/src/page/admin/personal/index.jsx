/**
 * 模块名称: 个人中心
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../api'
import { Button } from 'antd'
import './assets/style.scss'
import Edit from './Edit'

class Personal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            position: [],
            isEdit: false
        }
    }

    componentDidMount() {
        this.getData()
    }

    async getData() {
        const data = await API.getUserDetails(true)
        this.setState({
            data: data.data,
            position: data.post

        })
    }

    onEditInfo = () => {
        this.setState({
            isEdit: true
        })
    }

    onCancelEdit = () => {
        this.setState({
            isEdit: false
        })
    }

    onSubmitEdit = (values) => {
        API.updateUserinfo('post', {
            name: values.name,
            mail: values.email,
            phone: values.phone,
            qq: values.qq,
            address: values.address,
            corp_name: values.company,
            post: values.position,
            logo: values.avatar
        }, true).then(() => {
            this.setState(prevStates => ({
                isEdit: false,
                data: {
                    ...prevStates.data, 
                    ...{
                        mui_name: values.name,
                        mui_email: values.email,
                        mui_phone: values.phone,
                        mui_qq: values.qq,
                        mui_address: values.address,
                        mui_corp_name: values.company,
                        mui_post: values.position,
                        logo_url: values.avatar
                    }
                }
            }))
            this.props.updateAvatar(values.avatar)
        })
    }

    render() {
        const { data, position, isEdit } = this.state

        if (!data) {
            return null
        }

        // data.logo_url = 'upload/2018071309515832032.png'
        // data.mui_address = '北京朝阳五里桥一街非中心'
        // data.mui_email = 'fwjefjwio@432432.com'
        // data.mui_corp_name = '全时天地在线'

        if (isEdit) {
            return <Edit 
                data={data} 
                positionData={position} 
                onCancel={this.onCancelEdit}
                onConfirm={this.onSubmitEdit}
            />
        }

        return (
            <section className="personal-content">
                <div className="user-avatar">
                    <img className="avatar-img" src={`/web/${data.logo_url}`} />
                    <div className="user-name">
                        <span>{data.mui_name}</span>
                        <span>{data.mui_mobile}</span>
                    </div>
                </div>
                <ul className="user-details">
                    <li>
                        <span>邮箱</span>
                        <p>{data.mui_email}</p>
                    </li>
                    <li>
                        <span>座机</span>
                        <p>{data.mui_phone}</p>
                    </li>
                    <li>
                        <span>QQ</span>
                        <p>{data.mui_qq}</p>
                    </li>
                    <li>
                        <span>联系人地址</span>
                        <p>{data.mui_address}</p>
                    </li>
                    <li>
                        <span>公司</span>
                        <p>{data.mui_corp_name}</p>
                    </li>
                    <li>
                        <span>职位</span>
                        <p>{position.find(item => item.id === data.mui_post).name}</p>
                    </li>
                </ul>
                <Button onClick={this.onEditInfo}>修改</Button>
            </section>
        )
    }
}

export default Personal