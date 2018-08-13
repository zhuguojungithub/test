import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Main from '../../containers/adminMain'
import Posts from '../../containers/posts'
import Message from './containers/message'
import Business from './business'
import Product from './product'
import Search from './search'
import Account from './account'
import Customer from './customer'
import AdvertPlan from './advertPlan'
import Pocket from './pocket'
import NotFound from '../../components/404'
import System from './system'
import Database from './database'
import Personal from './containers/personal'
import Models from './containers/models'
import Credentials from './containers/credentials'
import PlanList from './containers/planList'

export default ({match}) => (
    <Switch>
        <Route exact path={match.url} component={Main} />
        <Route path={`${match.url}/message`} component={Message} />
        <Route path={`${match.url}/posts`} component={Posts} />
        <Route path={`${match.url}/business`} component={Business} />
        <Route path={`${match.url}/product`} component={Product} />
        <Route path={`${match.url}/search`} component={Search} />
        <Route path={`${match.url}/account`} component={Account} />
        <Route path={`${match.url}/customer`} component={Customer} />
        <Route path={`${match.url}/advertPlan`} component={AdvertPlan} />
        <Route path={`${match.url}/pocket`} component={Pocket} />
        <Route path={`${match.url}/config`} component={System} />
        <Route path={`${match.url}/database`} component={Database} />
        <Route path={`${match.url}/personal`} component={Personal} />
        <Route path={`${match.url}/models`} component={Models} />
        <Route path={`${match.url}/credentials`} component={Credentials} />
        <Route path={`${match.url}/planList`} component={PlanList} />
        <Route render={() => <NotFound path="/admin"/>} />
    </Switch>
)