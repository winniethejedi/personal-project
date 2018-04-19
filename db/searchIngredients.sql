SELECT * FROM ingredients
WHERE name = ANY${ingredients}::text[];