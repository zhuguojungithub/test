import { connect } from 'react-redux'
import PlanList from '../planList'

const mapStateToProps = (state) => {
    return {
        uid: state.user.maid
    }
}

export default connect(mapStateToProps)(PlanList)