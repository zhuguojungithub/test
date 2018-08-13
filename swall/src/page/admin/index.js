import React, {Component} from 'react'
import Routes from './Routes'
import LayoutAdmin from '../../containers/layoutAdmin'
import './assets/style.scss'

class Admin extends Component {
    
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        console.log('admin props ==>', this.props)
    }

    render() {
        const props = this.props
        const { location } = props

        // 广告计划路由
        if (location.pathname.includes('advertPlan')) {
            return (
                <Routes {...props}/>
            )
        }
        
        return (
            <LayoutAdmin {...props}>
                <Routes {...props}/>
            </LayoutAdmin>
        )
    }
}

export default Admin