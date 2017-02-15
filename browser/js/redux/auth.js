import axios from 'axios';
import { browserHistory } from 'react-router';
import { create as createUser } from './users';

const SET = 'SET_CURRENT_USER';
const REMOVE = 'REMOVE_CURRENT_USER';

const set = user => ({ type: SET, user });
const remove = () => ({ type: REMOVE });

export default function authReducer (currentUser = null, action) {
    switch (action.type) {

        case SET:
            return action.user;

        case REMOVE:
            return null;

        default:
            return currentUser;
    }
}

const resToData = res => res.data;
const navToUser = user => browserHistory.push(`/users/${user.id}`);

export const login = credentials => dispatch => {
    return axios.put('/api/auth/me', credentials)
    .then(resToData)
    .then(user => {
        dispatch(set(user));
        return user;
    });
};

export const loginAndGoToUser = credentials => dispatch => {
  dispatch(login(credentials))
  .then(navToUser)
  .catch(err => console.error('Problem logging in:', err));
};

export const signup = credentials => dispatch => {
    return axios.post('/api/auth/me', credentials)
    .then(resToData)
    .then(user => {
        dispatch(createUser(user));
        dispatch(set(user));
        return user;
    });
};

export const signupAndGoToUser = credentials => dispatch => {
  dispatch(signup(credentials))
  .then(navToUser)
  .catch(err => console.error('Problem signing up:', err));
};

export const logout = () => dispatch => {
    axios.delete('/api/auth/me')
    .then(() => dispatch(remove()))
    .catch(err => console.error('Problem logging out:', err));
};

export const retrieveCurrentUser = () => dispatch => {
    axios.get('/api/auth/me')
    .then(resToData)
    .then(user => dispatch(set(user)))
    .catch(err => console.error('Problem fetching current:', err));
};
