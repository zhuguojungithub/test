/**
 * 套餐
 */

import React, { Component } from 'react'
import LayoutMain from '../../components/layoutMain';
import { Route } from 'react-router-dom'

import Main from './Main'
import Detail from './detail'
import banner from './assets/images/banner.jpg'

import './assets/style.scss'

class Combo extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <LayoutMain>
                <div className="combo-banner">
                    <img src={banner} />
                </div>
                <Route exact path={this.props.match.url} component={Main} />
                <Route path={`${this.props.match.url}/detail`} component={Detail} />
            </LayoutMain>
        )
    }
}

export default Combo