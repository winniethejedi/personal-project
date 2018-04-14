CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    username VARCHAR,
    password VARCHAR,
    join_date DATE,
    profile_pic VARCHAR
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    directions VARCHAR,
    time INT,
    image VARCHAR,
    date_added DATE
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    date_added DATE,
    user_id INT
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR
);

CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT,
    ingredient_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE recipe_categories (
    id SERIAL PRIMARY KEY,
    recipe_id INT,
    category_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

SELECT * FROM users;
SELECT * FROM recipes;
SELECT * FROM ingredients;
SELECT * FROM categories;
SELECT * FROM recipe_ingredients;
SELECT * FROM recipe_categories;