const express = require('express');

const handleDbError = require('../database/handleError.database');

const FavoriteRecipesRouter = express.Router();

FavoriteRecipesRouter.post('/', (req, res) => {
    const today = new Date();
    req.db.favorited_recipes.insert({
        user_id: req.body.userId,
        recipe_id: req.body.recipeId,
        date_added: today
    })
    .then(() => {
        res.send({
            message: 'Recipe successfully favorited'
        })
    })
})

FavoriteRecipesRouter.get('/', (req, res) => {
    const userId = req.query.id;
    req.findFavoriteRecipes({userId})
        .then(favoriteRecipesKeys => {
            res.send({
                favoriteRecipesKeys
            })
        })
})

module.exports = FavoriteRecipesRouter;