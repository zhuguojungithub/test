import React from 'react'
import LayoutMain from '../../components/layoutMain'
import { Route } from 'react-router-dom'
import About from './about/'
import Tests from './tests'
import './assets/style.scss'

const AboutIndex = (props) => {
    console.log(props)
    
    return (
        <LayoutMain>
            <Route exact path={props.match.url} component={About} />
            <Route path={`${props.match.url}/tests`} component={Tests} />
        </LayoutMain>
    )
}

export default AboutIndex