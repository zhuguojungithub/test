/**
 * 模块名称: 上传组件
 * @author xuzhongyuan@372163.com]
 * 
 * 组件接收的常用参数：
 *      1. url 上传路径 (必须)
 *      2. uploaded 上传成功后的回调函数 (必须)
 *      3. name 提交到服务器的域名称 默认file
 *      4. imageUrl (修改)
 *      5. width, height, cover, data等
 * 
 * getFieldDecorator高阶组件提供的参数
 *      1. vlaue 默认值
 *      2. onChange 事件
 */

import React, { Component, Fragment } from 'react'
import { Icon, Upload, message } from 'antd'
import './style.scss'

const { Dragger } = Upload

class UploadImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            imageUrl: props.value || ''
        }
    }

    componentDidMount() {
        // console.log('uploadImage ==> ', this.props)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.imageUrl) {
            return {
                imageUrl: nextProps.value
            }
        }
        return null
    }

    onChangeUpload = (info) => {
        const { status, response } = info.file
        if (info.file.status === 'uploading') {
            this.setState({
                loading: true,
                imageUrl: ''
            })
            return
        }
        if (status === 'done') {
            if (response.code === 0) {
                const {url} = response.data
                this.setState({
                    imageUrl: url,
                    loading: false
                }, () => {
                    const { onChange, uploaded } = this.props
                    if (onChange) {
                        onChange(url)
                    }
                    if (uploaded) {
                        uploaded(url)
                    }
                    // onChange 是getFieldDecorator高阶组件提供的函数
                    // uploaded 是自定义的事件 方便脱离antd组件使用
                })
            } else {
                this.setState({
                    loading: false
                })
                message.error(response.msg || '服务器发生错误')
            }
        }
        else if (status === 'error') {
            this.setState({
                loading: false
            })
            message.error(`服务器发生错误`)
        }
    }

    render() {
        const { loading, imageUrl } = this.state
        const { url, name, width, height, cover, data, placeholder } = this.props
        const style = {width: width ? width : 300, height: height ? height : 200}

        // console.log('uploadImage ==> ', this.props)

        return (
            <Dragger
                name={name?name:'file'}
                action={`${url}?token=${sessionStorage.getItem('token')}`}
                onChange={this.onChangeUpload}
                withCredentials={true}
                showUploadList={false}
                className={`image-upload ${cover ? 'cover-image' : ''}`}
                style={style}
                data={data?data:{}}
            >
                <div className="upload-wrap">
                    {imageUrl
                        ? <img className="upload-image" src={`/web/${imageUrl}`} alt="iamge" style={style} />
                        : <Fragment>
                            <Icon type={loading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">{placeholder ? placeholder : '上传图片'}</div>
                        </Fragment>}
                </div>
            </Dragger>
        )
    }

}

export default UploadImage