import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import * as Icons from '../Icons.js'
function NavbarContent(props) {
    return (
        <>
            <Navbar className="d-flex justify-content-between" bg="success" expand="lg" >
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
                    {Icons.User}
                </Nav.Item>
                
            </Navbar>
        </>
    )
}

export { NavbarContent }