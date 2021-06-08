import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarContent } from './Component/NavbarContent';
import { MainContent } from './Component/MainContent';
import { TaskForm } from './Component/TaskForm'
//import dayjs from 'dayjs'
import './Style.css';
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { LoginForm } from './Component/LoginComponents';

import API from './API';


//List of Filters
const filters = ["All", "Important", "Today", "Private", "Next7Days"];

function App() {
  const [message, setMessage] = useState('');
  // at the beginning, no user is logged in
  const [loggedIn, setLoggedIn] = useState(false);
  //To decide to show the button add or edit
  const [taskType, setTaskType] = useState(false)
  // tasks -Array of objects state variable 
  const [tasks, setTasks] = useState([])
  // Object state for the load of the user 
  const [user, setUser] = useState({ name: '' });
  // taskListUpdated -Boolean State 
  const [taskListUpdated, setTaskListUpdated] = useState(false)

  // filter is a string state variable which is responsible for three things:
  // a. Active in the list group on onclick 
  // b. Change the title on the onclick 
  // c. Change the list to be displayed
  const [filter, setFilter] = useState(filters[0])

  // Rehydrate the tasks at the mount time 
  // useEffect(() => {
  //   try {
  //     API.loadAllTasks().then(response => {
  //       setTasks(response);
  //       //setLoading(false);
  //     });
  //   }
  //   catch (err) {
  //     console.log(`Something went Wrong: ${err.message} `)
  //   }
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // get the user object from the session
        // API.getUserInfo returns the user object
        // if there is an user stored in the cookies of the session
        // otherwise returns {error: "errorMessage"}
        const user = await API.getUserInfo();
        if (user.error === "not authenticated") {
          setLoggedIn(false);
          setUser({ name: "" })
          setTasks([])
        }
        else {
          setLoggedIn(true);
          setUser(user);
          setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
        }
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);
  // Rehydrate the tasks at the login 
  useEffect(() => {
    try {
      if (user.name)
        //****console.log("useEffect-id", user.id);
        API.loadAllTasksByUserId(user.id).then(response => {
          setTasks(response);
          //setLoading(false);
        });
    }
    catch (err) {
      console.log(`Something went Wrong: ${err.message} `)
    }
    // eslint-disable-next-line 
  }, [user]);

  // Load the new list of tasks after add , update , delete 
  useEffect(() => {
    try {
      if (taskListUpdated) {
        API.loadAllTasksByUserId(user.id).then(response => {
          setTasks(response);
        })
        setTaskListUpdated(false)
      }
    }
    catch (err) {
      console.log(`Something went Wrong: ${err.message} `)
    }
    // eslint-disable-next-line
  }, [taskListUpdated])


  useEffect(() => {
    try {
      if (user.name)
        API.filterTask(filter, user.id).then(response => {
          setTasks(response);
        })
    }
    catch (err) {
      console.log(`Something went Wrong: ${err.message} `)
    }
    // eslint-disable-next-line 
  }, [filter])

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user)
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      return true
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      return false 
     
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setTasks([]);

  }

  const changeFilter = (filter) => { setFilter(oldfilter => filter) };


  //Delete Task - Fetch call on onclick 
  const deleteTasks = (id) => {
    setTasks(oldState => oldState.filter(task => task.id !== id))
    API.deleteTask(id).then(result => {
      changeFilter(filter);
      //setTaskListUpdated(true);

    }).catch((err) => {
      console.log(`Something went Wrong: ${err.message} `)
    });
  }


  return (
    <Router> 
      <Switch>
        <Route path="/login" render={() =>
          <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
        } />
        <Route exact path="/" render={() => {
          return (
            <>
              {loggedIn ?
                <>
                  <NavbarContent doLogOut={doLogOut} message={message} loggedIn={loggedIn} />
                  <MainContent
                    filters={filters}                 //Filters passed in the fitergroup to show the list of filters
                    tasks={tasks}                     // tasks State variable responsible for render of the tasklist passed to the Taskgroup}
                    changeFilter={changeFilter}       // Reference to a function which shows the change of the filter passed to the Filtergroup
                    filter={filter}                   // filter State variable for 3 purposes passed to the FilterGroup(To show active in listgroup) and Taskgroup(Title Change)
                    deleteTasks={deleteTasks}         // Delete task is a refernce to a function for deleting task passed to the Taskgroup
                  />
                </>
                : <Redirect to="/login" />}

              <Link to="/add">
                <Button
                  id="plusButton"
                  variant="info"
                  className="rounded-circle"
                  onClick={() => setTaskType(true)}
                >
                  +
             </Button>
              </Link>
            </>
          );
        }
        }
        />

        <Route path="/add" render={() => {
          return (
            <>
              {loggedIn ?
                <TaskForm taskType={taskType}
                  setTaskListUpdated={setTaskListUpdated}
                  changeFilter={changeFilter}
                  filter={filter}
                  user={user} />
                : <Redirect to="/login" />}
            </>
          )
        }}
        />

        <Route path="/update" render={() => {
          return (
            <>
              {loggedIn ?
                <TaskForm tasks={tasks}
                  setTaskListUpdated={setTaskListUpdated}
                  changeFilter={changeFilter}
                  user={user} />
                : <Redirect to="/login" />}
            </>
          )
        }}
        />
      </Switch>
    </Router>
  );
}


export default App;

