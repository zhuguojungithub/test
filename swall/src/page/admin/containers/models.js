import {connect} from 'react-redux'
import Models from '../advertPlan/models'

const mapStateToProps = (state) => {
    return {
        uid: state.user.maid
    }
}

export default connect(mapStateToProps)(Models)