const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session'); // session middleware

const dao = require('./taskdao'); // module for accessing the DB
const userDao = require('./userdao'); // module for accessing the DB


// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
  // verification callback for authentication
  userDao.getUser(username, password).then(user => {
    console.log("Login Failed" , user)
    if (user)
      done(null, user);
    else
      done(null, false, { message: 'Username or password wrong' });
  }).catch(err => {
    done(err);
  });
}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const PORT = 3001;
const app = new express();

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// initialize and configure HTTP sessions
app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

//Defines routes and web pages all will contain the session as its registered as middleware

// POST /login 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});
// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});

// Authenticated Routes = Only for authorized Users 



app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await dao.listTasks()
    res.json(tasks)
  } catch (err) {
    res.status(500).end();
  }
})

app.get('/api/tasks/user/:id', isLoggedIn, async (req, res) => {
  try {
    console.log("id", req.params.id)
    const tasks = await dao.listTasksByUser(req.params.id);
    res.json(tasks);
  }
  catch (err) {
    res.status(500).json(err);
}
});



//GET /tasks/filter/:filter  
app.get('/api/tasks/filter/:filter/user/:id',isLoggedIn, async (req, res) => {
  const filter = req.params.filter
  const id =req.params.id
  //console.log(`${filter}`)
  try {
    const tasks = await dao.filterTasks(filter , id);
    if (tasks.error)
      res.status(404).json(tasks);
    else
      res.json(tasks);
  } catch (err) {
    res.status(500).end();
  }
})


//POST/api/addtask
app.post('/api/addtask', isLoggedIn, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const id =req.params.id
  const task = {
    description: req.body.description,
    important: req.body.important,
    private: req.body.private,
    deadline: req.body.deadline,
    completed: req.body.completed,
    user: req.body.user,
  };
  try {
    await dao.createTask(task)
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ err: `Database error during the creation of task ${task.id}.` })
  }

})

//PUT /api/updatetask/<id>
app.put('/api/updatetask/:id', isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const task = {
    description: req.body.description,
    important: req.body.important,
    private: req.body.private,
    deadline: req.body.deadline,
    completed: req.body.completed,
    user: req.body.user,
  }
  try {
    await dao.updateTask(id, task);
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: `Database error during the updation of task ${req.params.id}.` });
  }
})


// DELETE /api/deletetask/<id>
app.delete('/api/deletetask/:id', isLoggedIn,async (req, res) => {
  try {
    await dao.deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of task ${req.params.id}.` });
  }
});



// This application will run when you call listen 
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));