import { Form, Col, Container, Button } from 'react-bootstrap'
import { useState } from 'react'
import dayjs from 'dayjs'
import {Link, Redirect, useLocation} from 'react-router-dom'
    
function TaskForm(props) {
    const location =useLocation();
    //location.state is defined=>we are in update mode , and location.state.name contains the first value
    //location.state is undefined and we are in add mode

    const [taskname, setTaskname] = useState(location.state ? location.state.task.name : '');
    const [date, setDate] = useState(location.state? location.state.taskDate: '');
    const [important, setImportant] = useState(location.state? location.state.task.important : false);
    const [pvt, setPvt] = useState( location.state? location.state.task.private : false);
    const [validName, setValidName] = useState(true);
    const [validDate, setValidDate] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [dateErrorMessage, setdateErrorMessage] = useState("");
    const [submitted, setsubmitted] =useState(false)

   

    const handleAdd = (event) => {
        event.preventDefault(); // prevent the form to send to the server

        //MUST DO VALIDATION before adding the task
        let valid = true;
        // Task Name validation 
        if (taskname === '' ) 
        {
             valid = false;
             setValidName(false)
             setErrorMessage("Please, insert a name for the task and in letters")
        } 
        else if (taskname.match("^[0-9]+$")) {
            valid = false;
            setValidName(false);
            setErrorMessage("Please , only letters")
        }
        else
        {
            setValidName(true);
        }

        // Task Date Validation 
    
        if( date && dayjs(date).isBefore(dayjs(), 'date'))
        {
            valid = false;
            setValidDate(false);
            setdateErrorMessage("please choose a date for today or future...")
        }
        
        else
        {
            setValidDate(true);
        }   


    if (valid) {
        const task = { 
            name: taskname, 
            private: pvt, 
            important: important, 
            date: dayjs(date) 
        }
        props.addorUpdateTask(task)
        // As soon we submit the form we need to go back to the home page 
        setsubmitted(true)
    } 
   

}

// submitted inilially is false when i add a task I set the submitted true ,
// so the state is changing so the component is again getting re render and when submmitted = true
// I force it to redirect to the main page
// Means when my form is submitted its not anymore important to render the form 
return (
    <>
    {submitted && <Redirect to ='/'/>}
        <Container>
            <Form>
                <Form.Row>
                    <Col xs={6}>
                        <Form.Group controlId='taskName'>
                            <Form.Label>Task</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Please enter the task name"
                                value={taskname}
                                maxLength="30"
                                disabled={location.state}
                                onChange={(event) => { setTaskname(event.target.value) }}
                               >
                                </Form.Control>
                                {validName ? "" :  <Form.Text className="pl-3 font-weight-bold text-monospace text-danger">{errorMessage}</Form.Text>}

                        </Form.Group>
                    </Col>

                    <Col xs={6}>
                        <Form.Group controlId='taskDate'>
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Please enter the task date"
                                value={date}
                                onChange={(event) => { setDate(event.target.value) }}
                            >
                            </Form.Control>
                            {validDate ? "" :  <Form.Text className="pl-3 font-weight-bold text-monospace text-danger">{dateErrorMessage}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Form.Row>

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
                <Button variant="success" type="submit" onClick={handleAdd}>Add </Button>
               <Link to ="/"> <Button variant ="secondary" type ="cancel" >Cancel</Button></Link>
                <br />
            </Form>
            
        </Container>

    </>
)
}
export { TaskForm }
