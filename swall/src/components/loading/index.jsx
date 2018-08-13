import React from 'react'
import './style.scss'

const loading = ({className, size=100, type, center}) => {
    
    const tSize = size / 2
    const tScale = size / 200

    const style = {
        width: size + 'px',
        height: size + 'px',
        transform: `translate(-${tSize}px, -${tSize}px) scale(${tScale}) translate(${tSize}px, ${tSize}px)`
    }

    const clsName = `lds-loading-wrap${center ? ' lds-loading-center' : ''}${className ? ' ' + className:''}`

    if (type === 'ellipsis') {
        return (
            <div className={clsName} style={{width: size+'px'}}>
                <div style={style} className="lds-ellipsis">
                    <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
                </div>
            </div>
        )
    }

    return (
        <div style={{width: size+'px'}} className={clsName}>
            <div className="lds-spinner" 
                style={style}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default loading