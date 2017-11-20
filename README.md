# Is Stauffer Stuffed?

A Node.js application, using Express, that keeps track of the population of Stauffer Library.

An external robot utilizes rangefinders to keep track of when users are entering and leaving Stauffer Library, and then sends minutely updates to this application, which then updates the PostgreSQL database.

The application also humourously counts 'calories saved' by counting the number of users visiting the application. As users can determine if Stauffer Library is full or not by visiting this site and not personally walking there, we can boldly claim to save user precious walking calories. The exact formula for this is [ Total Visitor Count * 60 calories ]. 60 calories is considered the average calories expended for a 10 minutes walk. 

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/HyunHeo/is-stauffer-stuffed.git # or clone your own fork
$ cd is-stauffer-stuffed
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
