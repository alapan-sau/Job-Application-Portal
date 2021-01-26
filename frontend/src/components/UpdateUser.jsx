import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import { render } from '@testing-library/react';
import axios from 'axios';
import HeaderUser from './HeaderUser';


class UpdateUser extends Component{
    constructor(props){
        super(props);
        this.state={
            firstName:'',
            lastName:'',
            email: '',
            education:[],
            skill:[],
            touched:{
                firstName:false,
                lastName:false,
                email:false,
                education:[],
                skill:[],
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.renderEducation = this.renderEducation.bind(this);
        this.addEducation = this.addEducation.bind(this);
        this.removeEducation = this.removeEducation.bind(this);
        this.renderSkill = this.renderSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeSkill= this.removeSkill.bind(this);
        this.validateEducation= this.validateEducation.bind(this);
        this.validateSkill= this.validateSkill.bind(this);
        this.handleBlurSkill = this.handleBlurSkill.bind(this);
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
            // alert(JSON.stringify(response.data));
            let touched = this.state.touched;
            var n = response.data.education.length;
            let education=[];
            for(var i=0;i<n;i++){
                education.push({'institute':false, 'start':false, 'end':false});
            }
            console.log(education);
            touched.education = education;
            n = response.data.skill;
            for(var i =0;i<n;i++){
                touched.skill.push(false);
            }

            this.setState({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                education: response.data.education,
                skill:response.data.skill,
                touched: touched
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

    validateSubmit(firstName,lastName,email,skill,education){
        if((firstName.length === 0)){
            alert('First Name is required');
            return false;
        }
        if((lastName.length===0)){
            alert('Last Name is required');
            return false;
        }
        const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/;
        if(!reg.test(email)){
            alert('Invalid Email');
            return false;
        }
        var i, n = skill.length;
        for(i=0;i<n;i++){
            if((this.state['skill'][i] === '')){
                alert("Skill is compulsory. Please remove the skill if not required")
                return false;
            }
        }
        var i,n = education.length;
        for(i=0;i<n;i++){
            if(this.state.education[i].institute.length === 0){
                    alert('Institute Name is required, remove if not to be added');
                    return false;
            }
            if(this.state.formtype==='user' && (this.state.education[i].start === '' || Number(this.state.education.start)<=0)){
                alert('Start Year is required');
                return false;
            }
        }

        return true;

    }



    validate(firstName,lastName,email) {
        const errors={
            firstName:'',
            lastName:'',
            email: '',
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
        return errors;
    }


    validateEducation(education){
        let errors={};
        errors.education = [];
        var i,n = education.length;
        for(i=0;i<n;i++){
            errors.education.push({institute:'', start: '', end:''});
            if(this.state.touched.education[i].institute && this.state.education[i].institute.length === 0){
                    errors.education[i].institute = 'Institute Name is required, remove if not to be added';
            }
            if(this.state.touched.education[i].start && (this.state.education[i].start === '' || Number(this.state.education.start)<=0)){
                errors.education[i].start = 'Start Year is required';
            }
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

    addEducation(){
        let ed = this.state.education;
        ed.push({institute:'', start:'',end:''});
        let touched = this.state.touched;
        touched.education.push({institute:false,start:false,end:false});
        this.setState({education : ed, touched: touched});
    }

    removeEducation(idx){
        console.log(idx);
        let ed = this.state.education;
        ed.splice(idx,1);
        let touched = this.state.touched;
        touched.education.splice(idx,1);
        this.setState({education : ed, touched: touched});
    }

    renderEducation(){
        let ed = this.state.education;

        let errors = this.validateEducation(ed);

        let eds = ed.map((val,idx)=>{
            let edIdx = `education-${idx}`;
            return(
                <FormGroup row>
                <Label md={2}></Label>
                <Col md={6}>
                    <Input type="text" name={edIdx+'-institute'}
                        placeholder="Institute Name"
                        value={this.state.education[idx].institute}
                        onChange={this.handleInputChange}
                        valid={errors.education[idx].institute === ''}
                        invalid={errors.education[idx].institute !== ''}
                        onBlur={()=>{this.handleBlurEd('institute', idx)}}
                        />
                        <FormFeedback>{errors.education[idx].institute}</FormFeedback>
                    <Input type="number" name={edIdx+'-start'}
                        placeholder="Start Year"
                        value={this.state.education[idx].start}
                        onChange={this.handleInputChange}
                        valid={errors.education[idx].start === ''}
                        invalid={errors.education[idx].start !== ''}
                        onBlur={()=>{this.handleBlurEd('start',idx)}}
                        />
                        <FormFeedback>{errors.education[idx].start}</FormFeedback>

                    <Input type="number" name={edIdx+'-end'}
                        placeholder="End Year"
                        value={this.state.education[idx].end}
                        onChange={this.handleInputChange} />
                </Col>
                <Col md={1}>
                <Button
                onClick={()=>{this.removeEducation(idx)}}>
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

    handleBlur = (field)=> {
        this.setState({
            touched:{...this.state.touched,[field]:true}
        });
    }

    handleBlurEd = (field, idx)=>{
        let touched = this.state.touched;
        touched.education[idx][field] = true;
        this.setState({
            touched: touched
        });
    }
    handleBlurSkill = (idx)=>{
        let touched = this.state.touched;
        touched.skill[idx] = true;
        this.setState({
            touched: touched
        });
    }

    handleSubmit(event) {

        if(!this.validateSubmit(this.state.firstName, this.state.lastName, this.state.email, this.state.skill, this.state.education)){
            event.preventDefault();
            return;
        }

        // alert(JSON.stringify(this.state));
        // alert('Current State is: ' + JSON.stringify(this.state));
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
            alert("Oops Sorry Something went Wrong!!");
            if (error) {
                console.log(error.response);
            }
        });
        event.preventDefault();
    }

    render(){
        let eds= this.renderEducation();
        let sks= this.renderSkill();

        let errors = this.validate(this.state.firstName, this.state.lastName, this.state.email);

        return(
            <div className="container">
                <HeaderUser/>
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        <Form>
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