import {connect} from 'react-redux'
import Personal from '../personal'
import * as actions from '../../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        updateAvatar: data => {dispatch(actions.updateAvatar(data))}
    }
}

export default connect(null, mapDispatchToProps)(Personal)