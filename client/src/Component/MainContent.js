import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap'
import * as Icons from '../Icons.js'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

function MainContent(props) {

    return (
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
                        deleteTasks={props.deleteTasks} />
                </Col>
            </Row>
        </Container>

    )
}


function FilterGroup(props) {
    return (
        <>
            <ListGroup>
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
            <TaskTitle title={props.title} />
            {props.tasks.map((task, idx) => <TaskRow task={task} key={idx} deleteTasks={props.deleteTasks} />)}
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
    return (
        <>
            <Container >
                <Row className="d-flex justify-content-between border-bottom p-2">
                    <Col className="d-flex justify-content-start" >
                        <Form.Check
                            type="checkbox"
                            label={props.task.name}
                            className={props.task.important ? "font-weight-bold text-danger" : ""}
                        />
                    </Col>

                    <Col className="d-flex justify-content-center">
                        {props.task.private === true ? Icons.privateTask : " "}

                    </Col>

                    <Col className="d-flex justify-content-center">
                        {dayjs(props.task.date).format("DD-MM-YYYY")}

                    </Col>

                    <Col>
                        <Link to={{ pathname: "/update", state: { task: props.task ,taskDate: props.task.date.format('YYYY-MM-DD')} }}><Button className="mr-2" variant="warning" size="sm" >{Icons.editTask}</Button></Link>
                        <Button className="mr-2" variant="danger" size="sm" onClick={() => { props.deleteTasks(props.task.name) }}>{Icons.deleteTask}</Button>
                    </Col>

                </Row>

            </Container>

        </>
    )
}





export { MainContent }


// 