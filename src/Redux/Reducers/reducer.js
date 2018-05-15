import { combineReducers } from 'redux';
import { RESET_REDUX_STATE, LOGIN, CATEGORIES, RESET_CATEGORIES, CATEGORIES_COUNTER_ADD, CATEGORIES_COUNTER_MINUS, SEARCH_RECIPES, FAVORITE_RECIPES, USER_RECIPES, INGREDIENTS, ALL_RECIPES, INGREDIENTS_TO_RECIPE, CATEGORIES_TO_RECIPE, USER_TO_RECIPE, USERS, VIEWED_RECIPE, ADD_FAVORITE_RECIPE} from '../Actions/constraints';

function login (state = {}, action){
    switch(action.type){
        case LOGIN :
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = {};
        default:
            return state;
    }
};

function categories (state = [], action){
    switch(action.type){
        case CATEGORIES :
            state.push(action.payload);
            return state;
        case RESET_REDUX_STATE :
            return state = [];
        case RESET_CATEGORIES :
            return state = [];
        default:
            return state;
    }
};

function categoriesCounter (state = 1, action){
    switch(action.type){
        case CATEGORIES_COUNTER_ADD :
            return state += 1;
        case CATEGORIES_COUNTER_MINUS:
            return state -=1;
        case RESET_REDUX_STATE :
            return state = 1;
        case RESET_CATEGORIES :
            return state = 1;
        default:
            return state;
    }
};

function ingredients (state = [], action){
    switch(action.type){
        case INGREDIENTS :
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
};

// Need to figure out how to make immutable
function allRecipes (state = [], action){
    switch(action.type){
        case INGREDIENTS_TO_RECIPE:
            state.forEach((recipe, i) => {
                if (recipe.id === action.payload.recipeId) {
                    return recipe.ingredients = action.payload.ingredients;
                }
            })
            return state;
        case CATEGORIES_TO_RECIPE:
            state.forEach((recipe, i) => {
                if (recipe.id === action.payload.recipeId) {
                    return recipe.categories = action.payload.categories;
                }
            })
            return state;
        case USER_TO_RECIPE:
            state.forEach((recipe, i) => {
                if (recipe.id === action.payload.recipeId) {
                    return recipe.user = action.payload.user;
                }
            })
            return state;
        case ALL_RECIPES :
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
};

function searchRecipes (state = [], action){
    switch(action.type){
        case SEARCH_RECIPES :
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
};

function favoriteRecipes (state = [], action){
    switch(action.type){
        case FAVORITE_RECIPES :
            return state = action.payload;
        case ADD_FAVORITE_RECIPE :
            state.push(action.payload);
            return state;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
};

function userRecipes (state = [], action){
    switch(action.type){
        case USER_RECIPES:
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
};

function users (state = [], action) {
    switch(action.type){
        case USERS:
            state.push(action.payload)
            return state;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
}

function viewedRecipe (state = [], action) {
    switch(action.type){
        case VIEWED_RECIPE:
            return state = action.payload;
        case RESET_REDUX_STATE :
            return state = [];
        default:
            return state;
    }
}

const rootReducer = combineReducers({login, categories, categoriesCounter, ingredients, searchRecipes, favoriteRecipes, userRecipes, allRecipes, users, viewedRecipe});

export default rootReducer;