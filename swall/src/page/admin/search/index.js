import React, {Component} from 'react'
import { Input, Table, Icon } from 'antd'
import './assets/style.scss'
import API from '../../../api'

const Search = Input.Search
const { Column, ColumnGroup } = Table

class SearchComp extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            loading: false
        }
    }

    componentDidMount() {
        // console.log('Search==>', this.props)
    }

    async onSearchUser(value) {
        if (value.trim() === '') return
        this.setState({
            loading: true
        })
        try {
            const result = await API.searchUser({
                cs_name: value,
                page: 1,
                limit: 10
            })
            this.setState({
                items: result.list,
                loading: false
            })
        } catch(err) {
            this.setState({
                loading: false
            })
            console.log('onSearchUser', err)
        }
    }

    render() {
        const {items, loading} = this.state

        return (
            <section>
                <Search
                    placeholder="输入客户公司名称"
                    onSearch={value => this.onSearchUser(value)}
                    style={{ width: 400 }}
                    enterButton
                    size="large"
                />
                <Table 
                    dataSource={items} 
                    loading={loading} 
                    pagination={false} 
                    rowKey="ma_id"
                    locale={{emptyText: '暂无数据'}}
                    className="search-list"
                >
                    <Column title="公司名称" dataIndex="ma_corp_name" />
                    <Column title="状态" key="status" render={(text, data) => (
                        <ul style={{marginBottom: 0}}>{data.audit_status.map((item, index) => <li key={index}>{item.name}：{item.status}</li>)}</ul>
                    )} />
                    <Column title="行业" dataIndex="cate_name" />
                    <Column title="客服" dataIndex="service_name" />
                </Table>
            </section>
        )
    }
}

export default SearchComp