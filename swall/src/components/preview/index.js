/**
 * 模块名称: 广告创意预览
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Icon, Tabs } from 'antd'
import avatar_png from '../../assets/images/avatar.png'
import './style.scss'

const TabPane = Tabs.TabPane

class Preview extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() { }

    render() {
        const {imageUrl, content, shareTitle, shareDetail, link } = this.props

        return (
            <div className="preview-box">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="外层" key="1">
                        <div className="preview-content">
                            <div className="preview-avatar">
                                <img src={avatar_png} />
                            </div>
                            <div className="content-wrap">
                                <div className="preview-header">
                                    <h4>全时天地在线</h4>
                                    <div className="ad-box"><span>广告</span><Icon type="down" /></div>
                                </div>
                                <div className="preview-detail">{content}</div>
                                <div className="preview-img">
                                    <img src={`/web/${imageUrl}`} />
                                </div>
                                <div className="preview-footer">
                                    {/* <span>{checkedLink ? links.find(item => item.alias === checkedLink).name : null} <Icon type="link" /></span> */}
                                    <span>{link} <Icon type="link" /></span>
                                    <div className="bar">
                                        <span>2小时前</span>
                                        <Icon type="message" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="分享" key="2">
                        <div className="share-content">
                            <div className="preview-l">
                                <h4>{shareTitle}</h4>
                                <div className="content-box">
                                    <p>{shareDetail}</p>
                                    <img src={`/web/${imageUrl}`} />
                                </div>
                            </div>
                            <div className="preview-s">
                                <div className="preview-avatar">
                                    <img src={avatar_png} />
                                </div>
                                <div className="content-wrap">
                                    <div className="preview-header">
                                        <h4>全时天地在线</h4>
                                    </div>
                                    <div className="preview-mini">
                                        <img src={`/web/${imageUrl}`} />
                                        <span>{shareTitle}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    {/* <TabPane tab="落地页" key="3">Content of Tab Pane 3</TabPane> */}
                </Tabs>
            </div>
        )
    }

}

export default Preview