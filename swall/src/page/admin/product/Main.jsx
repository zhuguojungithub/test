import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import API from '../../../api'
import './assets/style.scss'
import errorImg from '../../../assets/images/load_error.png'

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            items: []
        }
    }
    
    componentDidMount() {
        this.getSuitList()
    }

    async getSuitList() {
        const items = await API.suitList(true)
        this.setState({ items })
    }

    imageError(e) {
        e.target.src = errorImg
    }

    render() {
        const {items} = this.state
        const {match} = this.props

        return (
            <section>
                <ul className="product-list">
                    {items.map(item=> (
                        <li key={item.tds_id}>
                            <Link to={`${match.path}/${item.tds_id}`} className="product-item" title="点击查看套餐详情">
                                <div className="p-left card-shadow">
                                    <img src={item.image} alt="image" onError={(e) => this.imageError(e)}/>
                                    <span className="price">￥{item.price}</span>
                                </div>
                                <div className="p-right">
                                    <h4 className="title">{item.name}</h4>
                                    <p className="desc">{item.desc.length > 50 ? `${item.desc.slice(0, 47)}...`: item.desc}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        )
    }
}

export default Main