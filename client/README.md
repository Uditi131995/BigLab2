# `BigLab2-server`

Description of the application.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### List Tasks

URL: `/api/tasks`

HTTP Method: `GET`

Description: Retrieve the list of all the tasks

Request body: `EMPTY`

Response: 

Response body:
```
[ {id, description, important, private, deadline, completed, user}, ... ]
```
### Get a Task

URL: `/api/tasks/:id`

HTTP Method: `GET`

Description: Retrieve the attributes of the task with the specified id

Request body: `EMPTY`

Response: 

Response body:
```
{id, description, important, private, deadline, completed, user}
```

### Filter list of Tasks

URL: `/api/tasks/filter/:filter`

HTTP Method: `GET`

Description: Retrieve the list of tasks that fulfill the filter request

Request body: `EMPTY`

Response: 

Response body:
```
[ {description, important, private, deadline, completed, user}, ... ]
```


### Add a new Task

URL: `/api/tasks`

HTTP Method: `POST`

Description: Add a new Task in the database

Request body: 
``` 
{description, important, private, deadline, user} 
```

Response: 

Response body: `EMPTY`


### Update a Task

URL: `/api/tasks/:id`

HTTP Method: `PUT`

Description: Update the attribute of the task with the specified id

Request body: 
``` 
{description, important, private, deadline, user} 
```

Response: 

Response body: 
```
{message}
```

### Delete a Task

URL: `/api/tasks/:id`

HTTP Method: `DELETE`

Description: Delete the task with the specified id

Request body: `EMPTY`

Response: 

Response body: `EMPTY`