import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import HeaderRecruiter from './HeaderRecruiter';
import HeaderUser from './HeaderUser';


class SelectedApplications extends Component{
    constructor(props){
        super(props);
		this.state = {
            applist:[],
            rating:'',
            selectedId:'',
            sortBy:'',
            order:''
        };
        this.getData = this.getData.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.submitRating = this.submitRating.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.comp = this.comp.bind(this);
        this.setSort = this.setSort.bind(this);

    }

    getData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/applications/selected",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            this.setState({
                applist:response.data,
                isModalOpen:false
            })
        }).catch(error => {
            alert(JSON.stringify(error.response));
            if (error) {
                console.log(error.response);
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
        [name]: value
        });
    }
    comp(a,b){

        if(this.state.sortBy == "applicantRating"){
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
        else if(this.state.sortBy==="applicantName"){
            let str1 = a["applicantName"];
            let str2 = b["applicantName"];


            if(this.state.order==='asc')return str1.localeCompare(str2);
            else{
                return str2.localeCompare(str1);
            }
        }
        else if(this.state.sortBy==="dateOfJoining"){
            let flag;

            let str1 = a["dateOfJoining"];
            let str2 = b["dateOfJoining"];

            console.log(str1, str2);
            if(this.state.order==='asc')flag = 0;
            else if(this.state.order==='desc') flag = 1;
            return (1 - flag*2) * (new Date(str1) - new Date(str2));
        }
        else{
            let str1 = a["jobtitle"];
            let str2 = b["jobtitle"];

            console.log(str1, str2);
            if(this.state.order==='asc')return str1.localeCompare(str2);
            else{
                return str2.localeCompare(str1);
            }
        }
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

    toggleModal(event){
        if(this.state.isModalOpen === false)
        {
            var appid = event.target.id;
            this.setState({
                isModalOpen: true,
                selectedId: appid,
                rating:''
            });
        }
        else
        {
            this.setState({
                isModalOpen: false,
                selectedId:'',
                rating:''
            });
        }
    }

    submitRating(event){
        event.preventDefault();
        if(this.state.rating===''){
            alert("select a valid rating");
            return;
        }
        var appid = this.state.selectedId;
        console.log(appid);
        var endpoint = "http://localhost:3000/users/rate/"+appid;
        var data = {};
        data.rating = this.state.rating;
        console.log(data);
        axios({
            method: "POST",
            url: endpoint,
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert(JSON.stringify(response));
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

    componentDidMount(){
        this.getData();
    }

    render(){
        console.log(this.state.rating);
        let allApps = this.state.applist;

        let Apps = allApps.map((app)=>{
            app.jobtitle = app.job.title;
            app.applicantRating = app.applier.rating;
            app.applicantName = app.applier.firstName;
            return app;
        })

        if(this.state.sortBy!==''){
            Apps = Apps.sort(this.comp);
        }

        let apps = Apps.map((app)=>{
            let id = app._id

            return(
                <div className="container">
                    <Row>
                        <Col>
                            <Card body>
                                <CardText>Id: {app._id}</CardText>
                                <CardText>SOP: {app.sop}</CardText>
                                <CardText>Applicant Email:{app.applier.email}</CardText>
                                <CardText>Applicant Rating:{app.applier.rating}</CardText>
                                <CardText>Applicant Name:{app.applier.firstName}</CardText>
                                <CardText>Time of Creation:{app.createdAt}</CardText>
                                <CardText>Time of Joining:{app.dateOfJoining}</CardText>
                                <CardText>Title of Job:{app.job.title}</CardText>
                                <Button id={app._id} onClick={this.toggleModal}>Rate</Button>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        });

        return(<div className="container">
            <HeaderRecruiter/>
            <Form>
            <FormGroup row>
                    <Col md={6}> <Button row name="jobtitle" onClick={this.setSort}>Sort By Title</Button></Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col md={6}> <Button row name="dateOfJoining"  onClick={this.setSort}>Sort By DOJ</Button></Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col md={6}> <Button row name="applicantRating" onClick={this.setSort}>Sort By Rating</Button></Col>
            </FormGroup>
            <FormGroup row>
                    <Col md={6}> <Button row name="applicantName" onClick={this.setSort}>Sort By Applicant Name</Button></Col>
            </FormGroup>
            </Form>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Rate</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label htmlFor="rating"></Label>
                            <Input type="select" id="rating" name="rating" value={this.state.rating} onChange={this.handleInputChange}>
                            <option value=''>select</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Input>
                        </FormGroup>
                        <Button color="primary" onClick={this.submitRating}>Rate</Button>
                    </Form>
                </ModalBody>
            </Modal>
            {apps}
        </div>)
    }
}



export default SelectedApplications;