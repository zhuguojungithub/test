import React from 'react';
import rabbit from '../assets/images/rabbit.jpg'

const About = (props) => {
    return (
        <div>
            <h2 className="about">About</h2>
            <p className="about-content">这里是关于我页面</p>
            <img src={rabbit} />
        </div>
    )
}

export default About