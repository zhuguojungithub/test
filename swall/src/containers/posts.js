import {connect} from 'react-redux'
import Posts from '../page/admin/posts'
import { fatchPosts } from '../actions';

const mapStateToProps = (state) => {
    return {
        items: state.posts.items
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fatchPosts: (data) => { dispatch(fatchPosts(data)) }
    }
}

export default connect(mapStateToProps)(Posts)