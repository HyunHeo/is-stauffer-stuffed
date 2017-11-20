const pg = require('pg');
const cool = require('cool-ascii-faces');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {

      // Render page with stats
      client.query('SELECT visitors FROM webstats', function(err, result) {
        done();
        if (err) {
          console.error(err); response.send("Error " + err);
        }
        else {
          let webstats = result.rows;

          // Increment visitor count
          visitorsPlusOne = result.rows[0].visitors + 1;
          updateQuery = 'UPDATE webstats SET visitors = ' + visitorsPlusOne;
          client.query(updateQuery, function(err, result) {
            done();
            if (err) {
              console.error(err);
              response.send("Error " + err);
            }
            else {
              //Success
            }
          });

          // Get library population
          client.query('SELECT * FROM libraries', function(err, result) {
            done();
            if (err){
              console.error(err); response.send("Error " + err);
            }
            else {

              let message1 = "Yo";
              let message2 = "Lo";

              libraries = result.rows;

              libraries.forEach(function(library) {
                if (library.population < 300 ){
                  message1 = library.name + " is starving.";
                  message2 = "Seize thou favourite seat.";
                }
                else if (library.population < 600 ){
                  message1 = library.name + " is ripe for the taking!";
                  message2 = "Great time to study with friends.";
                }
                else if (library.population < 800 ){
                  message1 = library.name + " is sated.";
                  message2 = "Still good to go, but a little crowded.";
                }
                else if (library.population < 1000 ){
                  message1 = library.name + " is stuffed!";
                  message2 = "Come at your own risk.";
                }
                else {
                  message1 = "Stauffer is OVERstuffed!";
                  message2 = "This is why the world needs to stop having kids.";
                }
              });

              response.render('pages/index', {libraries: libraries, webstats: webstats, message1: message1, message2: message2} );
            }
          })
        }
      });
    });
  })
  .get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM libraries', function(err, result) {
        done();
         if (err)
         { console.error(err); response.send("Error " + err); }
         else
         { response.render('pages/db', {results: result.rows} ); }
      });
    });
  })
  // Testing visit counter
  .get('/visited', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT visitors FROM webstats', function(err, result) {
        done();
        if (err) {
          console.error(err); response.send("Error " + err);
        }
        else {
          console.log("Visitors: " + result.rows[0].visitors);
          console.log("Visitors: " + JSON.stringify(result));
          visitorsPlusOne = result.rows[0].visitors + 1;
          updateQuery = 'UPDATE webstats SET visitors = ' + visitorsPlusOne;
          client.query(updateQuery, function(err, result) {
            done();
            if (err) {
              console.error(err); response.send("Error " + err);
            }
            else {
              response.send(200);
            }
          });
        }
      });
    });
  })
  // Incrementing library population
  .get('/population/reset', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
          updateQuery = 'UPDATE libraries SET population = 0';
          client.query(updateQuery, function(err, result) {
            done();
            if (err) {
              console.error(err); response.send("Error " + err);
            }
            else {
              response.send(200);
            }
          });
    });
  })
  .get('/population/:change/:num', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT population FROM libraries', function(err, result) {
        done();
        if (err) {
          console.error(err); response.send("Error " + err);
        }
        else {
          let newPopulation = result.rows[0].population;

          if (request.params.change == "increase"){
            newPopulation += parseInt(request.params.num)
          }
          else if (request.params.change == "decrease"){
            newPopulation -= parseInt(request.params.num)
          }
          else if (request.params.change == "reset"){
            newPopulation = 0
          }
          else {
            console.error("Incorrect change parameter."); response.send("Incorrect change parameter.");
          }

          updateQuery = 'UPDATE libraries SET population = ' + newPopulation;
          client.query(updateQuery, function(err, result) {
            done();
            if (err) {
              console.error(err); response.send("Error " + err);
            }
            else {
              response.send(200);
            }
          });
        }
      });
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
