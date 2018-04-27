// QUERY 1  SELECT * FROM recipes 
// QUERY 2  SELECT * FROM R_I WHERE id = indgredient id
// QUERY 3  SELECT * FROM R_C WHERE id = category id
// QUERY 4  SELECT * FROM ingredients WHERE id = indgredient id
// QUERY 5  SELECT * FROM categories WHERE id = category id

//QUERY 1

const data = r.map(item => {
    // QUERY 2
    // QUERY 4
    // APPEND DATA
    // QUERY 3
    // QUERY 5
    // APPEND DATA 
   }
   
   getRecipes()
    .then(recipes => {
      return Promise.all(recipes.map(recipe => {
        // ITERATION START

        // PROCESS 1
        const ingredientsPromise = getIngredientIds(recipe.id)
          .then(([ ids ]) => {
            debugger
            return Promise.all(ids.map(id => {
              return getIngredient(id).then(([ ingredient ]) => ingredient)
            }))
          })

        // PROCESS 2
        const categoriesPromise = getCategoryIds(recipe.id)
          .then(([ categoryIds ]) => {
            return Promise.all(categoryIds.map(id => {
              return getCategory(id).then(([ category ]) => category)
            }))
          })

        // RESOLVE THE PROCESSES && APPEND RESULT 
        return Promise.all([ingredientsPromise, categoriesPromise])
          .then(([ingredients, categories]) => {
            return Object.assign(recipe, ingredients, categories);
          })
          
        // ITERATION END
      }))
      .then((arrayOfRecipes) => {
        // DONE
      })
    })


   //STEP 2: filter data
   
   
   //STEP 3: return (edited)

   // Move data dump to front end
   // filter on front end

   //Process 1 Get recipe ids
   //Process 2 get from recipes_ingredients where ingredient_id = ingredient_id
   //Filter out duplicate recipes
   //Take the ids of the recipes and get the recipes from the table