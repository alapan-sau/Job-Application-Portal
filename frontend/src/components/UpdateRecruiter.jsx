import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import { render } from '@testing-library/react';
import axios from 'axios';

import HeaderRecruiter from './HeaderRecruiter'

class UpdateUser extends Component{
    constructor(props){
        super(props);
        this.state={
            firstName:'',
            lastName:'',
            email: '',
            bio:'',
            telnum:'',
            touched:{
                firstName:false,
                lastName:false,
                email: false,
                bio:false,
                telnum:false,
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setUpData= this.setUpData.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validate = this.validate.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
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
            // alert(JSON.stringify(response.data));
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
        console.log(name , value);

        this.setState({
        [name]: value
        });
    }

    validate(firstName,lastName,email,telnum,bio) {
        console.log('called');
        const errors={
            firstName:'',
            lastName:'',
            email: '',
            telnum:'',
            bio:''
        };
        if(this.state.touched.firstName && (firstName.length === 0)){
            errors.firstName='First Name is required';
        }
        if(this.state.touched.lastName && (lastName.length===0)){
            errors.lastName='Last Name is required';
        }
        const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
        if(this.state.touched.email && !reg.test(email)){
            errors.email='Invalid Email';
        }
        const phonereg = /^\d{10}$/;
        if(this.state.touched.telnum && !phonereg.test(telnum)){
            errors.telnum='Invalid Phone Number';
        }
        let allWords = bio.split(' ');
        if(this.state.touched.bio && (allWords.length > 250)){
            errors.bio='Max Limit 250 words';
        }

        return errors;
    }

    validateSubmit(firstName,lastName,email,telnum,bio) {

        if((firstName.length === 0)){
            alert('First Name is required');
            return false;
        }
        if(this.state.touched.lastName && (lastName.length===0)){
            alert('Last Name is required');
            return false;
        }
        const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
        if(!reg.test(email)){
            alert('Invalid Email');
            return false;
        }
        const phonereg = /^\d{10}$/;
        if(this.state.touched.telnum && (!phonereg.test(telnum) && telnum!=='')){
            alert('Invalid Phone Number');
            return false;
        }
        let allWords = bio.split(' ');
        if(this.state.touched.bio && (allWords.length > 250)){
            alert('Max Limit 250 words');
            return false;
        }
        return true;
    }

    handleSubmit(event) {
        console.log('here');
        if(!this.validateSubmit(this.state.firstName, this.state.lastName, this.state.email, this.state.telnum, this.state.bio)){
            event.preventDefault();
            return;
        }
        console.log('yes');
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


    handleBlur = (field)=> {
        this.setState({
            touched:{...this.state.touched,[field]:true}
        });
    }

    render(){

        let errors = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.telnum, this.state.bio)
        // console.log(errors);
        // console.log(this.state)
        return(
            <div className="container">
                <HeaderRecruiter/>
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        <Form>
                            <FormGroup row>
                                <Label htmlFor="firstName" md={2}>First Name</Label>
                                <Col md={10}>
                                    <Input type="text" id="firstName" name="firstName"
                                        placeholder="First Name"
                                        value={this.state.firstName}
                                        valid={errors.firstName===''}
                                        invalid={errors.firstName!==''}
                                        onChange={this.handleInputChange}
                                        onBlur={()=>{this.handleBlur('firstName')}} />
                                        <FormFeedback>{errors.firstName}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="lastName" md={2}>Last Name</Label>
                                <Col md={10}>
                                    <Input type="text" id="lastName" name="lastName"
                                        placeholder="Last Name"
                                        value={this.state.lastName}
                                        onChange={this.handleInputChange}
                                        valid={errors.lastName===''}
                                        invalid={errors.lastName!==''}
                                        onChange={this.handleInputChange}
                                        onBlur={()=>{this.handleBlur('lastName')}} />
                                        <FormFeedback>{errors.lastName}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.handleInputChange}
                                        valid={errors.email===''}
                                        invalid={errors.email!==''}
                                        onChange={this.handleInputChange}
                                        onBlur={()=>{this.handleBlur('email')}} />
                                        <FormFeedback>{errors.email}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                            <Label htmlFor="telnum" md={2}>Contact Number</Label>
                                <Col md={10}>
                                    <Input type="tel" id="telnum" name="telnum" placeholder="Contact Number"
                                    onChange={this.handleInputChange}
                                    value={this.state.telnum}
                                    valid={errors.telnum===''}
                                    invalid={errors.telnum!==''}
                                    onChange={this.handleInputChange}
                                    onBlur={()=>{this.handleBlur('telnum')}} />
                                    <FormFeedback>{errors.telnum}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="bio" md={2}>Your Bio</Label>
                                <Col md={10}>
                                    <Input type="textarea" id="bio" name="bio" rows="6"
                                    value={this.state.bio}
                                    onChange={this.handleInputChange}
                                    valid={errors.bio===''}
                                    invalid={errors.bio!==''}
                                    onChange={this.handleInputChange}
                                    onBlur={()=>{this.handleBlur('bio')}} />
                                    <FormFeedback>{errors.bio}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size: 10, offset: 2}}>
                                    <Button type="submit" color="primary" onClick={this.handleSubmit}>
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