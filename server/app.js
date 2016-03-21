var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/taskMaster';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS tasks (' +
    'id SERIAL PRIMARY KEY,' +
    'task_name varchar(100) NOT NULL,' +
    'status boolean DEFAULT false);'
  );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    done();
  });
}
});

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/tasks', function(req, res) {
  console.log('body: ', req.body);
  var task_name = req.body.task_name;
  var status = req.body.status;


  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO tasks (task_name, status) VALUES ($1, $2) ' +
      'RETURNING id, task_name, status', [task_name, status]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

app.get('/tasks', function(req, res){
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT * FROM tasks;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

app.delete('/tasks', function(req, res) {
  console.log('body: ', req.body);
  var id = req.body.id;


  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('DELETE FROM tasks WHERE id =($1)', [id]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

app.put('/tasks', function(req, res) {
  console.log('body: ', req.body);
  var id = req.body.id;


  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('UPDATE tasks SET status=true WHERE id =($1)', [id]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename)); // ..../server/public/filename
});

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
