CREATE FUNCTION find_related_ingredients(ingredient_names text[])
RETURNS SETOF fn_find_related_ingredients AS
$$
SELECT selected_car_tags.car_id, tags.tag_name FROM 
  recipe_ingredients
  JOIN
  ingredients AS i
  ON i.id = recipe_ingredients.ingredient_id,
  join
  recipes as r
  on r.id = recipe_ingredients.recipe_id
  where i.name in ($1);
$$ LANGUAGE sql;