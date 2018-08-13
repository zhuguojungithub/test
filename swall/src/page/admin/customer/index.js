import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './Main'
import Details from './details'
import './assets/style.scss'

class Customer extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        const { match } = this.props
        return (
            <Switch>
                <Route exact path={match.url} component={Main} />
                <Route path={`${match.url}/:id`} component={Details} />
            </Switch>
        )
    }
}

export default Customer