import React,{Component,Fragment} from 'react'
import '../assets/style.scss'
import {Icon,Modal,Button,message,Popconfirm} from 'antd'
import ContactModel from './ContactModel'
import API from "../../../../api"

class Contact extends Component{
    constructor(props){
        super(props)
        this.state ={
            mc_id:props.data.mc_id,
            mui_id:props.data.mui_id,
            mc_maid:props.data.mc_maid,
            mui_name:props.data.mui_name,
            mui_mobile:props.data.mui_mobile,
            mc_type:props.data.mc_type,
            mui_email:props.data.mui_email,
            is_del:props.data.is_del,
            visible:false,
            submit:false,
            checkData:this.props.checkData
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            submit: !this.state.submit
        })
    }
    onSubmit = (values) =>{
        if(this.state.checkData.some(item => item.mui_email === values.mui_email && item.mc_id !== values.mc_id)){
            message.error('该联系人邮箱与其他联系人重复，请重新编辑')
        }else if(this.state.checkData.some(item => item.mui_mobile === values.mui_mobile  && item.mc_id !== values.mc_id)){
            message.error('该联系人手机号与其他联系人重复，请重新编辑')
        }else{
            this.setState({
                visible:false,
            })
            this.updateContact(values)
        }
    }
    async updateContact(values) {
        const datas = await API.updateContact('post',values);
        this.setState({
            mui_name:datas.mui_name,
            mui_mobile:datas.mui_mobile,
            mui_email:datas.mui_email,
        })
        message.success('编辑成功！');
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    editorContact(){
       this.setState({
           visible:true
       })
    }
    delContact(){
        this.delContact();
    }
    async delContact(){
        const datas = await API.updateContact('post',{
            mc_id:this.state.mc_id,
            mui_id:this.state.mui_id,
            mc_maid:this.state.mc_maid,
            mui_name:this.state.mui_name,
            mui_email:this.state.mui_email,
            mui_mobile:this.state.mui_mobile,
            is_del:1});
        this.props.del(this.state.mc_id);
        message.success('删除成功！');
    }

    contactChange(value){
            const type = value.type;
            if(type === 'editor'){
                this.setState({
                    editorData:{
                        mc_id:value.mc_id,
                        mc_maid:value.mc_maid,
                        mc_name:value.mc_name,
                        mc_mobile:value.mc_mobile,
                        mc_email:value.mc_email,
                        is_del:value.is_del
                    }
                })
            }
        }
    confirm=(e)=> {
        this.delContact();
    }

     cancel=(e)=> {

    }
    render(){
        const {submit} = this.state
        let status,buttons='';
        if(this.state.mc_type === 0){
            status = <div className="contact-status contact-resign">未注册</div>
            buttons = <div className="editor-box"><div className='editor'><Icon type="edit" onClick={(e)=>this.editorContact(e)}/></div><div className="delete">
                <Popconfirm title="确定删除该联系人?" onConfirm={this.confirm} onCancel={this.cancel} okText="确定" cancelText="取消">
                    <Icon type="delete" />
                </Popconfirm></div></div>
        }else if(this.state.mc_type ===1){
            status = <div className="contact-status contact-resigned">已注册</div>
        }
        return (
            <Fragment>
                <Modal
                    title="修改联系人信息"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                   <ContactModel type='editor' submit={submit} visible={this.state.visible} data={this.props.data} dataChange={(e)=>this.contactChange(e)} onFormSubmit={(e)=>this.onSubmit(e)}/>
                </Modal>
                <div className="contact-lists">
                    <div className="contact-info">
                        <div className="contact-type">
                            姓名:
                        </div>
                        <div className="contact-val">
                            {this.state.mui_name}
                            {status}
                        </div>
                    </div>
                    <div className="contact-info">
                        <div className="contact-type">
                            邮箱:
                        </div>
                        <div className="contact-val">
                            {this.state.mui_email}
                        </div>
                    </div>
                    <div className="contact-info">
                        <div className="contact-type">
                            手机号:
                        </div>
                        <div className="contact-val">
                            {this.state.mui_mobile}
                        </div>
                    </div>
                    {buttons}
                </div>
            </Fragment>

        )
    }

}

export default Contact
