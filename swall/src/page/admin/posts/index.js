import React, { Component } from 'react';

class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            d: null
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <section>
                <h1 className="title">创建广告</h1>
                {this.state.d.map(item => <div>{item.name}</div>)}
            </section>
        )
    }
}

export default Posts