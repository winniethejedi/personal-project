import { combineReducers } from 'redux';
import { RESET_REDUX_STATE, LOGIN } from '../Actions/constraints';

function loginReducer (state = {}, action){
    switch(action.type){
        case LOGIN :
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = {};
        default:
            return state;
    }
};

const rootReducer = combineReducers({loginReducer});

export default rootReducer;