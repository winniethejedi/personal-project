import { RESET_REDUX_STATE, LOGIN, CATEGORIES, RESET_CATEGORIES, CATEGORIES_COUNTER, SEARCH_RECIPES, FAVORITE_RECIPES, USER_RECIPES, INGREDIENTS } from '../Actions/constraints';

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

export function categoriesAction(categoryInfo){
    return{
        type: CATEGORIES,
        payload: categoryInfo
    };
};

export function categoriesCounterAction(){
    return {
        type: CATEGORIES_COUNTER,
        payload: ''
    };
};

export function searchRecipesAction(recipesInfo){
    return {
        type: SEARCH_RECIPES,
        payload: recipesInfo
    };
};

export function favoriteRecipesAction(recipesInfo){
    return {
        type: FAVORITE_RECIPES,
        payload: recipesInfo
    };
};
export function userRecipesAction(recipesInfo){
    return {
        type: USER_RECIPES,
        payload: recipesInfo
    };
};

export function ingredientsAction(ingredientsInfo){
    return {
        type: INGREDIENTS,
        payload: ingredientsInfo
    };
};