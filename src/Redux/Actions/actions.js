import { RESET_REDUX_STATE, LOGIN, CATEGORIES, CATEGORIES_COUNTER, SEARCH_RECIPES, FAVORITE_RECIPES, USER_RECIPES, INGREDIENTS, ALL_RECIPES, INGREDIENTS_TO_RECIPE, CATEGORIES_TO_RECIPE, USER_TO_RECIPE, USERS, VIEWED_RECIPE, VIEWED_RECIPE_USER, VIEWED_RECIPE_INGREDIENTS, VIEWED_RECIPE_CATEGORIES } from '../Actions/constraints';
import axios from 'axios';

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

export function allRecipesAction(recipesInfo){
    return {
        type: ALL_RECIPES,
        payload: recipesInfo
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

export function ingredientsToRecipeAction(ingredientsRecipeId){
    return {
        type: INGREDIENTS_TO_RECIPE,
        payload: ingredientsRecipeId
    };
};

export function categoriesToRecipeAction(categoriesRecipeId){
    return {
        type: CATEGORIES_TO_RECIPE,
        payload: categoriesRecipeId
    };
};

export function userToRecipeAction(userRecipeId){
    return {
        type: USER_TO_RECIPE,
        payload: userRecipeId
    };
};

export function usersAction(userInfo){
    return {
        type: USERS,
        payload: userInfo
    }
}

export function viewedRecipeAction(recipeInfo){
    return {
        type: VIEWED_RECIPE,
        payload: recipeInfo
    }
}

export function viewedRecipeUserAction(recipeInfo){
    return {
        type: VIEWED_RECIPE_USER,
        payload: recipeInfo
    }
}

export function viewedRecipeIngredientsAction(recipeInfo){
    return {
        type: VIEWED_RECIPE_INGREDIENTS,
        payload: recipeInfo
    }
}

export function viewedRecipeCategoriesAction(recipeInfo){
    return {
        type: VIEWED_RECIPE_CATEGORIES,
        payload: recipeInfo
    }
}
