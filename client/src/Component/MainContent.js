import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap'
import * as Icons from '../Icons.js'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import API from '../API.js'


function MainContent(props) {

    return (
        <>
            <Container fluid className=" vheight-100 m-2" >
                <Row>
                    <Col xs={4}>
                        {props.filters.map((filter, idx) =>
                            <FilterGroup
                                filter={filter}
                                key={idx}
                                action
                                active={props.filter === filter}
                                changeFilter={props.changeFilter}

                            />)}
                    </Col>
                    <Col xs={8} >
                        <TaskGroup
                            tasks={props.tasks}
                            title={props.filter}
                            deleteTasks={props.deleteTasks}
                            updateTask={props.updateTask}
                        />
                    </Col>
                </Row>
            </Container>
        </>

    )
}

function FilterGroup(props) {
    return (
        <>
            <ListGroup >
                <FilterRow
                    filter={props.filter}
                    active={props.active}
                    changeFilter={props.changeFilter}
                />
            </ListGroup>
        </>
    )
}

//changeactivefilter
function FilterRow(props) {
    return (
        <>
            <ListGroup.Item
                active={props.active}
                onClick={() => { props.changeFilter(props.filter) }}>
                {props.filter}
            </ListGroup.Item>

        </>
    )
}

function TaskGroup(props) {
    return (
        <>
            <TaskTitle
                title={props.title} />
            {props.tasks.map((task, idx) =>
                <TaskRow
                    task={task}
                    key={task.id}
                    id={task.id}
                    deleteTasks={props.deleteTasks}
                    updateTask={props.updateTask}
                    />)}
        </>

    )
}

function TaskTitle(props) {
    return (
        <>
            <h2>{props.title}</h2>

        </>
    )
}

function TaskRow(props) {
    const [completed, setCompleted] = useState(props.task.completed)

    return (
        <>
            <Container >
                <Row className="d-flex justify-content-between border-bottom p-2">
                    <Col className="d-flex justify-content-start" >
                        <Form.Check
                            type="checkbox"
                            label={props.task.description}
                            className={props.task.important ? "font-weight-bold text-danger" : ""}
                            checked={completed}
                            onChange={(event) => { 
                                 API.updateTask({...props.task , completed : event.target.checked})
                                setCompleted(event.target.checked) }}

                        />
                    </Col>

                    <Col className="d-flex justify-content-center">
                        {props.task.private === 1 ? Icons.privateTask : " "}


                    </Col>

                    <Col className="d-flex justify-content-center">
                        <div>
                            {props.task.deadline ? dayjs(props.task.deadline).format("YYYY-MM-DD") : " "}
                        </div>
                    </Col>

                    <Col>
                        <div className="d-flex justify-content-end">
                            <Link to={{ pathname: "/update", state: { task: props.task }}}>
                                <Button style={{ margin: '3px' }} variant="light" size="sm">{Icons.editTask}</Button>
                            </Link>
                            <Button style={{ margin: '3px' }} variant="light" size="sm" onClick={() =>props.deleteTasks(props.id)}>{Icons.deleteTask}</Button>
                        </div>
                    </Col>
                </Row>

            </Container>

        </>
    )
}





export { MainContent }


//taskDate:props.task.deadline.format('YYYY-MM-DD')
//</Link>
//checked={props.task.completed ? true : false}

