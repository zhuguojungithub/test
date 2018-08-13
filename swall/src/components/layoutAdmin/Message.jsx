import React, { Component, Fragment } from 'react'
import Loading from '../loading'

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {list, fetching} = this.props

        return (
            <Fragment>
                {fetching && <Loading type="ellipsis" size="40"/>}
                <ul className="message-preview">
                    {list.map(item => <li key={item.mum_id} title={item.mm_content}>{item.mm_content}</li>)}
                    {list.length > 0 && <li className="link">查看全部</li>}
                </ul>
            </Fragment>
        )
    }
}

export default Message