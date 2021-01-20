import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import { render } from '@testing-library/react';
import axios from 'axios';

class UpdateUser extends Component{
    constructor(props){
        super(props);
        this.state={
            firstName:'',
            lastName:'',
            email: '',
            bio:'',
            telnum:'',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setUpData= this.setUpData.bind(this);
    }

    setUpData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/recruiters/me",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response.data);
            alert(JSON.stringify(response.data));
            this.setState({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                telnum: response.data.telnum,
                bio:response.data.bio
            })
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
            }
        });
    }

    componentDidMount(){
        this.setUpData();
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

    handleSubmit(event) {
        alert('Current State is: ' + JSON.stringify(this.state));
        axios({
            method: "PUT",
            url: "http://localhost:3000/recruiters/me",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Done");
            console.log(response)
        }).catch(error => {
            alert("Not Done!!");
            if (error) {
                console.log(error.response);
            }
        });
        event.preventDefault();
    }

    render(){
        return(
            <div className="container">
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Label htmlFor="firstName" md={2}>First Name</Label>
                                <Col md={10}>
                                    <Input type="text" id="firstName" name="firstName"
                                        placeholder="First Name"
                                        value={this.state.firstName}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="lastName" md={2}>Last Name</Label>
                                <Col md={10}>
                                    <Input type="text" id="lastName" name="lastName"
                                        placeholder="Last Name"
                                        value={this.state.lastName}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                            <Label htmlFor="telnum" md={2}>Contact Number</Label>
                                <Col md={10}>
                                    <Input type="tel" id="telnum" name="telnum" placeholder="Contact Number" onChange={this.handleInputChange} value={this.state.telnum}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="bio" md={2}>Your Bio</Label>
                                <Col md={10}>
                                    <Input type="textarea" id="bio" name="bio" rows="6" value={this.state.bio} onChange={this.handleInputChange} ></Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size: 10, offset: 2}}>
                                    <Button type="submit" color="primary">
                                        Edit
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
export default UpdateUser;