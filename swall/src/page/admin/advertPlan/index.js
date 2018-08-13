/**
 * 广告投放入口文件
 */

import React, { Component, Fragment } from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './Main'
import Layout from './Layout'
import PlanDetail from './detail'
import CreatePlan from './create/Plan'
import CreateAd from './create/Advert'
import CreateList from './create/List'
import CreateIdea from './create/Idea'
import Models from './models'
import Credentials from './credentials'
import './assets/style.scss'

class AdvertPlan extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        const props = this.props
        const { match } = props
        return (
            <Layout {...props}>
                <Switch>
                    <Route exact path={match.url} component={Main} />
                    <Route path={`${match.url}/models`} component={Models} />
                    <Route path={`${match.url}/credentials`} component={Credentials} />
                    <Route path={`${match.url}/create-plan`} component={CreatePlan} />
                    <Route path={`${match.url}/create-advert`} component={CreateAd} />
                    <Route path={`${match.url}/create-list`} component={CreateList} />
                    <Route path={`${match.url}/create-idea`} component={CreateIdea} />
                    <Route path={`${match.url}/:id`} component={PlanDetail} />
                </Switch>
            </Layout>
        )
    }
}

export default AdvertPlan