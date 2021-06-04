import { Navbar, Nav, Form, FormControl , Button } from 'react-bootstrap'
import * as Icons from '../Icons.js'
function NavbarContent(props) {
    return (
        <>
            <Navbar className="d-flex justify-content-between" bg="info" expand="lg" >
                {/* Logo and Title */}
                <Nav.Item  >
                    {Icons.logo}
                    <span style={{ color: 'white' }}>Todo Manager </span>
                </Nav.Item>

                {/* Search  */}
                <Nav.Item>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    </Form>
                </Nav.Item>

                {/* UserIcon  */}
                
                
                <Nav.Item> 
                {props.loggedIn ? <span style={{ color: 'white' }}>{props.message.msg }</span>  : Icons.User }
                <Button size="sm" style={{ margin: '3px' }}  variant="outline-light" onClick={props.doLogOut}>
                    Logout
                    </Button>
                </Nav.Item>
                
            </Navbar>
        </>
    )
}

export { NavbarContent }