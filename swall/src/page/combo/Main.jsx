import React, { Component } from 'react'
import api from '../../api'

class ComboMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        this.getSuitList()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.items.length !== this.state.items.length) {
            const hash = this.props.location.hash
            if (hash) {
                document.documentElement.scrollTop = this.refs[hash].getBoundingClientRect().top - 20
                document.body.scrollTop = this.refs[hash].getBoundingClientRect().top - 20
            }
        }
    }

    async getSuitList(query) {
        const data = await api.suitList(query, true)
        this.setState({
            items: data
        })
    }

    imageError(e) {
        e.target.src = 'https://tdsys.372163.com/web/upload/2018042711181587610.jpg'
    }

    render() {
        const {items} = this.state
        return (
            <div className="combo-content container card-shadow">
                {items.map((item, index) => (
                    <div className="item-detail" key={item.tds_id} ref={`#${item.tds_id}`}>
                        <div className="img-wrap">
                            <img src={item.image} alt="image" onError={(e) => this.imageError(e)} />
                        </div>
                        <div className="detail-content">
                            <h2>{item.name}</h2>
                            <p>{item.desc}</p>
                            <div className="detail-btns">
                                <span className="price">￥{item.price}</span>
                                <p>联系电话：{item.mobile}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default ComboMain