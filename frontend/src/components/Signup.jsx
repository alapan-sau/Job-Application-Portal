import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback, Alert} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
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
            skillList:['C++','Python'],
            new_skill:'',
            telnum:'',
            bio:'',
            touched : {
                firstName:false,
                lastName:false,
                email: false,
                password: false,
                telnum: false,
                bio: false,
                formtype:false,
                education:[{institute:false, start:false,end:false}],
                skill:[false],
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
        this.validateRecruiter= this.validateRecruiter.bind(this);
        this.validateEducation= this.validateEducation.bind(this);
        this.validateSkill= this.validateSkill.bind(this);
        this.handleBlurSkill = this.handleBlurSkill.bind(this);
        this.extraSkill = this.extraSkill.bind(this);
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

    validateSubmit(firstName,lastName,email,password,formtype,bio,telnum,skill, education){
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
        if((password.length===0)){
            alert('Password is required');
            return false;
        }
        if((formtype==='')){
            alert('Select A User Type');
            return false;
        }

        const phonereg = /^\d{10}$/;
        if(this.state.formtype==='recruiter' && this.state.touched.telnum && !phonereg.test(telnum)){
            alert('Invalid Phone Number');
            return false;
        }
        let allWords = bio.split(' ');
        if(this.state.formtype==='recruiter' && (allWords.length > 250)){
            alert('Max Limit 250 words');
            return false;
        }

        var i, n = skill.length;
        for(i=0;i<n;i++){
            if(this.state.formtype==='user' && (this.state['skill'][i] === '')){
                alert("Skill is compulsory. Please remove the skill if not required")
                return false;
            }
        }

        var i,n = education.length;
        for(i=0;i<n;i++){
            if(this.state.formtype==='user' && this.state.education[i].institute.length === 0){
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

    validate(firstName,lastName,email,password,formtype) {
        const errors={
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            formtype:''
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
        if(this.state.touched.password && (password.length===0)){
            errors.password='Password is required';
        }
        if(this.state.touched.formtype && (formtype==='')){
            errors.formtype = 'Select A User Type';
        }

        return errors;
    }

    validateRecruiter(telnum,bio){
        const errors={
            bio:'',
            telnum:'',
        };

        if(this.state.formtype==='user') return errors;

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

    extraSkill()
    {
        var val = this.state.skillList;
        if(this.state.new_skill==='') return;
        val.push(this.state.new_skill);
        this.setState({
            skillList: val,
            new_skill: ''
        });
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
        let sklist = this.state.skillList.map((item, i) => {
            return(
                <option key={i} value={item}>{item}</option>
            )
        })

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
                        {sklist}
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
                       <Input type="text" name="new_skill" value={this.state.new_skill} onChange={this.handleInputChange} ></Input>
                       <Button onClick={this.extraSkill}>Add skill to dropdown</Button>
                   </FormGroup>
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
            const errors = this.validateRecruiter(this.state.telnum, this.state.bio)
            return(
                <div>
                    <FormGroup row>
                        <Label htmlFor="telnum" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="tel" id="telnum" name="telnum"
                            value={this.state.telnum}
                            placeholder="Contact Number"
                            onChange={this.handleInputChange}
                            valid={errors.telnum === ''}
                            invalid={errors.telnum !== ''}
                            onBlur={()=>{this.handleBlur('telnum')}}
                            />
                            <FormFeedback>{errors.telnum}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="bio" md={2}>Your Bio</Label>
                        <Col md={10}>
                            <Input type="textarea" id="bio" name="bio" rows="6"
                            value={this.state.bio}
                            onChange={this.handleInputChange}
                            valid={errors.bio === ''}
                            invalid={errors.bio !== ''}
                            onBlur={()=>{this.handleBlur('bio')}}/>
                        <FormFeedback>{errors.bio}</FormFeedback>
                        </Col>
                    </FormGroup>
                </div>
            );
        }
    }

    handleSubmit(event) {

        if(!this.validateSubmit(this.state.firstName,this.state.lastName,this.state.email,this.state.password,this.state.formtype,this.state.bio,this.state.telnum,this.state.skill,this.state.education)){
            event.preventDefault();
            return;
        }
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
            window.location.replace("http://localhost:3001/");
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
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
            window.location.replace("http://localhost:3001/");
        }).catch(error => {
            alert("Oops, Something went wrong!!");
            if (error) {
                console.log(error.response);
                alert(JSON.stringify(error.response));
            }
        });
        event.preventDefault();
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

    render(){
        if(this.props.isLoggedIn===true){
            if(this.props.type==='user')
                return (<Redirect to='/users/dashboard'/>);
            else{
                return (<Redirect to='/recruiters/dashboard'/>)
            }
        }
        const errors=this.validate(this.state.firstName,this.state.lastName,this.state.email,this.state.password,this.state.formtype);

        return(

            <div className="container">
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                    <p>Already have an account? <Link to='/'><Button>Log in</Button></Link> </p>
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
                            <FormGroup row>
                                <Label htmlFor="password" md={2}>Password</Label>
                                <Col md={10}>
                                    <Input type="password" id="password" name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        valid={errors.password === ''}
                                        invalid={errors.password !== ''}
                                        onBlur={()=>{this.handleBlur('password')}}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.password}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                            <Label htmlFor="type" md={2}>Sign up as </Label>
                                <Col md={3}>
                                    <Input type="select" name="formtype" value={this.state.formtype}
                                    onChange={this.handleInputChange}
                                    valid={errors.formtype === ''}
                                    invalid={errors.formtype !== ''}
                                    onBlur={()=>{this.handleBlur('formtype')}}
                                    >
                                        <option selected value=''> Select Type</option>
                                        <option>user</option>
                                        <option>recruiter</option>
                                    </Input>
                                    <FormFeedback>{errors.formtype}</FormFeedback>
                                </Col>
                            </FormGroup>
                            {this.handleUserChange()}
                            <FormGroup row>
                                <Col md={{size: 10, offset: 2}}>
                                    <Button type="submit" color="primary" onClick={this.handleSubmit}>
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