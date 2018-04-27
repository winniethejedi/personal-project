SELECT * FROM recipe_ingredients as ri
JOIN ingredients as i ON i.id = ri.ingredient_id
JOIN recipes as r on r.id = ri.recipe_id;