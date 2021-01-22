import React, {Component} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink, Redirect } from 'react-router-dom';

class Logout extends Component{
    constructor(props){
        super(props);
        this.handleYes = this.handleYes.bind(this);
        this.handleNo = this.handleNo.bind(this);
    }

    handleYes(){
        this.props.clogout();
        console.log('here');
    }

    handleNo(){
        // DO NOTHING
        return;
    }

    render()
    {
        return(
            <div>
                <p>Hey User, Are you sure you want to Logout ?</p>
                <Button onClick={this.handleYes}>Yes</Button>
                <Button onClick={this.handleNo}>No</Button>
            </div>
        );
    }
}
export default Logout;