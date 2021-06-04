'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');
const dayjs = require("dayjs");

// list of filters
const filters = ["All", "Important", "Today", "Private", "Next7Days"];

// open the database 
const db = new sqlite.Database('tasks.sqlite', (err) => {
    if (err) throw err;
});

//GET all the tasks 

exports.listTasks = () => {
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM tasks';

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            // specify all the object you wanna return 
            const tasks = rows.map((e) => {
                return ({
                    id: e.id,
                    description: e.description,
                    important: e.important,
                    private: e.private,
                    deadline: e.deadline,
                    completed: e.completed,
                    user: e.user
                });
            });
            resolve(tasks);
        });

    });

};

// list of tasks by userId 
exports.listTasksByUser = (userId) => {
    return new Promise((resolve, reject) => {

        const sql = "SELECT * FROM tasks where user = ?";

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if(rows ===undefined){
                reject({ errorMessage: "Tasks not found." });
            }
            else {
                //*****console.log(rows);
            // specify all the object you wanna return 
            const tasks = rows.map((e) => {
                return ({
                    id: e.id,
                    description: e.description,
                    important: e.important,
                    private: e.private,
                    deadline: e.deadline,
                    completed: e.completed,
                    user: e.user
                });
            });
            //*****console.log(tasks)
            resolve(tasks);
        }
        });

    });

};

// add a new task
exports.createTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks( description, important, private, deadline, completed, user) VALUES(?,?,?, ?, ?,?)';
        db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.user ],
            function (err) {
                if (err) {
                    reject(err);
                    return console.log(err);
                }
                resolve(this.lastID);
            });
    });
};

//delete a task 
exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

//update a task
exports.updateTask = (id, task) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=?, user=? WHERE id = ?';
        db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.user, id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    })
}

// filter the tasks 
exports.filterTasks = (filter , id ) => {
    return new Promise((resolve, reject) => {
      if (filters.find(item => item === filter) == undefined) {
        reject({ errorMessage: "Filter not available!" });
        return;
      }
  
      const sql = {
        "All": 'SELECT * FROM tasks where user =?  ',
        "Important": "SELECT * FROM tasks WHERE important = 1 AND  user =? ",
        "Today": `SELECT * FROM tasks WHERE deadline = "${dayjs().format("YYYY-MM-DD")}" AND  user =?`,
        "Private": "SELECT * FROM tasks WHERE private = 1 AND  user=? ",
        "Next7Days": `SELECT * FROM tasks WHERE deadline >= "${dayjs().add("1", "day").format("YYYY-MM-DD")}" AND deadline <= "${dayjs().add("7", "days").format("YYYY-MM-DD")}" AND  user=?  `
      }
  
      db.all(sql[filter], [id], (err, rows) => {
  
        if (err) {
          reject(err);
          return;
        }
  
        if (rows === undefined) {
          reject({ errorMessage: `Filter ${filter} not available` });
          return;
        }
        else {
          const tasks = rows.map(item => {
            return ({
              id : item.id, 
              description: item.description,
              important: item.important ,
              private: item.private,
              deadline: item.deadline,
              completed: item.completed ,
              user: item.user
            });
  
          });
          resolve(tasks);
        }
  
      });
    });
  };
