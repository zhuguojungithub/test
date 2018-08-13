import React, { Component } from 'react'
import data from '../data'

class CaseDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: {}
        }
    }

    componentDidMount() {
        const { items, match } = this.props
        const item = items.filter(item => item.id === match.params.id)[0]
        this.setState({
            item: item
        }, () => {
            document.body.scrollTop = 0
        })
    }

    render() {
        const { item } = this.state
        return (
            <div className="case-content container card-shadow case-detail">
                <h1>{item.title}</h1>
                <p>{item.desc}</p>
                <div className="detail-img">
                    <img src={item.detail} />
                </div>
            </div>
        )
    }
}
CaseDetail.defaultProps = {
    items: data
}

export default CaseDetail