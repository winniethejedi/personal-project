const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


require('dotenv').config();

const app = express();

massive(process.env.CONNECTION_STRING)
    .then((db)=>{
        console.log('The server is connected to Massive');
        app.set('db', db);
    })
    .catch(err => {
        console.warn('Failed to connect to Massive:');
        console.error(err);
    });

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
}, (req, email, password, done) => {
    req.db.users.findOne({ email })
        .then(user => {
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return done('Invalid email or password');
            }
            
            delete user.password;
            
            done(null, user);
        })
        .catch(err => {
            done(err);
        });
}));

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
}, (req, email, password, done) => {
    if (!email || !password) {
        return done('Email and password are required');
    }
    
    const username = req.body.username;
    const today = new Date();


    req.db.findUser({username, email})
        .then(foundUser => {
            if (foundUser.length === 0){
                password = bcrypt.hashSync(password, bcrypt.genSaltSync(15));
    
                req.db.users.insert({ email, password, username:req.body.username, join_date: today.toLocaleString(), profile_pic: req.body.profile_pic})
                    .then(user => {
                        delete user.password;
                        
                        done(null, user);
                    })
                    .catch(err => done(err));
            }
            else return done('That email or username is already used')
        })
}));

passport.serializeUser((user, done) => {
    if (!user) {
        done('No user');
    }
    
    done(null, user);
});

passport.deserializeUser((user, done) => {
    const db = app.get('db');
    
    if (!db) {
        return done('Internal Server Error');
    }
    
    db.users.findOne({ id: user.id })
        .then(user => {
            if (!user) {
                return done(null, false);
            }
            
            delete user.password;
            
            done(null, user);
        })
        .catch(err => done(err));
});

app.use(cors());
app.use(bodyParser.json());

app.use(session({
    name: 'personal-project',
    secret: process.env.SESSION_SECRET,
    cookie: {
        //days hours minutes seconds milseconds
        expires:  5 * 24 * 60 * 60 *1000,
    },
    saveUninitialized: false,
    rolling: true,
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(checkDb());

app.post('/api/auth/login', passport.authenticate(['login']), (req, res) => {
    res.send({
        success: true,
        message: 'Logged in successfully',
        email: req.user.email,
        username: req.user.username,
        profile_pic: req.user.profile_pic,
        id: req.user.id
    });
    
});

app.post('/api/auth/register',  passport.authenticate(['register']), (req, res) => {
    
    res.send({
        success: true,
        message: 'Registered successfully',
        email: req.user.email,
        username: req.user.username,
        profile_pic: req.user.profile_pic,
        id: req.user.id
    });
});

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
        ... req.user
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
        user_id: req.user.id
    })
    .then(foundRecipe => {
        recipeKey.recipeId = foundRecipe.id;
    })
    .then(()=> {
        const ingredientArr =  req.body.ingredients.map((ingredient, i) => {
            return req.db.ingredients.find({
                'name SIMILAR TO': ingredient
            })
        })
        return Promise.all(ingredientArr)
    })
    .then(foundIngredients => {
        const insertedIngredients = [];
        
        foundIngredients.forEach((ingredient, i)=>{
            if (ingredient.length == 0) {
                insertedIngredients.push(
                    req.db.ingredients.insert({
                        name: req.body.ingredients[i],
                        date_added: today,
                        user_id: req.user.id
                    })
                )

            }
        })
        foundIngredients.forEach((ingredient, i)=>{
            if(ingredient[0]){
                ingredientsKeys.push(ingredient[0].id);
            }
        })
        return Promise.all(insertedIngredients)
    })
    .then((insertedIngredients)=>{
        insertedIngredients.forEach((ingredient)=>{
            ingredientsKeys.push(ingredient[0].id);
        })
    })
    // .then((ingredients) => {

    //     const mappedCategories = req.body.categories.map((category, i) => {
    //         return req.db.categories.findOne({
    //             name: category
    //         })
    //     })
    //     return Promise.all(mappedCategories)
    // })
    // .then(mappedCategories => {
    //     const newlyMappedCategories = mappedCategories.map((category, i) => {
    //         categoriesKeys.push(category.id)
    //     })
    // })
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

app.post('/api/recipes', (req, res) => {
    req.db.recipes.find({
        user_id: req.user.id
    })
        .then(recipes => {
            res.send(recipes);
        })
})

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log('this port is awesome', port)
});

function checkDb() {
    return (req, res, next) => {
        const db = app.get('db');
        
        if (db) {
            req.db = db;
            next();
        }
        else {
            res.status(500).send({ message: 'this died' });
        }
    };
}

function handleDbError(res) {
    return (err) => {
        console.warn('hit a snag');
        console.error(err);
        
        if (err.code == 'ECONNRESET') {
            return res.status(500).send({ message: 'something died again' });
        }
        if (err.code == '22P02') {
            res.status(422).send({ message: 'The request had incorrect or missing properties: ' + err.message });
        }
        res.status(500).send({ message: 'Internal Server Error' })
    };
}
