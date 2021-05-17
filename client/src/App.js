import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarContent } from './Component/NavbarContent';
import { MainContent } from './Component/MainContent';
import { TaskForm } from './Component/TaskForm'
import dayjs from 'dayjs'
import './Style.css';
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch, Link, } from 'react-router-dom'



//List of Filters
const filters = ["All", "Important", "Today", "Private", "Next 7 Days"];
//List of tasks
const myTasks = [
  { name: "Study for the exam", private: true, important: false, date: dayjs('2021-04-27') },
  { name: "Monday Big Lab", private: false, important: true, date: dayjs('2021-04-30') },
  { name: "Laundry", private: true, important: false, date: dayjs('2021-04-28') },
  { name: "Buying Groceries", private: false, important: true, date: dayjs('2021-04-29') },
];

function App() {


  // Tasks array of objects state variable 
  const [tasks, setTasks] = useState(myTasks)

  const deleteTasks = (name) => {
    setTasks(oldState => {
      return oldState.filter(task => task.name !== name)
    })
  }

  const addTask = (newTask) => {
    setTasks(oldState => [...oldState, newTask])
  }

  const updateTask = (editTask) => {
    setTasks(oldState => {
      return oldState.map(
        (task) => task.name === editTask.name ? editTask : task
      )
    }
    );
  }
  // filter is a string state variable which is responsible for three things:
  // a. Active in the list group on onclick 
  // b. Change the title on the onclick 
  // c. Change the list to be displayed
  // So each time the onclick is changed it will set the new state using setstate , which will change the props and the component will re-render 

  const [filter, setFilter] = useState(filters[0])
   
  const  changeFilter= (filtername) => {
     setFilter(oldfilter => {
       return (filtername)
     });

   }

  const filterType = {
    'All': () => { return tasks },
    'Important': () => { return tasks.filter(task => task.important === true) },
    'Today': () => { return tasks.filter(task => dayjs(task.date).isSame(dayjs(), 'date')) },
    'Private': () => { return tasks.filter(task => task.private === true) },
    'Next 7 Days': () => { return tasks.filter(task => dayjs(task.date).isAfter(dayjs(),'day') && dayjs(task.date).isBefore(dayjs().add(7, 'day'))) },
  }


  return (
    <Router>
      <Switch>

      <Route exact path ="/" render={() => {
          return (
            <>
              <NavbarContent />
              <MainContent
                filters={filters}                 //Filters passed in the fitergroup to show the list of filters
                tasks={filterType[filter]()}      // tasks State variable responsible for render of the tasklist passed to the Taskgroup
                changeFilter={changeFilter}       // Reference to a function which shows the change of the filter passed to the Filtergroup
                filter={filter}                   // filter State variable for 3 purposes passed to the FilterGroup(To show active in listgroup) and Taskgroup(Title Change)
                deleteTasks={deleteTasks}         // Delete task is a refernce to a function for deleting task passed to the Taskgroup

              />
              <Link to="/add">
                <Button
                  id="plusButton"
                  variant="success"
                  className="rounded-circle"
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
            <TaskForm addorUpdateTask={addTask} />     // Reference to a function to add a Task
          );
        }} />

        <Route path="/update" render={() => {
          return (
            <TaskForm addorUpdateTask={updateTask} />  // Refernce to a function to delete a Task
          );
        }} />

      </Switch>
    </Router>
  );
}

export default App;


//<Route exact path="/" render={() => {
