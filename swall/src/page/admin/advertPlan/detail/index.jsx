/**
 * 模块名称: 广告主详情
 * @author xuzhongyuan@372163.com
 */

import React, { Component, Fragment } from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from './Main'
import Advert from './Advert'

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        // console.log('detail index props === ', this.props)
    }

    render() {
        const props = this.props
        const { match } = props
        return (
            <Switch>
                <Route exact path={match.url} render={() => <Main {...props} />} />
                <Route path={`${match.url}/advert-detail`} render={() => <Advert {...props} />} />
            </Switch>
        )
    }

}

export default Detail