
import * as APIUtil from '../util/user_api_util';

export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';

export const receiveUsers = users => ({
  type: RECEIVE_USERS,
  users
})

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
})

export const fetchUsers = () => dispatch => (
  APIUtil.fetchUsers()
    .then(res => dispatch(receiveUsers(res.data)))
    // .catch(err => dispatch(receiveErrors(err.response.data)))
)
export const fetchUser = (id) => dispatch => (
  APIUtil.fetchUser(id)
    .then(res => dispatch(receiveUser(res.data)))
    // .catch(err => dispatch(receiveErrors(err.response.data)))
)
