import {connect} from 'react-redux'
import Message from '../message'
import * as actions from '../../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        updateMsgCount: count => {dispatch(actions.updateMsgCount(count))}
    }
}

export default connect(null, mapDispatchToProps)(Message)