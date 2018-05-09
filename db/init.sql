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
    date_added DATE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    date_added DATE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
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

CREATE TABLE favorited_recipes (
    id SERIAL PRIMARY KEY,
    user_id INT,
    recipe_id INT,
    date_added DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

SELECT * FROM users;
SELECT * FROM recipes;
SELECT * FROM ingredients;
SELECT * FROM categories;
SELECT * FROM recipe_ingredients;
SELECT * FROM recipe_categories;
SELECT * FROM favorited_recipes;