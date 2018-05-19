const path = require('path');
const express = require('express');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const addGlobalMiddleware = require('./middleware/global.middleware');
const addRoutes = require('./routes/global.routes');

const app = express();

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
});

app.get('/api/categories', (req, res) => {
    req.db.categories.find()
        .then(categories => {
            res.send(categories);
        })
        .catch(handleDbError(res));
});

app.get('/api/user/me', (req, res) => {
    res.send({
        successful: req.isAuthenticated(),
        ...req.user
    })
});

app.post('/api/recipe', (req, res) => {
    // Carefully follow logic. The join tables need to be done at the end, and make sure it's after you have all the data. Also, you can't .then after mapping.
    // Add recipe first
    // get id back
    // loop through ingredients array
    // look for if (ingredients.id = 0)
    // insert ingredient
    // replace id in original array with new ID with new ingredients
    // insert 
    // send back whole recipe
    // or send back successful message


    const today = new Date();
    const recipeKey = {};
    const ingredientsKeys = [];

    req.db.recipes.insert({
        name: req.body.name,
        description: req.body.description,
        directions: req.body.directions,
        time: req.body.time,
        image: req.body.image,
        date_added: today,
        user_id: req.body.userId
    })
        .then(foundRecipe => {
            recipeKey.recipeId = foundRecipe.id;
        })
        .then(() => {
            const ingredientArr = req.body.ingredients.map((ingredient, i) => {
                return req.db.ingredients.find({
                    'name SIMILAR TO': ingredient
                })
            })
            return Promise.all(ingredientArr);
        })
        .then(foundIngredients => {
            const insertedIngredients = [];

            foundIngredients.forEach((ingredient, i) => {
                if (ingredient.length == 0) {
                    insertedIngredients.push(
                        req.db.ingredients.insert({
                            name: req.body.ingredients[i],
                            date_added: today,
                            user_id: req.body.userId
                        })
                    )

                }
            })
            foundIngredients.forEach((ingredient, i) => {
                if (ingredient[0]) {
                    ingredientsKeys.push(ingredient[0].id);
                }
            })
            return Promise.all(insertedIngredients)
        })
        .then((insertedIngredients) => {
            insertedIngredients.forEach((ingredient) => {
                ingredientsKeys.push(ingredient[0].id);
            })
        })
        .then(() => {
            ingredientsKeys.map((ingredientKey, i) => {
                req.db.recipe_ingredients.insert({
                    recipe_id: recipeKey.recipeId,
                    ingredient_id: ingredientKey,
                });
            });
            req.body.categories.map((categoryKey, i) => {
                req.db.recipe_categories.insert({
                    recipe_id: recipeKey.recipeId,
                    category_id: categoryKey
                });
            })
        })
        .then(() => {
            res.send({
                message: 'Recipe was successfully added.'
            });
        })
        .catch(handleDbError(res));
})


app.get('/api/ingredients', (req, res) => {
    req.db.ingredients.find()
        .then(ingredients => {
            res.send(ingredients);
        })
})

