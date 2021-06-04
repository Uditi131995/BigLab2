const url = 'http://localhost:3000';

//------------------LogIn a user---------------------------------
async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  //-----------------Logout a user ------------------------

  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }

  async function getUserInfo() {
    const response = await fetch( url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
   
    }
  }

//-----------Display Tasks ---------------------------
async function loadAllTasks() {
    try {
        const response = await fetch(url + '/api/tasks').then(response => {
            //Always check if the response is ok or not 
            if (!response.ok)
                throw Error(response.status)
            return response;
        });
        const fetchedTasks = await response.json();
        return fetchedTasks;
    }
    catch (error) {
        console.log(error)
    }
}

async function loadAllTasksByUserId(id) {
  try {
      const response = await fetch(url + '/api/tasks/user/' + id).then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const fetchedTasks = await response.json();
      return fetchedTasks;
  }
  catch (error) {
      console.log(error)
  }
}
//-------------------Add Task----------------------------------
// Receive a task as object with all the properties which needs to get added 
async function addTask(task) {
    const response = await fetch(url + '/api/addtask',
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...task })
        });
    if (response.ok) {
        return null;
    } else return { 'err': 'POST error' }

}

//-------------------Delete Task By id  ----------------------------------
async function deleteTask(id) {
     await fetch(url + '/api/deletetask/' + id , { method :"DELETE"})
     //const response =
    // if (response.ok) {
    //     return null
    // } else return { 'err': 'Delete error' }

}

// ------------------------Edit Task By Id ----------------------------------

async function updateTask(task){
   const response =await fetch (url + '/api/updatetask/' + task.id, 
   {
    method :"PUT",
    headers :{"Content-Type": "application/json"},
    body:JSON.stringify({...task})
   });
   if(response.ok){
       return null;
    } else return {'err' : 'PUT error'}

}

//----------------------------Filter the Task---------------------
async function filterTask(filter , id ){
    try {
        const response = await fetch(url + '/api/tasks/filter/' + filter +'/user/' + id  ).then(response => {
            //Always check if the response is ok or not 
            if (!response.ok)
                throw Error(response.status)
            return response;
        });
        const fetchedTasks = await response.json();
        return fetchedTasks;
    }
    catch (error) {
        console.log(error)
    }
}



const API = { loadAllTasks, addTask, deleteTask, updateTask,filterTask , logIn , logOut , loadAllTasksByUserId, getUserInfo};
export default API;