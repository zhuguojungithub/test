/**
 * 错误边界处理
 */

import React, { Component } from 'react'
import errorImg from './assets/images/error.png'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { error: null, errorInfo: null, pathname: '' }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.errorInfo && nextProps.location.pathname !== prevState.pathname) {
            return {
                error: null,
                errorInfo: null
            }
        }

        return {
            pathname: nextProps.location.pathname
        }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        const {errorInfo, error} = this.state
        if (errorInfo) {
            return (
                <div className="error-box">
                    <h2>(⊙_⊙) 出了点意外。。。</h2>
                    <img src={errorImg} alt="error" />
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {error && error.toString()}
                        <br />
                        {errorInfo.componentStack}
                    </details>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary