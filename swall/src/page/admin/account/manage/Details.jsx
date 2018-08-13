/**
 * 模块名称: 广告主资质详情
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import API from '../../../../api'

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.getData()
    }

    async getData() {
        const data = await API.getAdvertCredentials({
            maid: this.props.match.params.id
        }, true)
        this.setState({ data })
    }

    render() {
        const { data } = this.state

        if (!data) return null

        return (
            <section className="advert-credentials">
                <div className="advert-item">
                    <div className="advert-title">
                        <h1 className="title">{data.ma_corp_name}</h1>
                        <ul className="status-list">
                            {data.audit_status.map(item => <li key={item.status_code}>
                                <span className="title">{item.name}：</span><span className="error">{item.status}</span>
                                <span className="title">微信ID：</span><span>{item.wxid}</span>
                            </li>)}
                        </ul>
                    </div>
                </div>
                <div className="advert-item">
                    <h4>基本信息</h4>
                    <ul className="advert-baseinfo">
                        <li>
                            <span>企业全称</span>
                            <p>{data.ma_corp_name}</p>
                        </li>
                        <li>
                            <span>营业执照号</span>
                            <p>{data.ma_corp_licence}</p>
                        </li>
                        <li>
                            <span>企业注册地址</span>
                            <p>{data.ma_corp_login_address}</p>
                        </li>
                        <li>
                            <span>ICP备案号</span>
                            <p>{data.icp_number}</p>
                        </li>
                        <li>
                            <span>企业宣传网站</span>
                            <p>{data.ma_corp_domain}</p>
                        </li>
                    </ul>
                </div>
                <div className="advert-item">
                    <h4>相关证件</h4>
                    <div className="credentials-list">
                        <a href={`/web/${data.certification_image_url}`} target="_blank">
                            <img src={data.certification_image_thumb_url} alt="营业执照" />
                        </a>
                        <a href={`/web/${data.identification_front_url}`} target="_blank">
                            <img src={data.identification_front_thumb_url} alt="身份证正面" />
                        </a>
                        <a href={`/web/${data.identification_back_url}`} target="_blank">
                            <img src={data.identification_back_thumb_url} alt="身份证反面" />
                        </a>
                    </div>
                </div>
            </section>
        )
    }

}

export default Details