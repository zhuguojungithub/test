import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import 'babel-polyfill'

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

// router
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'

// redux
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import rootSaga from './sagas'

const store = configureStore()
store.runSaga(rootSaga)

console.log('store ==> ', store.getState())

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <LocaleProvider locale={zh_CN}>
                <App />
            </LocaleProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
)
registerServiceWorker();
