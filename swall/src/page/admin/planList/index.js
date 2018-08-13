import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './Main'
import Details from './Details'
import EditIdea from '../advertPlan/create/Idea'

class PlanIndex extends Component {
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
                <Route exact path={match.url} render={() => <Main {...this.props} />} />
                <Route path={`${match.url}/:id/create-idea`} render={() => <EditIdea {...this.props} />} />
                <Route path={`${match.url}/:id`} component={Details} />
            </Switch>
        )
    }
}

export default PlanIndex