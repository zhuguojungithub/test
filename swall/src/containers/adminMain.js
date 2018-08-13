import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import indexMain from '../page/admin/main'
import * as actions from '../actions';

const mapStateToProps = (state) => ({
    userinfo: state.user
})

const mapDispatchToPros = (dispatch) => ({
    updateUserAdvert: () => dispatch(actions.updateUserAdvert())
})

export default withRouter(connect(mapStateToProps, mapDispatchToPros)(indexMain))