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
            duration:'',
            touched:{
                title: false,
                type: false,
                deadline:false,
                skill:[false],
                type:false,
                salary:false,
                maxAppli:false,
                maxPos:false,
                duration:false,
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.renderSkill = this.renderSkill.bind(this);
        this.validate = this. validate.bind(this);
        this.validateSkill = this.validateSkill.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.renderSkill = this.renderSkill.bind(this);
        this.handleBlurSkill = this.handleBlurSkill.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

    }

    validateSubmit(){
        if( this.state.title.length===0){
            alert("Title is Required");
            return false;
        }
        if(this.state.type===''){
            alert("Select a Type");
            return false;
        }
        if(((this.state.maxAppli.length===0) || (Number(this.state.maxAppli)<=0))){
            alert("Required Positive Integer");
            return false;
        }
        if(((this.state.maxPos.length===0) || (Number(this.state.maxPos)<=0))){
            alert("Required Positive Integer");
            return false;
        }
        if((this.state.duration==='' || Number(this.state.duration)<=0 || Number(this.state.duration)>7)){
            alert("Duration must lie between 1 and 7 months");
            return false;
        }
        if(this.state.salary===''){
            alert("Enter Salary details");
            return false;
        }

        if((this.state.deadline=== '' || (new Date(this.state.deadline)  < new Date()) ) ){
            console.log(Date());
            alert("A Deadline needs to be set in future");
            return false;
        }
        var i, n = this.state.skill.length;
        for(i=0;i<n;i++){
            if((this.state['skill'][i] === '')){
                alert("Skill is compulsory. Please remove the skill if not required")
                return false;
            }
        }
        return true;
    }

    validate(){
        let errors= {
            title:'',
            type:'',
            maxAppli:'',
            maxPos: '',
            deadline: '',
            duration:'',
            salary:''
        }
        if(this.state.touched.title && this.state.title.length===0){
            errors.title = "Title is Required";
        }
        if(this.state.touched.type && this.state.type===''){
            errors.type = "Select a Type"
        }
        if(this.state.touched.maxAppli && ((this.state.maxAppli.length===0) || (Number(this.state.maxAppli)<=0))){
            errors.maxAppli = "Required Positive Integer";
        }
        if(this.state.touched.maxPos && ((this.state.maxPos.length===0) || (Number(this.state.maxPos)<=0))){
            errors.maxPos = "Required Positive Integer";
        }
        if(this.state.touched.deadline && (this.state.deadline=== '' || (new Date(this.state.deadline)  < new Date()) ) ){
            console.log(Date());
            errors.deadline = "A Deadline needs to be set in future";
        }
        if(this.state.touched.duration && (this.state.duration==='' ||Number(this.state.duration)<=0 || Number(this.state.duration) > 7 )){
            errors.duration = "Duration must lie between 1 and 7 months";
        }
        if(this.state.touched.salary && (this.state.salary==='' || Number(this.state.salary)<=0 )){
            errors.salary = "Enter Salary details properly";
        }
        return errors;
    }

    validateSkill(skill){
        let errors ={}
        errors.skill=[];
        var i, n = skill.length;
        for(i=0;i<n;i++){
            errors.skill.push('');
            if(this.state.touched['skill'][i] && (this.state['skill'][i] === '')){
                errors['skill'][i] = "Skill is compulsory. Please remove the skill if not required"
            }
        }
        return errors;
    }


    handleBlurSkill = (idx)=>{
        let touched = this.state.touched;
        touched.skill[idx] = true;
        this.setState({
            touched: touched
        });
    }


    handleBlur = (field)=> {
        this.setState({
            touched:{...this.state.touched,[field]:true}
        });
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
        let touched = this.state.touched;
        touched.skill.push(false);
        this.setState({skill : sk, touched: touched});
    }

    removeSkill(idx){
        let sk = this.state.skill;
        sk.splice(idx,1);
        let touched = this.state.touched;
        touched.skill.splice(idx,1);
        this.setState({skill : sk, touched: touched});
    }

    renderSkill(){
        let sk = this.state.skill;
        let errors = this.validateSkill(sk);
        let sks = sk.map((val,idx)=>{
            let skIdx = `skill-${idx}`;
            return(
                <FormGroup row>
                <Label htmlFor="type" md={2}></Label>
                <Col md={3}>
                    <Input type="select" name={skIdx}
                    value={this.state.skill[idx]}
                    onChange={this.handleInputChange}
                    valid={errors.skill[idx] === ''}
                    invalid={errors.skill[idx] !== ''}
                    onBlur={()=>{this.handleBlurSkill(idx)}}
                    >
                        <option value=''> Select Type</option>
                        <option>C++</option>
                        <option>Python</option>
                    </Input>
                    <FormFeedback>{errors.skill[idx]}</FormFeedback>
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
        if(!this.validateSubmit()){
            event.preventDefault();
            return;
        }
        // alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
        axios({
            method: "POST",
            url: "http://localhost:3000/jobs",
            data: this.state,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Job Created");
            console.log( response);
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }
    render(){

        let errors = this.validate();
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
                                        onChange={this.handleInputChange}
                                        valid={errors.title === ''}
                                        invalid={errors.title !== ''}
                                        onBlur={()=>{this.handleBlur('title')}}
                                        />
                                        <FormFeedback> {errors.title} </FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="type" md={2}>Type</Label>
                                <Col md={10}>
                                <Input type="select" id="type" name="type"
                                    placeholder="Type of your Job"
                                    value={this.state.type}
                                    onChange={this.handleInputChange}
                                    valid={errors.type === ''}
                                    invalid={errors.type !== ''}
                                    onBlur={()=>{this.handleBlur('type')}}
                                    >
                                        <option value=''>Select Type</option>
                                        <option>Full Time</option>
                                        <option>Part Time</option>
                                        <option>Work From Home</option>
                                </Input>

                                <FormFeedback>{errors.type}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="salary" md={2}>Salary</Label>
                                <Col md={10}>
                                <Input type="Number" id="salary" name="salary"
                                    placeholder="Salary"
                                    value={this.state.salary}
                                    valid={errors.salary === ''}
                                    invalid={errors.salary !== ''}
                                    onBlur={()=>{this.handleBlur('salary')}}
                                    onChange={this.handleInputChange} />
                                <FormFeedback>{errors.salary}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="maxPos" md={2}>Maximum Positions</Label>
                                <Col md={10}>
                                <Input type="Number" id="maxPos" name="maxPos"
                                    placeholder="Maximum Number of Positions to be filled"
                                    value={this.state.maxPos}
                                    valid={errors.maxPos === ''}
                                    invalid={errors.maxPos !== ''}
                                    onBlur={()=>{this.handleBlur('maxPos')}}
                                    onChange={this.handleInputChange} />
                                <FormFeedback>{errors.maxPos}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="maxAppli" md={2}>Maximum Applications</Label>
                                <Col md={10}>
                                <Input type="Number" id="maxAppli" name="maxAppli"
                                    placeholder="Maximum Number of Applications"
                                    value={this.state.maxAppli}
                                    valid={errors.maxAppli === ''}
                                    invalid={errors.maxAppli !== ''}
                                    onBlur={()=>{this.handleBlur('maxAppli')}}
                                    onChange={this.handleInputChange} />
                                <FormFeedback>{errors.maxAppli}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="duration" md={2}>Duration</Label>
                                <Col md={10}>
                                <Input type="select" id="duration" name="duration"
                                    placeholder="Duration in Months"
                                    value={this.state.duration}
                                    valid={errors.duration === ''}
                                    invalid={errors.duration !== ''}
                                    onBlur={()=>{this.handleBlur('duration')}}
                                    onChange={this.handleInputChange} >
                                    <option value=''>Select</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    </Input>
                                <FormFeedback>{errors.duration}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="deadline" md={2}>Deadline</Label>
                                <Col md={10}>
                                <Input type="datetime-local" id="deadline" name="deadline"
                                    placeholder="Deadline to Fill"
                                    value={this.state.deadline}
                                    valid={errors.deadline === ''}
                                    invalid={errors.deadline !== ''}
                                    onBlur={()=>{this.handleBlur('deadline')}}
                                    onChange={this.handleInputChange} />
                                <FormFeedback>{errors.deadline}</FormFeedback>
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