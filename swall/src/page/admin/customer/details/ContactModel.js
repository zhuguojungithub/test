import React,{Component} from 'react'
import { Form,Input,Button,Icon,Checkbox } from 'antd';
import "../assets/style.scss"
const FormItem = Form.Item;


class ContactModel extends Component{
    constructor(props){
        super(props)
        this.state = {
            type:props.type,
            mc_id:props.data.mc_id,
            mc_maid:props.data.mc_maid,
            mui_name:props.data.mui_name,
            mui_mobile:props.data.mui_mobile,
            mc_type:props.data.mc_type,
            mui_email:props.data.mui_email,
            mui_id:props.data.mui_id,
            is_del:props.data.is_del
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
                values.mc_type=this.state.mc_type;
                values.mc_id=this.state.mc_id;
                values.is_del=this.state.is_del;
                values.mui_id = this.state.mui_id;
                this.props.onFormSubmit(values)
            }
        })
    }
    render(){
        const {mui_name,mui_email,mui_mobile} = this.state
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
                                rules: [{type:'string', required: true, message: '请输入姓名!' }],initialValue:mui_name
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
                                rules: [{type:'email', required: true, message: '请输入邮箱账号!' }],initialValue:mui_email
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
                                rules: [{type:'', required: true,pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号!' }],initialValue:mui_mobile
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
export default  Form.create()(ContactModel)