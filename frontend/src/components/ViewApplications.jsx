import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import HeaderUser from './HeaderUser';

class ViewApplications extends Component{
    constructor(props){
        super(props);
		this.state = {
            applist:[],
            appid : '',
            rate:'',
            isModalOpen:false
        };

        this.getData = this.getData.bind(this);
        this.submitRating = this.submitRating.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    getData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/applications/myapplications/",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert(JSON.stringify(response));
            this.setState({
                applist:response.data
            })
        }).catch(error => {
            if (error) {
                console.log(error.response);
            }
        });
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

    submitRating(event){
        event.preventDefault();
        if(this.state.rate===''){
            alert("enter valid rating");
            return;
        }
        var appid = this.state.appid;
        console.log(appid);
        var endpoint = "http://localhost:3000/jobs/rate/"+appid;
        var data = {};
        data.rate = this.state.rate;
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

    toggleModal(event)
    {
        if(this.state.isModalOpen === false)
        {
            var appid = event.target.id;
            //console.log(temp);
            this.setState({
                isModalOpen: true,
                appid : appid,
                rate:'',
            });
        }
        else
        {
            this.setState({
                isModalOpen: false,
                appid:'',
                rate:''
            });
        }
    }

    componentDidMount(){
        this.getData();
    }

    render(){

        console.log(this.state.applist);

        let allApps = this.state.applist;

        let apps = allApps.map((app)=>{
            let id = app._id
            let title = app.job.title;
            let jid = app.job._id;

            let ButtonRate=<Button></Button>;
            if(app.status==='pending')ButtonRate = <Button>Pending</Button>
            else if(app.status==='selected' && app.rated===false) ButtonRate = <Button id={app._id} onClick={this.toggleModal}>You are Selected, Rate</Button>
            else if(app.status==='selected' && app.rated===true) ButtonRate = <Button >Selected, Already Rated</Button>
            else if(app.status==='shortlisted') ButtonRate = <Button >Shortlisted </Button>
            else if(app.status==='rejected') ButtonRate = <Button >Rejected </Button>


            return(
                <Row>
                <Col>
                  <Card body>
                    <CardTitle tag="h5">{title}</CardTitle>
                    <CardText>Id : {app._id}</CardText>
                    <CardText>Type of Job : {app.job.type}</CardText>
                    <CardText>Duration : {app.job.duration}</CardText>
                    <CardText>SOP : {app.sop}</CardText>
                    <CardText>Rated: {String(app.rated)}</CardText>
                    <CardText>Status : {app.status}</CardText>
                    <CardText>Rating: {app.job.rating}</CardText>
                    {ButtonRate}
                  </Card>
                </Col>
                </Row>
            )
        });

        return(<div className="container">
            <HeaderUser/>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label htmlFor="rate">Rating</Label>
                            <Input type="select" id="rate" name="rate"  value={this.state.rate} onChange={this.handleInputChange}>
                            <option value=''>select</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Input>
                        </FormGroup>
                        <Button color="primary" onClick={this.submitRating}>Submit Application</Button>
                    </Form>
                </ModalBody>
            </Modal>
            {apps}
        </div>)
    }
}

export default ViewApplications;