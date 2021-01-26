import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import HeaderRecruiter from './HeaderRecruiter'

class DashboardRecruiter extends Component{
    constructor(props){
        super(props);
		this.state = {
            joblist:[],
            isModalOpen:false,
            maxAppli:'',
            maxPos:'',
            deadline:'',
            selectedId:''
        };
        this.getData = this.getData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getJobData = this.getJobData.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }


    validateSubmit(){
        if(((this.state.maxAppli.length===0) || (Number(this.state.maxAppli)<=0))){
            alert("Required Positive Integer for Maximum Applications");
            return false;
        }
        if(((this.state.maxPos.length===0) || (Number(this.state.maxPos)<=0))){
            alert("Required Positive Integer for maximum positions");
            return false;
        }
        if((this.state.deadline=== '' || (new Date(this.state.deadline)  < new Date()) ) ){
            alert("A Deadline needs to be set in future");
            return false;
        }
        return true;
    }

    getData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/jobs/myjobs",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // console.log(response.data);
            this.setState({
                joblist:response.data,
            })
        }).catch(error => {
            // alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    getJobData(jid){
        axios({
            method: "GET",
            url: "http://localhost:3000/jobs/"+jid,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert('getting edit data');
            console.log(response.data);
            this.setState({
                isModalOpen: true,
                maxAppli: response.data.maxAppli,
                maxPos: response.data.maxPos,
                deadline: response.data.deadline,
                selectedId:jid
            });
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    handleDelete(event){
        let jid = event.target.id;
        axios({
            method: "DELETE",
            url: "http://localhost:3000/jobs/"+jid,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response.data);
            this.getData();
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    toggleModal(event)
    {
        if(this.state.isModalOpen === false)
        {
            var jid = event.target.id;
            this.getJobData(jid)
        }
        else
        {
            this.getData();
            this.setState({
                isModalOpen: false,
                maxAppli: '',
                maxPos:'',
                deadline:'',
                selectedId:'',
            });
        }
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

    submitEdit(event){
        if(!this.validateSubmit()){
            event.preventDefault();
            return;
        }
        let obj={};
        obj.maxAppli = this.state.maxAppli;
        obj.maxPos = this.state.maxPos;
        obj.deadline = this.state.deadline;
        axios({
            method: "PUT",
            url: "http://localhost:3000/jobs/"+this.state.selectedId,
            data:obj,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response.data);
            this.getData();
            this.setState({isModalOpen:false});
        }).catch(error => {
            // alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }


    componentDidMount(){
        this.getData();
    }

    render(){

        let allJob = this.state.joblist;
        let jobs = allJob.map((job)=>{

            if(job.remPos==0) return null;
            return(
                <Row>
                <Col>
                  <Card body>
                    <CardTitle tag="h5">{job.title}</CardTitle>
                    <CardText>Id : {job._id}</CardText>
                    <CardText>Skills : {job.skill}</CardText>
                    <CardText>Deadline : {job.deadline}</CardText>
                    <CardText>Remaining Applications : {job.remAppli}</CardText>
                    <CardText>Remaining Positions : {job.remPos}</CardText>
                    <CardText>Type of Job : {job.type}</CardText>
                    <CardText>Salary : {job.salary}</CardText>
                    <CardText>Duration : {job.duration}</CardText>
                    <CardText>Rating : {job.rating}</CardText>
                    <Button id={job._id} onClick = {this.toggleModal}>Edit Job</Button>
                    <Button id={job._id} onClick = {this.handleDelete}>Delete Job</Button>
                    <Link to={`/recruiters/${job._id}`}>
                    <Button id={job._id}>
                        View Applications
                    </Button>
                    </Link>
                    </Card>
                </Col>
                </Row>
            )
        });

        return(
            <div className="container">
                <HeaderRecruiter/>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="maxAppli">Maximum Applications</Label>
                                <Input type="Number" id="maxAppli" name="maxAppli" value={this.state.maxAppli} onChange={this.handleInputChange}/>
                                <Label htmlFor="maxPos">Maximum Positions</Label>
                                <Input type="Number" id="maxPos" name="maxPos" value={this.state.maxPos} onChange={this.handleInputChange}/>
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input type="datetime-local" id="deadline" name="deadline" value={this.state.deadline} onChange={this.handleInputChange}/>
                            </FormGroup>
                            <Button color="primary" onClick={this.submitEdit}>Submit Application</Button>
                        </Form>
                    </ModalBody>
                </Modal>
                {jobs}
            </div>
        );
    }
}

export default DashboardRecruiter;


