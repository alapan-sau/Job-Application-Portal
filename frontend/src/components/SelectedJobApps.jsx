import React , {Component}from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback, Card, Row , CardTitle, CardText, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { render } from '@testing-library/react';

import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import HeaderRecruiter from './HeaderRecruiter';

class SelectedJobApps extends Component{
    constructor(props){
        super(props);
		this.state = {
            applist:[],
            sortBy:'',
            order:'desc'
        };

        this.getData = this.getData.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.setSort = this.setSort.bind(this);
        this.comp = this.comp.bind(this);

    }

    comp(a,b){
        let by = this.state.sortBy;
        let order = this.state.order;
        if(this.state.sortBy==="rating"){
            let factor = 0;
            if(order==='asc')factor = 0;
            else if(order==='desc')factor = 1;

            if(a[by]!==undefined && b[by]!==undefined)
                return (1-2*factor)*(a[by] - b[by]);
            else
                return 1;
        }
        else if(this.state.sortBy==="name"){
            let str1 = a["name"];
            let str2 = b["name"];


            if(this.state.order==='asc')return str1.localeCompare(str2);
            else{
                return str2.localeCompare(str1);
            }
        }
        else if(this.state.sortBy==="createdAt"){
            let flag;

            let str1 = a["createdAt"];
            let str2 = b["createdAt"];


            if(this.state.order==='asc')flag = 0;
            else if(this.state.order==='desc') flag = 1;
            return (1 - flag*2) * (new Date(str1) - new Date(str2));
        }
    }

    setSort(event){
        const target = event.target;
        const name = target.name;
        this.setState({
            sortBy : name
        });


        if(this.state.order==='desc'){
            this.setState({
                order : 'asc'
            });
        }
        else{
            this.setState({
                order : 'desc'
            });
        }
        console.log(this.state.sortBy);
        console.log(this.state.order);
    }

    handleButton(event){
        alert('Please wait');
        let name = event.target.name;
        let id = event.target.id;
        axios({
            method: "PUT",
            data:{'status':name},
            url: "http://localhost:3000/applications/status/"+id,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            // alert(JSON.stringify(response));
            this.getData();
        }).catch(error => {
            if (error) {
                console.log(error.response);
            }
        });
    }

    getData(){
        axios({
            method: "GET",
            url: "http://localhost:3000/applications/appliedto/"+this.props.jobid,
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

    componentDidMount(){
        this.getData();
    }

    render(){

        console.log(this.state.applist);
        let allApps = this.state.applist;

        let Apps = allApps.map((app)=>{
            app.name = app.applier.firstName;
            app.time = app.createdAt;
            app.rating = app.applier.rating;
            return app;
        })

        if(this.state.sortBy!==''){
            console.log('1')
            Apps = Apps.sort(this.comp);
        }


        let apps = Apps.map((app)=>{
            let id = app._id
            let ButtonStatus;
            if(app.status==='pending')ButtonStatus= <Button id={app._id} name='shortlisted' onClick={this.handleButton}>Shortlist</Button>
            else if(app.status==='selected') ButtonStatus = <Button id={app._id} name='selected'>Selected</Button>
            else if(app.status==='shortlisted') ButtonStatus = <Button name='selected' id={app._id} onClick={this.handleButton}>Select</Button>
            else ButtonStatus = <div></div>;

            let ButtonReject;
            if(app.status !== 'rejected')ButtonReject = <Button id={app._id} name='rejected' onClick={this.handleButton}> Reject </Button>
            if(app.status === 'selected')ButtonReject = null;

            if(app.status === 'rejected') return null;

            return(
                <Row>
                <Col>
                  <Card body>
                    <CardText>Id: {app._id}</CardText>
                    <CardText>SOP: {app.sop}</CardText>
                    <CardText>Email: {app.applier.email}</CardText>
                    <CardText>Rating: {app.rating}</CardText>
                    <CardText>Name: {app.name}</CardText>
                    <CardText>Time of Creation: {app.createdAt}</CardText>
                    {ButtonStatus}
                    {ButtonReject}
                  </Card>
                </Col>
                </Row>
            )
        });

        return(<div className="container">
                <HeaderRecruiter />
                <Col md={6}> <Button row name="createdAt" onClick={this.setSort}>Sort By Creation Time</Button></Col>
                <Col md={6}> <Button row name="name" onClick={this.setSort}>Sort By Name</Button></Col>
                <Col md={6}> <Button row name="rating" onClick={this.setSort}>Sort By Rating</Button></Col>
            {apps}
        </div>)
    }
}

export default SelectedJobApps;