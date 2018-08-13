
import React, { Component } from 'react'
import { Form, Radio, Input } from 'antd'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group


class Card extends Component {

    intoView = () => {
        this.refs.cardBox.scrollIntoView()
    }

    render() {
        const {
            title,
            detail,
            items,
            click,
            defValue,
            showInput,
            inputValue,
            errMsg,
            onChangeShopName,
            error
        } = this.props

        return  (
            <div className="card-wrap">
                <div className={`card-box ${error ? 'has-error' : ''}`} ref="cardBox">
                    <div className="title">
                        <h4>{title}</h4>
                        <span>{detail}</span>
                    </div>
                    {items.length ? <RadioGroup onChange={click} value={defValue}>
                        {items.map(item => <RadioButton
                            key={item.id}
                            value={item.id}
                            disabled={!item.show}
                        >
                            {item.name}
                        </RadioButton>)}
                    </RadioGroup> : null}
                    {showInput && <FormItem
                        label="门店名称"
                        validateStatus={errMsg ? 'error' : null}
                        help={errMsg}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 19 }}
                    >
                        <Input
                            placeholder="请输入本地推广门店名称"
                            maxLength={30}
                            defaultValue={inputValue}
                            onChange={onChangeShopName}
                        />
                    </FormItem>}
                </div>
                {error && <div className="error-box">{error}</div>}
            </div>
        )
    }
}

export default Card