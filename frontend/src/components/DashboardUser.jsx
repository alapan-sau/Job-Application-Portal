import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import HeaderUser from './HeaderUser';

import Fuse from 'fuse.js';

class DashboardUser extends Component{
    constructor(props){
        super(props);
		this.state = {
            joblist:[],
            tempJoblist:[],
            applist:[],
            sortBy:'',
            order:'desc',
            salaryLow:null,
            salaryHigh:null,
            durationMax:null,
            jobType:'All',
            sop:'',
            currentApplicationJobId:'',
            isModalOpen : false,
            search: ''
        };

        this.comp = this.comp.bind(this);
        this.filt = this.filt.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.setSort = this.setSort.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.clear = this.clear.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.submitAppli = this.submitAppli.bind(this);
        this.getData = this.getData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch()
    {
        var new_arr = this.state.tempJoblist;
        const fuse = new Fuse(new_arr, {
            keys: [
                'title'
            ]
        });
        new_arr = fuse.search(this.state.search);
        console.log(new_arr);
        var results = new_arr.map((val) => val.item);
        this.setState({
            tempJoblist: results
        })
    }

    toggleModal(event)
    {
        if(this.state.isModalOpen === false)
        {
            var jid = event.target.id;
            //console.log(temp);
            this.setState({
                isModalOpen: true,
                currentApplicationJobId: jid,
                sop:'',
            });
        }
        else
        {
            this.setState({
                isModalOpen: false,
                currentApplicationJobId:'',
                sop:''
            });
        }
    }

    submitAppli(event){
        event.preventDefault();
        var jid = this.state.currentApplicationJobId;
        console.log(jid);
        var endpoint = "http://localhost:3000/applications/apply/"+jid;
        var data = {};
        data.sop = this.state.sop;
        axios({
            method: "POST",
            url: endpoint,
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            console.log(response.data);
            this.setState({isModalOpen:false});
            this.getData();
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    comp(a,b){
        let by = this.state.sortBy;
        let order = this.state.order;

        let factor = 0;
        if(order==='asc')factor = 0;
        else if(order==='desc')factor = 1;

        if(a[by]!==undefined && b[by]!==undefined)
                    return (1-2*factor)*(a[by] - b[by]);
        else
            return 1;
    }

    filt(obj){
        let val = 1;
        if(this.state.salaryHigh!==null && this.state.salaryLow!==null){
            val = val && (obj.salary < this.state.salaryHigh && obj.salary >this.state.salaryLow)
        }
        if(this.state.jobType!=='All'){
                val = val && (obj.type===this.state.jobType);
        }
        if(this.state.durationMax!==null){
            val = val && (obj.duration < this.state.durationMax);
        }
        console.log(val);
        return val;
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

    setSort(event){
        const target = event.target;
        const name = target.name;
        this.setState({
            sortBy : name
        });
        if(this.state.order=='desc'){
            this.setState({
                order : 'asc'
            });
        }
        else{
            this.setState({
                order : 'desc'
            });
        }
    }

    setFilter(){
        // console.log('I camr here');
        let temp = this.state.tempJoblist;
        temp = temp.filter(this.filt);
        // console.log('I camr temp');
        console.log(temp);
        this.setState({tempJoblist:temp});

    }

    clear(){
        window.location.reload();
    }

    getData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/jobs",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            // console.log(response);
            this.setState({
                joblist:response.data,
                tempJoblist:response.data
            })
            // console.log(this.state.joblist);
        }).catch(error => {
            if (error) {
                console.log(error.response);
            }
            // alert(JSON.stringify(error.response));
        });

        axios({
            method: "GET",
            url: "http://localhost:3000/applications/myapplications/",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            // console.log(response);
            this.setState({
                applist:response.data
            })
            // console.log(this.state.applist);
        }).catch(error => {
            //alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }


    componentDidMount(){
        this.getData();
    }

    render(){
        console.log(this.state.tempJoblist);
        console.log(this.state.applist)

        let allApp = this.state.applist;
        let allAppliedJob = allApp.map((app)=>{
            return(app.job._id);
        })

        let allJob = this.state.tempJoblist;

        if(this.state.sortBy!='') allJob.sort(this.comp);

        let jobs = allJob.map((job)=>{
            let id = job._id;
            let title = job.title;
            let skills = job.skill;
            let deadline = job.deadline;
            let remAppli = job.remAppli;
            let remPos = job.remPos;
            let type = job.type;

            if(new Date(job.deadline) - new Date(Date.now()) < 0)
                return null;

            if(job.remPos===0) return null;

            let ButtonApply = <Button color='success' id={job._id} onClick={this.toggleModal}>Apply</Button>
            let ButtonApplied = <Button color='primary'>Applied</Button>
            let ButtonFull = <Button color='danger'>Full</Button>

            let usedButton;
            if(allAppliedJob.includes(id)){
                usedButton = ButtonApplied
            }
            else{
                if(remAppli<=0 || remPos<=0){
                    usedButton = ButtonFull
                }
                else{
                    usedButton = ButtonApply
                }
            }
            return(
                <Row>
                <Col>
                  <Card body>
                    <CardTitle tag="h5">{title}</CardTitle>
                    <CardText>Id : {job._id}</CardText>
                    <CardText>Skills : {skills}</CardText>
                    <CardText>Deadline : {deadline}</CardText>
                    <CardText>Remaining Applications : {remAppli}</CardText>
                    <CardText>Remaining Positions : {remPos}</CardText>
                    <CardText>Type of Job : {type}</CardText>
                    <CardText>Job Creator Mail : {job.creator.email}</CardText>
                    <CardText>Job Creator : {job.creator.firstName}</CardText>
                    <CardText>Salary : {job.salary}</CardText>
                    <CardText>Duration : {job.duration}</CardText>
                    <CardText>Rating : {job.rating}</CardText>
                    {usedButton}
                  </Card>
                </Col>
                </Row>
            )
        });

        return(
            <div className="container">
                <HeaderUser/>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Application Form</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="sop">SOP</Label>
                                <Input type="textarea" id="sop" name="sop"  onChange={this.handleInputChange}/>
                            </FormGroup>
                            <Button color="primary" onClick={this.submitAppli}>Submit Application</Button>
                        </Form>
                    </ModalBody>
                </Modal>
                <Form>
                    <FormGroup row>
                    <Label htmlFor="jobType" md={2}>Job Type</Label>
                    <Col md={3}>
                    <Input type="select" name="jobType" id="jobType" value={this.state.jobType} onChange={this.handleInputChange}>
                        <option>All</option>
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Work From Home</option>
                    </Input>
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Label htmlFor="salary" md={2}>Salary</Label>
                    <Col md={3}>
                    <Input type="number" name="salaryLow" value={this.state.salaryLow} onChange={this.handleInputChange}></Input>
                    <Input type="number" name="salaryHigh" value={this.state.salaryHigh} onChange={this.handleInputChange}></Input>
                    </Col>
                    <Label htmlFor="durationMax" md={2}>Duration</Label>
                    <Col md={3}>
                    <Input type="number" name="durationMax"value={this.state.duration} onChange={this.handleInputChange}></Input>
                    </Col>
                    </FormGroup>
                    <FormGroup row >
                    <Col md={6}>
                    <Button name="filterApply" onClick={this.setFilter}> Apply</Button>
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col md={6}>
                    <Button onClick={this.clear}>Clear</Button>
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Label htmlFor="search" md={2}>Search</Label>
                    <Col md={3}>
                    <Input type="text" name="search" value={this.state.search} placeholder='search' onChange={this.handleInputChange}></Input>
                    </Col>
                    <Button onClick={this.handleSearch}>Search</Button>
                    <Button onClick={this.clear}>Clear</Button>
                    </FormGroup>
                    <FormGroup row>
                    <Col> <Button row name="salary" onClick={this.setSort}>Sort By Salary</Button></Col>
                    <Col> <Button row name="duration"  onClick={this.setSort}>Sort By Duration</Button></Col>
                    <Col> <Button row name="rating" onClick={this.setSort}>Sort By Rating</Button></Col>
                    </FormGroup>
                </Form>
                {jobs}
            </div>
        );
    }
}

export default DashboardUser;


