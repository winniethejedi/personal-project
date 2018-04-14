import { RESET_REDUX_STATE, LOGIN } from '../Actions/constraints';

export function resetRedux() {
    return {
        type: RESET_REDUX_STATE,
        payload: ''
    };
};

export function loginAction(userInfo) {
    return {
        type: LOGIN,
        payload: userInfo
    };
};