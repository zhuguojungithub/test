/**
 * 模块名称: 朋友圈卡片
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Button, Tooltip, Icon } from 'antd'

const Item = (props) => {
    const {data, onUpdate, onSweepCode, editSource, editItem, reload} = props

    // data.reject_message = '营业执照已经过期'
    // data.status.code = 4
    // data.is_wx_bind = 1
    // data.status.value = "审核失败"
    
    return (
        <li>
            {data.image 
                ? <img className="item-img item-logo-img" src={data.image}/> 
                : <span className="item-img item-logo-text">{data.name.slice(0, 1)}</span>
            }
            <h4 className="title">{data.name}</h4>
            {data.if_full
                ? <div className={`item-status item-status-${data.status.code}`}>
                    <Tooltip title={data.reject_message}>
                        {data.status.value}
                        {data.reject_message && <Icon type="question-circle" />}
                    </Tooltip>
                    {data.status.code === 3 && data.is_wx_bind === 0 && <div className="edit-wrap">
                        <Button onClick={onSweepCode}>请扫码完成认证</Button>
                    </div>}
                    {data.status.code === 4 && [<div className="edit-wrap" key="edit-wrap">
                        <Button onClick={editSource}>修改企业信息</Button>
                        {' '}
                        <Button onClick={editItem}>修改补充信息</Button>
                    </div>,
                    <a className="reload-link" key="reload_link" href="javascript:;" onClick={reload}>重新提交</a>]}
                </div>
                : <Button onClick={onUpdate} className="item-btn">请补充资料</Button>
            }
            {data.time && <span className="item-date">开户时间：{data.time.split(' ')[0]}</span>}
        </li>
    )
}

export default Item