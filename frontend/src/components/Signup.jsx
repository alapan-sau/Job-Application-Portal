import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import { render } from '@testing-library/react';
import axios from 'axios';

class Signup extends Component{
    constructor(props){
        super(props);
        this.state={
            formtype: '',
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            education:[{institute:'', start:'',end:''}],
            skill:[''],
            telnum:'',
            bio:'',
            touched : {
                firstName:false,
                lastName:false,
                email: false,
                password: false,
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.renderEducation = this.renderEducation.bind(this);
        this.addEducation = this.addEducation.bind(this);
        this.removeEducation = this.removeEducation.bind(this);
        this.renderSkill = this.renderSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeSkill= this.removeSkill.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // console.log(name , value);

        let tok = name.split('-');
        if(tok[0]==='education'){
            let ed = this.state.education;
            let pos = Number(tok[1]);
            let field = tok[2];
            ed[pos][field] = value;
            this.setState({education:ed});
        }
        else if(tok[0]==='skill'){
            let sk = this.state.skill;
            let pos = Number(tok[1]);
            sk[pos] = value;
            this.setState({skill:sk});
        }
        else{
            this.setState({
            [name]: value
            });
        }
    }

    validate(firstName,lastName,telnum,email) {
        const errors={
            firstName:'',
            lastName:'',
            telnum: '',
            email: ''
        };
        if(this.state.touched.firstName && (firstName.length<3 || firstName.length>=10)){
            errors.firstName='First Name should have 3-10 characters';
        }
        if(this.state.touched.lastName && (lastName.length<3 || lastName.length>=10)){
            errors.lastName='Last Name should have 3-10 characters';
        }
        const reg = /^\d+$/;
        if(this.state.touched.telnum && !reg.test(telnum)){
            errors.telnum='Telephone Number should have numbers';
        }
        return errors;
    }

    addEducation(){
        let ed = this.state.education;
        ed.push({institute:'', start:'',end:''});
        this.setState({education : ed});
    }

    removeEducation(idx){
        let ed = this.state.education;
        ed.splice(idx,1);
        this.setState({education : ed});
    }

    renderEducation(){
        let ed = this.state.education;
        let eds = ed.map((val,idx)=>{
            let edIdx = `education-${idx}`;
            return(
                <FormGroup row>
                <Label md={2}></Label>
                <Col md={6}>
                    <Input type="text" name={edIdx+'-institute'}
                        placeholder="Institute Name"
                        value={this.state.education[idx].institute}
                        onChange={this.handleInputChange} />
                    <Input type="number" name={edIdx+'-start'}
                        placeholder="Start Year"
                        value={this.state.education[idx].start}
                        onChange={this.handleInputChange} />

                    <Input type="number" name={edIdx+'-end'}
                        placeholder="End Year"
                        value={this.state.education[idx].end}
                        onChange={this.handleInputChange} />
                </Col>
                <Col md={1}>
                <Button
                onClick={(idx)=>{this.removeEducation(idx);}}>
                    -
                </Button>
                </Col>
                </FormGroup>
            )
        });
        return(
            <div>
                <FormGroup row>
                <Label md={2}>Education</Label>
                </FormGroup>
                {eds}
                <FormGroup row>
                <Label md={2}></Label>
                <Col md={10}>
                <Button color="primary"
                onClick={this.addEducation}>
                    +
                </Button>
                </Col>
                </FormGroup>
            </div>

        );

    }

    addSkill(){
        let sk = this.state.skill;
        sk.push('');
        this.setState({skill : sk});
    }

    removeSkill(idx){
        let sk = this.state.skill;
        sk.splice(idx,1);
        this.setState({skill : sk});
    }

    renderSkill(){
        let sk = this.state.skill;
        let sks = sk.map((val,idx)=>{
            let skIdx = `skill-${idx}`;
            return(
                <FormGroup row>
                <Label htmlFor="type" md={2}></Label>
                <Col md={3}>
                    <Input type="select" name={skIdx} value={this.state.skill[idx]} onChange={this.handleInputChange}>
                        <option value=''> Select Type</option>
                        <option>C++</option>
                        <option>Python</option>
                    </Input>
                </Col>
                <Col md={1}>
                <Button
                onClick={(idx)=>{this.removeSkill(idx);}}>
                    -
                </Button>
                </Col>
                </FormGroup>
            )
        });
        return(
            <div>
                <FormGroup row>
                <Label md={2}>Skills</Label>
                </FormGroup>
                {sks}
                <FormGroup row>
                <Label md={2}></Label>
                <Col md={10}>
                <Button color="primary"
                onClick={this.addSkill}>
                    +
                </Button>
                </Col>
                </FormGroup>
            </div>

        );
    }

    handleUserChange(){
        // console.log('Current State is: ' + JSON.stringify(this.state.formtype));
        if(this.state.formtype==="user"){
            let eds= this.renderEducation();
            let sks= this.renderSkill();
            return(
                <div>
                {eds}
                {sks}
                <FormGroup row>
                    <Label htmlFor="photo" md={2}>Profile Photo</Label>
                    <Col md={10}>
                        <Input type="file"/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label htmlFor="resume" md={2}>Resume</Label>
                    <Col md={10}>
                        <Input type="file"/>
                    </Col>
                </FormGroup>
                </div>
            )
        }
        else if(this.state.formtype==="recruiter"){
            return(
                <div>
                    <FormGroup row>
                        <Label htmlFor="telnum" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="tel" id="telnum" name="telnum" value={this.state.telnum} placeholder="Contact Number" onChange={this.handleInputChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="bio" md={2}>Your Bio</Label>
                        <Col md={10}>
                            <Input type="textarea" id="bio" name="bio" rows="6" value={this.state.bio} onChange={this.handleInputChange} ></Input>
                        </Col>
                    </FormGroup>
                </div>
            );
        }
    }

    handleSubmit(event) {
        // console.log('Current State is: ' + JSON.stringify(this.state));
        alert('Current State is: ' + JSON.stringify(this.state));

        if(this.state.formtype==='user')axios({
            method: "POST",
            url: "http://localhost:3000/users/signup",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Welcome! We have you successfully registered.");
            console.log(response)
            window.location.replace("http://localhost:3001/login");
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
                // this.setState({isError: true});
                // this.setState({errors: error.response.data});
            }
        });
        else if(this.state.formtype==='recruiter')axios({
            method: "POST",
            url: "http://localhost:3000/recruiters/signup",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Welcome! We have you successfully registered.");
            console.log(response)
            window.location.replace("http://localhost:3001/login");
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
                // this.setState({isError: true});
                // this.setState({errors: error.response.data});
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
        const errors=this.validate(this.state.firstName,this.state.lastName,this.state.telnum,this.state.email)

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
                                        valid={errors.firstName === ''}
                                        invalid={errors.firstName !== ''}
                                        onBlur={()=>{this.handleBlur('firstName')}}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.firstName}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="lastName" md={2}>Last Name</Label>
                                <Col md={10}>
                                    <Input type="text" id="lastName" name="lastName"
                                        placeholder="Last Name"
                                        value={this.state.lastName}
                                        valid={errors.lastName === ''}
                                        invalid={errors.lastName !== ''}
                                        onBlur={()=>{this.handleBlur('lastName')}}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.lastName}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        valid={errors.email === ''}
                                        invalid={errors.email !== ''}
                                        onBlur={()=>{this.handleBlur('email')}}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.email}</FormFeedback>
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
                                        onBlur={()=>{this.handleBlur('password')}}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.password}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                            <Label htmlFor="type" md={2}>Sign up as </Label>
                                <Col md={3}>
                                    <Input type="select" name="formtype" value={this.state.formtype} onChange={this.handleInputChange}>
                                        <option selected> Select Type</option>
                                        <option>user</option>
                                        <option>recruiter</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                            {this.handleUserChange()}
                            <FormGroup row>
                                <Col md={{size: 10, offset: 2}}>
                                    <Button type="submit" color="primary">
                                        Sign Up
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
export default Signup;