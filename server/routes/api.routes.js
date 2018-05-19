const express = require('express');

const FavoriteRecipesRouter = require('./favorite-recipes.routes');
const RecipeRouter = require('./recipe.routes');
const handleDbError = require('../database/handleError.database');

const ApiRouter = express.Router();

ApiRouter.use('/favorite-recipes', FavoriteRecipesRouter);
ApiRouter.use('/recipe', RecipeRouter);


app.get('/categories', (req, res) => {
    req.db.categories.find()
        .then(categories => {
            res.send(categories);
        })
        .catch(handleDbError(res));
});


app.get('/ingredients', (req, res) => {
    req.db.ingredients.find()
        .then(ingredients => {
            res.send(ingredients);
        })
})

app.get('/recipes', (req, res) => {

    //take in ingredients
    //50% of ingredients have to match - start with one
    //Find recipes based on post object data
    //Get ingredients
    // Get all recipes
    // Loop through recipes and grab all the keys
    // loop through ingredients and grab all keys
    // select distinct to avoid duplicates
    // 
    req.db.recipes.find()
        .then(recipes => {
            return Promise.all(recipes.map(recipe => {
                const recipeId = recipe.id;
                const ingredientsIdsPromise = req.db.findIngredientKeys({ recipeId })
                    .then((ingredients) => {
                        return ingredients.map(({ id }) => id);
                    });
                const categoriesIdsPromise = req.db.findCategoryKeys({ recipeId })
                    .then((categories) => {
                        return categories.map(({ id }) => id);
                    });
                return Promise.all([ingredientsIdsPromise, categoriesIdsPromise])
                    .then(([ingredientsIds, categoriesIds]) => {
                        return Object.assign(recipe, { ingredientsIds }, { categoriesIds });
                    })
            }))
                .then(recipes => {
                    return res.send(recipes);
                })
        })
        .catch(handleDbError(res));
})

app.post('/recipe-ingredients', (req, res) => {
    const ingredientsPromise = req.body.ingredientsIds.map((ingredientId, i) => {
        return req.db.findIngredientFromRecipe({ ingredientId })
    })
    return Promise.all(ingredientsPromise)
        .then(ingredients => {
            res.send(ingredients);
        })
        .catch(handleDbError(res));
})

app.post('/recipe-categories', (req, res) => {
    const categoriesPromise = req.body.categoriesIds.map((categoryId, i) => {
        return req.db.findCategoryFromRecipe({ categoryId })
    })
    return Promise.all(categoriesPromise)
        .then(categories => {
            res.send(categories);
        })
        .catch(handleDbError(res));
})


module.exports = ApiRouter;