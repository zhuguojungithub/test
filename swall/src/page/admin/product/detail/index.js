import React, { Component, Fragment } from 'react'
import API from '../../../../api'

class productDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this.getDetail()
    }

    async getDetail() {
        const { id } = this.props.match.params
        const data = await API.suitDetail({ id: id }, true)
        this.setState({ data })
    }

    render() {
        const { data } = this.state

        if (!data) {
            return null
        }

        return (
            <section className="product-detail">
                <h1 className="title">{data.name}</h1>
                <div className="detail-content">
                    <div className="img-box">
                        <img className="detail-img" src={data.image} alt="产品图片" />
                        <span className="price">￥{data.price}</span>
                    </div>
                    <p className="detail-desc">{data.desc}</p>
                </div>
            </section>
        )
    }
}

export default productDetail