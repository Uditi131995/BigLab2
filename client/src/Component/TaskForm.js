import { Form, Col, Container, Button , Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Link, Redirect, useLocation } from 'react-router-dom'
import API from '../API';

function TaskForm(props) {
    const location = useLocation();
    //location.state is defined=>we are in update mode , and location.state.name contains the first value
    //location.state is undefined and we are in add mode
    const [taskname, setTaskname] = useState(location.state ? location.state.task.description : '');
    const [date, setDate] = useState(location.state ? location.state.task.deadline : '');
    const [important, setImportant] = useState(location.state ? location.state.task.important : false);
    const [pvt, setPvt] = useState(location.state ? location.state.task.private : false);
    const [validName, setValidName] = useState(true);
    const [validDate, setValidDate] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [dateErrorMessage, setdateErrorMessage] = useState("");
    const [submitted, setsubmitted] = useState(false);
    const [addTaskStatus, setAddTaskStatus] = useState(false);
    const [editTaskStatus, setEditTaskStatus] = useState(false);

    useEffect(() => {
        if (addTaskStatus) {
            API.addTask(
                ({
                    description: taskname,
                    important: important,
                    private: pvt,
                    deadline: date,
                    completed: 0,
                    user: props.user.id
                })
            )
            setAddTaskStatus(false)
             //console.log(` Filter Name : ${props.filter}`)
            props.setTaskListUpdated(true)
            props.changeFilter('All')
            setsubmitted(true) // As soon we submitted=true go back to the home page 
           
            
            
        }
        // eslint-disable-next-line
    }, [addTaskStatus]);



    // UseEffect for edit Task 
    useEffect(() => {
        if (editTaskStatus) {
            API.updateTask(
                ({
                    user: props.user.id,
                    description: taskname,
                    important: important,
                    private: pvt,
                    deadline: date,
                    completed: location.state.task.completed,
                    id: location.state.task.id,

                })
            )
            setEditTaskStatus(false)
            props.setTaskListUpdated(true)
            props.changeFilter('All')  // Setting this as a expression is possible and not as {props.filter} because changefilter is a callback which will be executed when the onclick will be called on the listgroup.item
            setsubmitted(true) // As soon we submitted=true go back to the home page 
          
        }
        // eslint-disable-next-line
    }, [editTaskStatus]);

    // ADD 
    const handleAdd = (event) => {
       // prevent the form to send to the server
        event.preventDefault();
        //MUST DO VALIDATION before adding the task
        let valid = true;
        // Task Name validation 
        if (taskname === '') {
            valid = false;
            setValidName(false)
            setErrorMessage("Please, insert a name for the task and in letters")
        }
        else if (taskname.match("^[0-9]+$")) {
            valid = false;
            setValidName(false);
            setErrorMessage("Please , only letters")
        }
        else {
            setValidName(true);
        }

        // Task Date Validation 

        if (date && dayjs(date).isBefore(dayjs(), 'date')) {
            valid = false;
            setValidDate(false);
            setdateErrorMessage("please choose a date for today or future...")
        }

        else {
            setValidDate(true);
        }
        if (valid) {
            setAddTaskStatus(true);

        }
    }


    // EDIT
    const handleEdit = (event) => {
        event.preventDefault();
        let valid = true;
        // Task Name validation 
        if (taskname === '') {
            valid = false;
            setValidName(false)
            setErrorMessage("Please, insert a name for the task and in letters")
        }
        else if (taskname.match("^[0-9]+$")) {
            valid = false;
            setValidName(false);
            setErrorMessage("Please , only letters")
        }
        else {
            setValidName(true);
        }

        // Task Date Validation 

        if (date && dayjs(date).isBefore(dayjs(), 'date')) {
            valid = false;
            setValidDate(false);
            setdateErrorMessage("please choose a date for today or future...")
        }

        else {
            setValidDate(true);
        }
        if (valid) {
        setEditTaskStatus(true)
        }
    }

    return (
        <>
            {submitted && <Redirect to='/' />}
            <Container>
                <br />
                <Row className="justify-content-md-center">
                <Col className="border rounded-lg" md={4} sm={12}>
               <br />
                <h3 style={{ color: '#17a2b8'  }}>Add Tasks</h3>
                <Form>
                   
                            <Form.Group controlId='taskName'>
                                <Form.Label>Task</Form.Label>
                                <Form.Control
                                    required
                                    isInvalid={!validName}
                                    type="text"
                                    placeholder="Please enter the task name"
                                    value={taskname}
                                    maxLength="30"
                                    onChange={(event) => { setTaskname(event.target.value) }}
                                    onKeyPress={(ev)=>{
                                        if(ev.key==='Enter'){
                                            ev.preventDefault();
                                            handleAdd();
                                        }
                                    }}
                                >
                                </Form.Control>
                                {validName ? "" : <Form.Text className="pl-3 font-weight-bold text-monospace text-danger">{errorMessage}</Form.Text>}

                            </Form.Group>
                       
                            <Form.Group controlId='taskDate'>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    isInvalid={!validDate}
                                    type="date"
                                    placeholder="Please enter the task date"
                                    value={date}
                                    onChange={(event) => { setDate(event.target.value) }}
                                >
                                </Form.Control>
                                {validDate ? "" : <Form.Text className="pl-3 font-weight-bold text-monospace text-danger">{dateErrorMessage}</Form.Text>}
                            </Form.Group>
                    

                    <Form.Row>
                        <Col>
                            <Form.Group controlId='selectedImportant'>
                                <Form.Check
                                    type="checkbox"
                                    label="Important"
                                    checked={important}
                                    onChange={(event) => { setImportant(event.target.checked) }}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId='selectedPrivate'>
                                <Form.Check
                                    type="checkbox"
                                    label="Private"
                                    checked={pvt}
                                    onChange={(event) => { setPvt(event.target.checked) }}
                                />
                            </Form.Group>

                        </Col>
                    </Form.Row>
                    {props.taskType === true ? <Button  style={{ margin: '3px' }}  variant="info" onClick={handleAdd}>Add</Button> : <Button variant="info"  style={{ margin: '3px' }} onClick={handleEdit}>Edit</Button>}

                    <Link to="/">
                        <Button  style={{ margin: '3px' }} variant="secondary" type="cancel" >Cancel
                    </Button>
                    </Link>
                    <br />
                </Form>
                <br />
               </Col>
                 </Row>

            </Container>

        </>
    )
}
export { TaskForm }


