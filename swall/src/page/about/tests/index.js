import React from 'react';
import { Route } from 'react-router-dom'
import Tests from './tests/'
import Web from './web/'

const TestsIndex = (props) => {
    
    return (
        <div>
            <Route exact path={props.match.url} component={Tests} />
            <Route path={props.match.url + '/web'} component={Web} />
        </div>
    )
}

export default TestsIndex