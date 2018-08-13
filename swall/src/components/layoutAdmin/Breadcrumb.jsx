/**
 * @author xuzhongyuan@372163.com
 * @date 2018-05-23
 * 说明：
 *   面包屑组件需要前端结合后端数据组合使用
 */

import React, { Component } from 'react';
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
const { Item } = Breadcrumb

class BreadcrumbComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            breadcrumbNameMap: props.breadcrumbNameMap
        }
        this.list = []
    }

    componentDidMount() {
        this.menuDataToBreadcrumb()
    }

    componentDidUpdate(prevProps) {
        const thisMenuData = this.props.menuData
        if (prevProps.menuData.length !== thisMenuData.length && thisMenuData.length) {
            this.menuDataToBreadcrumb()
        }
    }

    // 路由变面包屑
    menuDataToBreadcrumb = () => {
        this.flattenMenuData(this.props.menuData)
        const list = this.list
        const breadcrumb = {}
        for (let i = 0; i < list.length; i++) {
            breadcrumb[list[i].jump] = list[i].title
        }
        this.setState(prevState => ({
            breadcrumbNameMap: { ...prevState.breadcrumbNameMap, ...breadcrumb }
        }))
    }

    // 将路由扁平化
    flattenMenuData(data) {
        for (var i = 0; i < data.length; i++) {
            this.list.push({
                jump: data[i].jump,
                title: data[i].title
            })

            if (data[i].routes.length) {
                this.flattenMenuData(data[i].routes)
            }
        }
    }
    
    render() {
        const { location } = this.props
        const { breadcrumbNameMap } = this.state

        const pathSnippets = location.pathname.split('/').filter(item => item)
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            // 生成每个面包屑的url 如admin admin/main admin/main/body...
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
            let breadcrumbShowName = breadcrumbNameMap[url]
            if (!breadcrumbShowName) {
                // 尝试把最后一个值转换成*
                const urls = url.split('/').filter(item => item)
                const urlsLastChild = urls[urls.length-1]
                urls[urls.length-1] = '*'
                breadcrumbShowName = breadcrumbNameMap[`/${urls.join('/')}`]

                // 尝试把倒数第二个值转换成*
                if (!breadcrumbShowName) {
                    urls[urls.length-2] = '*'
                    urls[urls.length-1] = urlsLastChild
                    breadcrumbShowName = breadcrumbNameMap[`/${urls.join('/')}`]
                }

                // 如果还没有取到，就使用url中最后一个值作为名称
                if (!breadcrumbShowName) {
                    breadcrumbShowName = urlsLastChild
                }
            }

            const breadcrumbName = url === '/admin' ?  <Icon type="home" /> : breadcrumbShowName
            return (
                <Item key={url}>
                    {index === pathSnippets.length -1 ? breadcrumbName : <Link to={url}>{breadcrumbName}</Link>}
                </Item>
            )
        })

        return (
            <Breadcrumb>
                {extraBreadcrumbItems}
            </Breadcrumb>
        )
    }
}

// 个别路由面包屑需要在前端自定义
BreadcrumbComp.defaultProps = {
    breadcrumbNameMap: {
        '/admin/message': '消息',
        '/admin/product': '广告套餐',
        '/admin/product/*': '详情',
        '/admin/customer/*': '客户详情',
        '/admin/personal': '个人中心',
        '/admin/account/manage/*': '企业详情',
        '/admin/planList/*': '计划详情',
        '/admin/database/plan/*': '详情',
        '/admin/database/advert/*': '详情',
        '/admin/database/adverter/*': '详情',
        '/admin/planList/*/advert-detail': '广告详情',
        '/admin/planList/*/create-idea': '广告创意'
    }
}

export default BreadcrumbComp