app.get('/api/recipes', (req, res) => {

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

app.get('/api/user', (req, res) => {
    const userId = parseInt(req.query.id, 10);
    req.db.users.findOne({
        id: userId
    })
        .then(user => {
            const userData = {
                id: user.id,
                profile_pic: user.profile_pic,
                username: user.username
            }
            res.send(userData);
        })
        .catch(handleDbError(res));
})

app.post('/api/recipe-ingredients', (req, res) => {
    const ingredientsPromise = req.body.ingredientsIds.map((ingredientId, i) => {
        return req.db.findIngredientFromRecipe({ ingredientId })
    })
    return Promise.all(ingredientsPromise)
        .then(ingredients => {
            res.send(ingredients);
        })
        .catch(handleDbError(res));
})

app.post('/api/recipe-categories', (req, res) => {
    const categoriesPromise = req.body.categoriesIds.map((categoryId, i) => {
        return req.db.findCategoryFromRecipe({ categoryId })
    })
    return Promise.all(categoriesPromise)
        .then(categories => {
            res.send(categories);
        })
        .catch(handleDbError(res));
})

app.post('/api/favorite-recipes', (req, res) => {
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

app.get('/api/favorite-recipes', (req, res) => {
    const userId = req.query.id;
    req.findFavoriteRecipes({userId})
        .then(favoriteRecipesKeys => {
            res.send({
                favoriteRecipesKeys
            })
        })
})


app.get('/api/recipe/:id', (req, res) => {
    const recipeId = req.params.id;
    let recipe;
    req.db.recipes.findOne({
        id: recipeId
    })
    .then((foundRecipe) => {
        recipe = foundRecipe;
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
})
    // req.db.findIngredientKeys({
    //     recipeId
    // })
    // .then((ingredientKey) => {

    // })
    // req.db.findCategoryKeys({
    //     recipeId
    // })
    // .then((categoryKey) => {
        
    // })
})

app.put('/api/recipe', (req, res) => {
    const recipeKey = {};
    const ingredientsKeys = [];
    const categoriesKeys = req.body.categories;
    const today = new Date();

    req.db.recipes.save({
        id: parseInt(req.body.id, 10),
        name: req.body.name,
        description: req.body.description,
        directions: req.body.directions,
        time: req.body.time,
        image: req.body.image,
    })
        .then(foundRecipe => {
            recipeKey.recipeId = foundRecipe.id;
        })
        .then(() => {
            const ingredientArr = req.body.ingredients.map((ingredient, i) => {
                return req.db.ingredients.find({
                    'name SIMILAR TO': ingredient
                })
            })
            return Promise.all(ingredientArr);
        })
        .then(foundIngredients => {
            const insertedIngredients = [];

            foundIngredients.forEach((ingredient, i) => {
                if (ingredient.length == 0) {
                    insertedIngredients.push(
                        req.db.ingredients.save({
                            name: req.body.ingredients[i],
                            date_added: today,
                            user_id: req.body.userId
                        })
                    )

                }
            })
            foundIngredients.forEach((ingredient, i) => {
                if (ingredient[0]) {
                    ingredientsKeys.push(ingredient[0].id);
                }
            })
            return Promise.all(insertedIngredients)
        })
        .then((insertedIngredients) => {
            insertedIngredients.forEach((ingredient) => {
                ingredientsKeys.push(ingredient[0].id);
            })
        })
        .then(() => {
            const foundJoinedRecipesIngredients = req.db.recipe_ingredients.find({
                    recipe_id: recipeKey.recipeId
                });
            const foundJoinedRecipesCategories = req.db.recipe_categories.find({
                    recipe_id: recipeKey.recipeId
                });
            return Promise.all([foundJoinedRecipesIngredients, foundJoinedRecipesCategories]);
        })
        .then(([foundJoinedRecipesIngredients,foundJoinedRecipesCategories]) => {

            // taking ingredient/category keys out of found objects
            const foundJoinedRecipesIngredientsKeys = foundJoinedRecipesIngredients.map((foundJoinedRecipeIngredient, i) => {
                return foundJoinedRecipeIngredient.ingredient_id
            })
            const foundJoinedRecipesCategoriesKeys = foundJoinedRecipesCategories.map((foundJoinedRecipeCategory, i) => {
                return foundJoinedRecipeCategory.category_id;
            })

            // filtering keys that need to be deleted from the join tables
            const ingredientKeysToDelete = foundJoinedRecipesIngredientsKeys.filter((ingredientKey, i) => {
                return !ingredientsKeys.includes(ingredientKey)
            })
            const categoryKeysToDelete = foundJoinedRecipesCategoriesKeys.filter((categoryKey, i) => {
                return !categoriesKeys.includes(categoryKey);
            })

            //filtering keys that need to be added to join tables
            const ingredientsKeysToAdd = ingredientsKeys.filter((ingredientKey, i) => {
                return !foundJoinedRecipesIngredientsKeys.includes(ingredientKey);
            })
            const categoriesKeysToAdd = categoriesKeys.filter((categoryKey, i) => {
                return !foundJoinedRecipesCategoriesKeys.includes(categoryKey);
            })

            ingredientKeysToDelete.map((ingredientKey, i) => {
                req.db.recipe_ingredients.destroy({
                    recipe_id: recipeKey.recipeId,
                    ingredient_id: ingredientKey
                });
            });
            categoryKeysToDelete.map((categoryKey, i) => {
                req.db.recipe_categories.destroy({
                    recipe_id: recipeKey.recipeId,
                    category_id: categoryKey
                });
            });
            ingredientsKeysToAdd.map((ingredientKey, i) => {
                req.db.recipe_ingredients.insert({
                    recipe_id: recipeKey.recipeId,
                    ingredient_id: ingredientKey
                });
            });
            categoriesKeysToAdd.map((categoryKey, i) => {
                req.db.recipe_categories.insert({
                    recipe_id: recipeKey.recipeId,
                    category_id: categoryKey
                })
            })
        })
        .then(() => {
            res.send({
                message: 'Recipe was successfully updated.'
            });
        })
        .catch(handleDbError(res));
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('this port is awesome', port)
});