/**
 * 模块名称: 按钮组
 * @author xuzhongyuan@372163.com
 */

import React, { Fragment } from 'react'
import {Button} from 'antd'
import './style.scss'

const BtnGroup = ({cancel, confirm, cancelName='取消', confirmName='确认', left, right, loading}) => (
    <div className={`btn-group ${left ? 'to-left' : right ? 'to-right' : ''}`}>
        <Button onClick={cancel}>{cancelName}</Button>
        <Button onClick={confirm} htmlType="submit" type="primary" loading={loading}>{confirmName}</Button>
    </div>
)

export default BtnGroup