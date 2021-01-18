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
            education:[],
            skill:[],
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderEducation = this.renderEducation.bind(this);
        this.addEducation = this.addEducation.bind(this);
        this.removeEducation = this.removeEducation.bind(this);
        this.renderSkill = this.renderSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeSkill= this.removeSkill.bind(this);
        this.setUpData= this.setUpData.bind(this);
    }

    setUpData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/users/me",
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
                education: response.data.education,
                skill:response.data.skills,
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
        console.log("Look here");
        console.log(this.state.skill)
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
        console.log(sk);
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

    handleSubmit(event) {
        alert('Current State is: ' + JSON.stringify(this.state));
        axios({
            method: "PUT",
            url: "http://localhost:3000/users/me",
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
        let eds= this.renderEducation();
        let sks= this.renderSkill();
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
                                        // valid={errors.firstName === ''}
                                        // invalid={errors.firstName !== ''}
                                        // onBlur={()=>{this.handleBlur('firstName')}}
                                        onChange={this.handleInputChange} />
                                    {/* <FormFeedback>{errors.firstName}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="lastName" md={2}>Last Name</Label>
                                <Col md={10}>
                                    <Input type="text" id="lastName" name="lastName"
                                        placeholder="Last Name"
                                        value={this.state.lastName}
                                        // valid={errors.lastName === ''}
                                        // invalid={errors.lastName !== ''}
                                        // onBlur={()=>{this.handleBlur('lastName')}}
                                        onChange={this.handleInputChange} />
                                    {/* <FormFeedback>{errors.lastName}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        // valid={errors.email === ''}
                                        // invalid={errors.email !== ''}
                                        // onBlur={()=>{this.handleBlur('email')}}
                                        onChange={this.handleInputChange} />
                                    {/* <FormFeedback>{errors.email}</FormFeedback> */}
                                </Col>
                            </FormGroup>
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