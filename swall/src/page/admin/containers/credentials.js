import {connect} from 'react-redux'
import Credentials from '../advertPlan/credentials'

const mapStateToProps = (state) => {
    return {
        uid: state.user.maid
    }
}

export default connect(mapStateToProps)(Credentials)