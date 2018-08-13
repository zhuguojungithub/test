import React from 'react'
import { Link } from 'react-router-dom'
import img from '../assets/images/404.png'

class NotFound extends React.Component {
    render() {
        const { path } = this.props
        return (
            <div className="not-found">
                <img src={img} alt="404" />
                <p>未匹配到路径：<code style={{textDecoration: 'underline'}}>{window.location.href}</code> <br /><Link to={path ? path : '/'}>回到首页</Link></p>
            </div>
        )
    }
}

export default NotFound