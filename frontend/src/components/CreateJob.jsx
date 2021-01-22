import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import HeaderRecruiter from './HeaderRecruiter'

class CreateJob extends Component{
    constructor(props){
        super(props);
		this.state = {
			title: '',
            type: '',
            deadline:'',
            skill:[''],
            type:'',
            salary:'',
            maxAppli:'',
            maxPos:'',
            remAppli:'',
            remPos:'',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.renderSkill = this.renderSkill.bind(this);
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // console.log(name , value);
        let tok = name.split('-');
        if(tok[0]==='skill'){
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
                onClick={()=>{this.removeSkill(idx)}}>
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
        // console.log('Current State is: ' + JSON.stringify(this.state));
        alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
        axios({
            method: "POST",
            url: "http://localhost:3000/jobs",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert(JSON.stringify(response));
            console.log( response);
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }
    render(){

        let skills = this.renderSkill();

        return (
            <div className="container">
                <HeaderRecruiter/>
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Label htmlFor="title" md={2}>Title of Job</Label>
                                <Col md={10}>
                                    <Input type="text" id="title" name="title"
                                        placeholder="Name of the Job Profile"
                                        value={this.state.title}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="type" md={2}>Type</Label>
                                <Col md={10}>
                                <Input type="select" id="type" name="type"
                                    placeholder="Type of your Job"
                                    value={this.state.type}
                                    onChange={this.handleInputChange} >
                                        <option value=''>Select Type</option>
                                        <option>Full Time</option>
                                        <option>Part Time</option>
                                        <option>Work From Home</option>
                                </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="salary" md={2}>Salary</Label>
                                <Col md={10}>
                                <Input type="Number" id="salary" name="salary"
                                    placeholder="Salary"
                                    value={this.state.salary}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={()=>{this.handleBlur('password')}}
                                    onChange={this.handleInputChange} />
                                {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="maxPos" md={2}>Maximum Positions</Label>
                                <Col md={10}>
                                <Input type="Number" id="maxPos" name="maxPos"
                                    placeholder="Maximum Number of Positions to be filled"
                                    value={this.state.maxPos}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={()=>{this.handleBlur('password')}}
                                    onChange={this.handleInputChange} />
                                {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="maxAppli" md={2}>Maximum Applications</Label>
                                <Col md={10}>
                                <Input type="Number" id="maxAppli" name="maxAppli"
                                    placeholder="Maximum Number of Applications"
                                    value={this.state.maxAppli}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={()=>{this.handleBlur('password')}}
                                    onChange={this.handleInputChange} />
                                {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="duration" md={2}>Duration</Label>
                                <Col md={10}>
                                <Input type="Number" id="duration" name="duration"
                                    placeholder="Duration in Months"
                                    value={this.state.duration}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={()=>{this.handleBlur('password')}}
                                    onChange={this.handleInputChange} />
                                {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="deadline" md={2}>Deadline</Label>
                                <Col md={10}>
                                <Input type="datetime-local" id="deadline" name="deadline"
                                    placeholder="Deadline to Fill"
                                    value={this.state.deadline}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={()=>{this.handleBlur('password')}}
                                    onChange={this.handleInputChange} />
                                {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            {skills}
                            <FormGroup row>
                                <Col md={{size: 3, offset: 3}}>
                                    <Button color="primary" type="submit">
                                        Create Job
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

export default CreateJob;