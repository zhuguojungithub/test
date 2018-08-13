import React,{Component} from 'react'
import { Form,Input,Button,Icon,Checkbox } from 'antd';
import "../assets/style.scss"
const FormItem = Form.Item;
class AddContact extends Component{
    constructor(props){
        super(props)
        this.state = {
            mc_maid:props.data.mc_maid,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.submit !== this.props.submit) {
            this.refs.myform.props.onSubmit()
        }
    }
    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.mc_maid=this.state.mc_maid;
                this.props.onFormSubmit(values)
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={(e) => this.handleSubmit(e)} className="add-form" ref="myform">
                <div className="contact-input">
                    <div className="contact-type">
                        姓名
                    </div>
                    <div className="contact-inputs">
                        <FormItem>
                            {getFieldDecorator('mui_name', {
                                rules: [{type:'string', required: true, message: '请输入姓名!' }],
                            })(
                                <Input placeholder="姓名" />
                            )}
                        </FormItem>
                    </div>
                </div>
                <div className="contact-input">
                    <div className="contact-type">
                        邮箱
                    </div>
                    <div className="contact-inputs">
                        <FormItem>
                            {getFieldDecorator('mui_email', {
                                rules: [{type:'email', required: true, message: '请输入邮箱账号!' }],
                            })(
                                <Input placeholder="邮箱" />
                            )}
                        </FormItem>
                    </div>
                </div>
                <div className="contact-input">
                    <div className="contact-type">
                        手机号
                    </div>
                    <div className="contact-inputs">
                        <FormItem>
                            {getFieldDecorator('mui_mobile', {
                                rules: [{type:'', required: true,pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号!' }],
                            })(
                                <Input placeholder="手机号" />
                            )}
                        </FormItem>
                    </div>
                </div>
            </Form>
        );
    }
}
export default Form.create()(AddContact)