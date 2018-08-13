import {connect} from 'react-redux'
import LayoutAdmin from '../components/layoutAdmin'
import * as actions from '../actions'

const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = (dispatch) => {
    return {
        setUserinfo: data => dispatch(actions.login.success(data)),
        onLogout: () => dispatch(actions.onLogout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAdmin)