import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import data from './data'

class ComboMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: props.items
        }
    }

    componentDidMount() {
        document.body.scrollTop = 0
    }

    render() {
        const { items } = this.state
        return (
            <div className="case-content container card-shadow">
                <Row gutter={128}>
                    {items.map((item, index) => (
                        <Col key={index} md={12} className="case-item">
                            <Link className="case-link" to={`/case/${item.id}`}>
                                <img className="item-logo" src={item.imgUrl} />
                                <h2 title={item.title}>{item.title}</h2>
                                <p title={item.desc}>{item.desc}</p>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        )
    }
}

ComboMain.defaultProps = {
    items: data
}

export default ComboMain