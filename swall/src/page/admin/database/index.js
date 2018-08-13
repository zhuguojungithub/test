/**
 * 模块名称: 数据中心
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Switch, Route} from 'react-router-dom'

import Adverter from './adverter'
import Plan from './plan'
import Advert from './advert'
import Details from "./advert/Detail"
import AdverterDetail from "./adverter/Detail"
import PlanDetail from "./plan/PlanDetail"
import UserContext from '../../../userContext'

import './assets/style.scss'

class Database extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { location, match, history } = nextProps
        if (location.pathname === match.url) {
            history.push(`${match.url}/plan`)
        }
        return null
    }

    componentDidMount() {
        console.log('数据中心', this.props)
    }

    render() {
        const {match} = this.props
        return (
            <Switch>
                <Route exact path={`${match.path}/adverter`} component={Adverter} />
                <Route path={`${match.path}/adverter/:id`} component={AdverterDetail} />
                <Route exact 
                    path={`${match.path}/plan`} 
                    render={props => <UserContext.Consumer>{user => <Plan user={user} {...props} />}</UserContext.Consumer>}
                />
                <Route 
                    path={`${match.path}/plan/:id`} 
                    render={props => <UserContext.Consumer>{user => <PlanDetail user={user} {...props} />}</UserContext.Consumer>} 
                />
                <Route exact 
                    path={`${match.path}/advert`}
                    render={props => <UserContext.Consumer>{user => <Advert user={user} {...props} />}</UserContext.Consumer>} 
                />
                <Route 
                    path={`${match.path}/advert/:id`}
                    render={props => <UserContext.Consumer>{user => <Details user={user} {...props} />}</UserContext.Consumer>} 
                />
            </Switch>
        )
    }
}

export default Database