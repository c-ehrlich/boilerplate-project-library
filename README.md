# Personal Library

Live demo: https://fcc-personal-library1.herokuapp.com/

## What is this?
A REST API to track read books, and tests for that API. Part of the [freeCodeCamp Curriculum](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/personal-library).

## Development Environment
* Clone down the repo
* Create a MongoDB Database. One possbility for this is using MongoDB Atlas.
* In the root directory of the project, create a .env file containing: `MONGO_URI: <your Mongo URI>`
* Install dependencies: `npm i`
* Start the server: `npm start`

## Deployment
Heroku is shown as a sample deployment because it's free and doesn't required a Procfile.

With the [Heroku CLI](https://devcenter.heroku.com/categories/command-line) installed,
```
heroku login -i
heroku create <app name>
heroku git:remote -a <app name>
git push heroku main
```
* Create a MongoDB Database. One possbility for this is using [MongoDB Atlas](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/).
* In the Heroku Project Settings, in Config Vars add key `MONGO_URI`, value is the URI of your MongoDB Database.

## Sample Requests
### Log a book
#### Request
```
POST https://fcc-personal-library1.herokuapp.com/api/books
{
    "title": "Eloquent JavaScript"
}
```
#### Response
```
{
    "title": "Eloquent JavaScript",
    "_id": "625ba75dcc65d3831c5a2a5f"
}
```
### Get all books
#### Request
```
GET https://fcc-personal-library1.herokuapp.com/api/books
```
#### Response
```
[
    {
        "_id": "625ba532cc65d3831c5a2a53",
        "title": "The Mythical Man-Month"
        "comments": [],
        "commentcount": 0
    },
    {
        "_id": "625ba532cc65d3831c5a2a56",
        "title": "Clean Code",
        "comments": [
            "nice book!"
        ],
        "commentcount": 1
    },
    {
        "_id": "625ba75dcc65d3831c5a2a5f",
        "title": "Eloquent JavaScript",
        "comments": [],
        "commentcount": 0
    }
]
```

### Get a single book
#### Request
```
GET https://fcc-personal-library1.herokuapp.com/api/books/<id>
```
#### Response
```
{
    "_id": "625ba532cc65d3831c5a2a56",
    "title": "Clean Code",
    "comments": [
        "nice book!"
    ],
    "commentcount": 1
}
```

### Comment on a book
#### Request
```
POST https://fcc-personal-library1.herokuapp.com/api/books/<id>
{
    "comment": "very nice book!"
}
```
#### Response
```
{
    "_id": "625ba532cc65d3831c5a2a56",
    "title": "Clean Code",
    "comments": [
    "nice book!",
        "very nice book!"
    ],
    "commentcount": 2
}
```

### Delete a book
#### Request
```
DELETE https://fcc-personal-library1.herokuapp.com/api/books/<id>
```
#### Successful Response
```
delete successful
```
#### No Book Found Response
```
no book exists
```

### Delete all books
#### Request
```
DELETE https://fcc-personal-library1.herokuapp.com/api/books
```
#### Response
```
complete delete successful
```
