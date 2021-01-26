import React, {Component} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input} from 'reactstrap';
import { NavLink, Redirect, Link } from 'react-router-dom';

class Logout extends Component{
    constructor(props){
        super(props);
        this.handleYes = this.handleYes.bind(this);
    }

    handleYes(){
        this.props.clogout();
        window.location.replace("http://localhost:3001/");
    }

    render()
    {
        if(this.props.isLoggedIn===false){
            return (<Redirect to='/' />);
        }

        let ButtonOut = null;
        console.log(this.props.type);
        if(this.props.type === 'user') ButtonOut = <Link to='users/dashboard'><Button>No</Button></Link>
        else if(this.props.type === 'recruiter'){
            ButtonOut = <Link to='recruiters/dashboard'><Button>No</Button></Link>
        }
        return(
            <div className="container">
                    <div className="row row-content">
                    <div className="col-12 col-md-9">
                <p>Hey User, Are you sure you want to Logout ?</p>
                <Button onClick={this.handleYes}>Yes</Button>
                {ButtonOut}
                {/* <Button>No</Button> */}
                </div>
                </div>
            </div>
        );
    }
}
export default Logout;