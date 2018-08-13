import React, { Component, Fragment } from 'react'
import API from "../../../../api"
import '../assets/style.scss'
import ContactList from "./ContactList"
import AddContact from "./AddContact"
import {Icon,Modal,Button,message} from 'antd'

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            maid:props.match.params.id,
            lists:[],
            visible:false,
            addData:{},
            showAlls:false
        }
    }

    componentDidMount() {
        this.getBaseInfo()

    }
    showAllMessage(){
        this.setState(function(prevState,props){
            return {
                showAlls: !prevState.showAlls
            }
        })
    }
    async getBaseInfo(){
        const companyInfo = await API.getCompanyInfos({maid:this.state.maid}, true);
        const data = companyInfo.info
        const list = companyInfo.contact_list
        let audit_statusV
        // for(var k in data.audit_status){
        //     audit_statusV = data.audit_status[k]
        //     this.setState({
                
        //     })
        // }
        this.setState({
            audit_status: data.audit_status,
            // status_nember: audit_statusV.status_nember,
            // mi_services: audit_statusV.mi_services,
            ma_id: data.ma_id,
            ma_corp_name: data.ma_corp_name,
            ma_corp_login_address:data.ma_corp_login_address,
            operation_names:data.operation_names,
            ma_group:data.ma_group,
            cateName:data.cateName,
            areaName:data.areaName,
            ma_consume:data.ma_consume,
            ma_corp_domain:data.ma_corp_domain,
            ma_corp_domain:data.ma_corp_domain,
            total_cost:data.total_cost,
            // mi_reject_message:audit_statusV.mi_reject_message,
            services:data.services,
            lists:list,
            addData:{
                mc_maid:data.ma_id,
                mc_name:'',
                mc_mobile:'',
                mc_email:'',
            },
            submit: false
    })
    const service = this.state.services.map((item)=>{
        return item.name
    })
    let serviceStatus = this.state.services.map((item) => 
          <div className="company-status" key={item.name}>
                        <div className="status-not-pass">
                            <span className="status-company-name">{item.name}：</span>
                            {item.status}
                        </div>
                        { item.status_code === 4 
                            ? <div className="not-pass-cause">
                                <span>微信：</span>
                                <span>{item.reject_message}</span>
                            </div> 
                            : ""
                        }
                    </div>
        )
        console.log(serviceStatus)
    this.setState({
        serviceCompany:service.join("/"),
        serviceCompanyStatus:serviceStatus
    })
    }
    addContact(){
        this.setState({
            visible:true,
        })

    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.addContentAjax()
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    addContactBox(value){
        this.setState({
            addData:value
        })
    }
    async addContentAjax(values) {
        const data = await API.addContact('post',values);
        this.setState(function(prevState, props) {
            return {
                lists: [...prevState.lists,data],
            };
        });
        message.success('添加成功');
    }
    onDelData = (mc_id) => {
        let lists = this.state.lists.filter((item) =>
            item.mc_id !== mc_id
        )
        this.setState({
            lists:lists
        })
    }

    onOk = () => {
        this.setState({
            submit: !this.state.submit
        })
    }
    onSubmit = (values) =>{
        const {lists} = this.state
        if(lists.some(item => item.mui_email === values.mui_email)) {
            message.error('该联系人邮箱与其他联系人重复，请重新编辑')
        }else if(lists.some(item => item.mui_mobile === values.mui_mobile)){
            message.error('该联系人手机号与其他联系人重复，请重新编辑')
        }else{
            this.setState({
                visible:false
            })
            this.addContentAjax(values)
        }
    }
    render() {
        const {lists, submit, cateName, areaName, operation_names, serviceCompany, serviceCompanyStatus, ma_corp_name, ma_corp_domain, total_cost} = this.state    
       
        let addButon;
        if(lists.length<10){
            addButon = <div className="contact-lists contant-add" onClick={(e)=>this.addContact(e)}>
                            <Icon type="plus" />
                        </div>
        }

        if (!ma_corp_name) {
            return <div>加载中...</div>
        }

        return (
            <div className='customer-content'>
                <Modal
                    title="新增联系人"
                    visible={this.state.visible}
                    onOk={this.onOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <AddContact type='add' submit={submit} onFormSubmit={this.onSubmit} visible={this.state.visible} data={this.state.addData} dataAdd={(e)=>this.addContactBox(e)}/>
                </Modal>
                <div className="company-baseinfo">
                    <div className="company-names">
                        <div className="names">
                            {this.state.ma_corp_name}
                        </div>
                    </div>
                    <div className="status-box">
                        {serviceCompanyStatus}
                    </div>
                </div>

                    <div className="infos">
                        <div className="title">
                            基本信息
                        </div>
                        <div className="info-list">
                            <div className="info-type">
                                行业
                            </div>
                            <div className="info-val">
                                {cateName}
                            </div>
                        </div>
                        <div className="info-list">
                            <div className="info-type">
                                区域
                            </div>
                            <div className="info-val">
                                {areaName}
                            </div>
                        </div>
                        <div className="info-list">
                            <div className="info-type">
                                所属服务商
                            </div>
                            <div className="info-val">
                                {serviceCompany}
                            </div>
                        </div>
                        <div className="info-list">
                            <div className="info-type">
                                优化师
                            </div>
                            <div className="info-val">
                                {operation_names}
                            </div>
                        </div>
                        <div className="info-list">
                            <div className="info-type">
                                所属团队
                            </div>
                            <div className="info-val">
                                {this.state.ma_group}
                            </div>
                        </div>
                        <div className="info-list">
                    </div>
                    <div className="info-list">
                        <div className="info-type">
                            企业网址
                        </div>
                        <div className="info-val">
                            {ma_corp_domain}
                        </div>
                    </div>
                    <div className="info-list">
                        <div className="info-type">
                            累计消费
                        </div>
                        <div className="info-val">
                            {total_cost}
                        </div>
                    </div>
                    </div>
                <div className="contact-list">
                    <div className="title">
                        联系人
                    </div>
                    <div className="contact-box">
                        <ContactList list={this.state.lists} delData={this.onDelData}/>
                        {addButon}
                    </div>
                </div>

            </div>
        )
    }

}

export default Details