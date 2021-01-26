import React, {Component} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class HeaderRecruiter extends Component{
    constructor(props){
        super(props);
        this.toggleNav = this.toggleNav.bind(this);

        this.state = {
            isNavOpen : false,
        };
    }
    toggleNav ()
    {
        this.setState({
            isNavOpen : !this.state.isNavOpen
        });
    }
    render()
    {
        return(
            <div>
                <Navbar dark expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/recruiters/dashboard'><span className="fa fa-home fa-lg"></span>Dashboard</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/applications/selected'><span className="fa fa-info fa-lg"></span>Selected Employees</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link"  to='/recruiters/update'><span className="fa fa-list fa-lg"></span>My Profile</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link"  to='/createjob'><span className="fa fa-list fa-lg"></span>Create Job</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link"  to='/logout'><span className="fa fa-list fa-lg"></span>Log Out</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                <Jumbotron  style={{backgroundColor: '#8d76c2'}}>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1>Job Application Portal</h1>
                                <p>Search for the best employees!!</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}
export default HeaderRecruiter;