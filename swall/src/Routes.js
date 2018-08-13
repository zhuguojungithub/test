import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './page/home'
import About from './page/about/'
import Login from './containers/login'
import Admin from './page/admin'
import Combo from './page/combo'
import Case from './page/case'
import NotFound from './components/404'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={
        props => sessionStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    } />
)

export default () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/combo" component={Combo} />
        <Route path="/case" component={Case} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/admin" component={Admin} />
        <Route component={NotFound} />
    </Switch>
)