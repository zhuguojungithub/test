import React, {Component, Fragment} from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './Main'
import ProductDetail from './detail'
import './assets/style.scss'

class AdminIndex extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }
    
    componentDidMount() {
        console.log('product props', this.props)
    }

    render() {
        const {match} = this.props
        return (
           <Switch>
                <Route exact path={match.url} component={Main} />
                <Route path={`${match.url}/:id`} component={ProductDetail} />
           </Switch>
        )
    }
}

export default AdminIndex