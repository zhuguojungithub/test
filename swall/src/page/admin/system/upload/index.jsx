/**
 * 模块名称: 导入数据
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import { Button, Upload, Icon, message, notification } from 'antd'
import urls from '../../../../api/urls'

class UploadData extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() { }

    onChangeUpload = (info) => {
        const { response, status } = info.file
        if (status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (status === 'done') {
            // console.log('done info ===> ', info)
            if (response.code === 0) {
                notification.success({
                    message: '上传成功',
                    description: response.msg,
                    duration: 10
                })
            } else {
                message.error(response.msg)
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    }

    render() {
        return (
            <section>
                <Upload
                    name='file'
                    action={`${urls.importExpend}?token=${sessionStorage.getItem('token')}`}
                    onChange={this.onChangeUpload}
                    showUploadList={false}
                >
                    <Button><Icon type="upload" /> 导入消耗数据</Button>
                </Upload>
            </section>
        )
    }
}

export default UploadData