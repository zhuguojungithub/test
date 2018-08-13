import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './assets/style/index.scss'
import Routes from './Routes'

import Modal from './Modal'
import Loading from './components/loading'

class App extends Component {
    componentDidMount() {
        // 设置history 给saga使用
        this.props.dispatch({type: 'SET_HISTORY', history: this.props.history})

        // 路由切换时，将滚动条回到顶部
        this.props.history.listen(function(obj, type) {
            document.documentElement.scrollTop = 0
        })
    }

    render() {
        const {showLoading} = this.props
        return (
            <Fragment>
                <Routes />
                <Modal>
                    {showLoading && <Loading size="80" center/>}
                </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        showLoading: state.showLoading
    }
}

export default withRouter(connect(mapStateToProps)(App))
