import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import Login from '../page/login'
import * as actions from '../actions';

const mapStateToProps = (state) => {
    return {
        username: state.user.name
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUsername: (name) => { dispatch(actions.setUsername(name)) },
        hideLoading: () => { dispatch(actions.hideLoading()) },
        showLoading: () => { dispatch(actions.showLoading()) },
        requestLogin: (user, from) => { dispatch(actions.login.request(user, from)) },
        requestRegister: data => { dispatch(actions.register.request(data)) }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))