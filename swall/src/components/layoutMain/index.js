import React, { Component } from 'react'

import Footer from './Footer'
import Header from './Header'
import MiniHeader from './MiniHeader'
import './assets/style.scss'
import Transition from 'react-transition-group/Transition'

class LayoutMain extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showFloatingHeader: false
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scrollHandle, false)
    }

    scrollHandle = () => {
        const scrollTop = document.documentElement.scrollTop
        const {showFloatingHeader} = this.state
        if (scrollTop >= 200 && !showFloatingHeader) {
            this.setState({
                showFloatingHeader: true
            })
        } else if (scrollTop < 200 && showFloatingHeader ) {
            this.setState({
                showFloatingHeader: false
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandle)
    }

    render() {
        const {showFloatingHeader} = this.state
        return (
            <div className="layout-main">
                <Header />
                <Transition in={showFloatingHeader} timeout={0}>
                    {status => <Header floating  className={`fade-${status}`} />}
                </Transition>
                <MiniHeader />
                <div className="main">{this.props.children}</div>
                <Footer />
            </div>
        )
    }
}

export default LayoutMain

