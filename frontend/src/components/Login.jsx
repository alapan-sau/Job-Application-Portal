import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';


class Login extends Component{
    constructor(props){
        super(props);
		this.state = {
			email: '',
            password: '',
			bearerToken:''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserSubmit = this.handleUserSubmit.bind(this);
        this.handleRecruiterSubmit = this.handleRecruiterSubmit.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // console.log(name , value);
        this.setState({
        [name]: value
        });
    }

    handleUserSubmit(event) {
        // console.log('Current State is: ' + JSON.stringify(this.state));
        // alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
        if(!this.validateSubmit()){
            return;
        }
        axios({
            method: "POST",
            url: "http://localhost:3000/users/login",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            console.log(response);
            this.props.clogin('Bearer '+response.data.token,'user');
            window.location.replace("http://localhost:3001/users/dashboard");
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    handleRecruiterSubmit(event) {
        // console.log('Current State is: ' + JSON.stringify(this.state));
        // alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
        if(!this.validateSubmit()){
            return;
        }
        axios({
            method: "POST",
            url: "http://localhost:3000/recruiters/login",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            console.log(response);
            this.props.clogin('Bearer '+response.data.token,'recruiter');
            window.location.replace("http://localhost:3001/recruiters/dashboard");
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    validateSubmit(){
        const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
        if(!reg.test(this.state.email)){
            alert('Enter valid Email');
            return false;
        }
        if(this.state.password==''){
            alert("Enter password");
            return false;
        }
        return true;
    }

    render(){
        if(this.props.isLoggedIn===true){
            if(this.props.type==='user')
                return (<Redirect to='/users/dashboard'/>);
            else if(this.props.type==='recruiter'){
                return (<Redirect to='/recruiters/dashboard'/>)
            }
            else{
                return(<Redirect to='/'/>)
            }
        }
        return (
            <div className="container">
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        <p>Don't have an account already? <Link to='/signup'><Button>Sign up</Button></Link> </p>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Label htmlFor="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Input type="text" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="password" md={2}>Password</Label>
                                <Col md={10}>
                                <Input type="password" id="password" name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={()=>{this.handleBlur('password')}}
                                    onChange={this.handleInputChange} />
                                {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size: 3, offset: 3}}>
                                    <Button color="primary" onClick={this.handleUserSubmit}>
                                        Sign In as Applicant
                                    </Button>
                                </Col>
                                <Col md={{size: 3, offset: 1}}>
                                    <Button color="primary" onClick={this.handleRecruiterSubmit}>
                                        Sign In as Recruiter
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>

        );
    }
}

export default Login;