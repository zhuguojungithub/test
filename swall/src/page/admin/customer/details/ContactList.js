import React,{Component, Fragment} from "react"
import {Icon} from 'antd'
import Contact from './Contact'

class ContactList extends Component {
    constructor(props){
        super(props)
        this.state = {
            list:[]
        }
    }
    componentDidMount() {

    }
    delContact(mc_id){
        this.props.delData(mc_id)
    }
    render(){
       const {list} = this.props;
        const itemList = list.map((item)=>
            <Contact key={item.mc_id} checkData={list} data={item} del={(e)=>this.delContact(e)}/>
        )
        return (
            <Fragment>
                {itemList}
            </Fragment>
        )
    }
}
export default ContactList