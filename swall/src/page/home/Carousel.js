import React, { Component } from 'react'
import Flickity from 'flickity'
import 'flickity/dist/flickity.css'

import about_product from './assets/images/about_product.jpg'
import about_service from './assets/images/about_service.jpg'
import about_we from './assets/images/about_our.jpg'

class Carousel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [{
                tdb_image: about_product,
                tdb_text: '微信QQ、腾讯TSA矩阵跨场景10亿+流量覆盖'
            }, {
                tdb_image: about_service,
                tdb_text: '7*24小时为您充值 6对1投放优化服务效果数据实时反馈'
            }, {
                tdb_image: about_we,
                tdb_text: '广联先锋一站式营销推广 腾讯社交广告核心服务商'
            }],
            showAll: false
        }
        this.flkty = null
    }

    imgOnload = (index) => {
        if (index) return
        this.flkty = new Flickity(this.refs.carousel, {
            autoPlay: 5000,
            wrapAround: true,
            imagesLoaded: true,
            prevNextButtons: false,
            selectedAttraction: 0.02
        })
        this.flkty.resize()
    }

    render() {
        const { list } = this.state
        return (
            <div className="carousel" ref="carousel">
                {list.map((item, index) => {
                    return (
                        <div key={index} className="carousel-cell">
                            <div className="background-wrap">
                                <p><span className="home-carousel-text">{item.tdb_text}</span></p>
                            </div>
                            <img src={item.tdb_image} onLoad={() => this.imgOnload(index)} />
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Carousel