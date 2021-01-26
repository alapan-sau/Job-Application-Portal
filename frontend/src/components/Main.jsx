import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import Signup from './Signup';
import Login from './Login';
import CreateJob from './CreateJob';
import DashboardUser from './DashboardUser';
import ViewApplications from './ViewApplications';
import UpdateUser from './UpdateUser';
import UpdateRecruiter from './UpdateRecruiter';
import DashboardRecruiter from './DashboardRecruiter';
import SelectedJobApps from './SelectedJobApps';
import SelectedApplications from './SelectedApplicants';
import PrivateRouter from './PrivateRouter';
import Logout from './Logout'

class Main extends Component{
    constructor(){
        super();
		this.state = {
			isLoggedIn: false,
			userType: null,
			bearerToken: null
		};
		this.clogin = this.clogin.bind(this);
		this.clogout = this.clogout.bind(this);
    }

    clogin(token,type) {
		console.log("Logged In")
		this.setState({
			isLoggedIn: true,
			bearerToken: token,
			userType: type
		});
		localStorage.setItem("japStateToken", token);
		localStorage.setItem("japStateType", type);

		// async so might not not show the expected results
		console.log(this.state);
		console.log(localStorage.japStateToken);
	}

	clogout() {
		console.log("Logged Out")
		if (localStorage && localStorage.japStateToken){
			localStorage.removeItem("japStateToken");
			localStorage.removeItem("japStateType")
		}
		this.setState({
			isLoggedIn: false,
			userType: null,
			bearerToken: null
		});
		delete axios.defaults.headers.common["Authorization"];
	}

	componentWillMount(){
		if(localStorage && localStorage.japStateToken && localStorage.japStateType){
			this.clogin(localStorage.japStateToken,localStorage.japStateType);
			axios.defaults.headers.common["Authorization"] = localStorage.japStateToken;
		}
		else{
			delete axios.defaults.headers.common["Authorization"];
		}
	}

    render(){
		console.log('This is state');
		console.log(this.state);

		const SelectedJob = ({match}) => {
			console.log(match);
			if(this.state.isLoggedIn===false || this.state.userType==='user'){
				return <Redirect to='/'/>
			}
			return(
			    <SelectedJobApps jobid={match.params.jobid}/>
			);
		}
        return (
            <div>
                  <Switch>
					<Route exact path='/signup' component={()=><Signup isLoggedIn={this.state.isLoggedIn} type={this.state.userType}/> }/>
					<Route exact path='/' component={()=><Login clogin={this.clogin} isLoggedIn={this.state.isLoggedIn} type={this.state.userType}/>} />

					<Route exact path="/createjob"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='recruiter'
						path='/createjob'
						hasProps={true}
						component={<CreateJob/>}
					/>}/>

					<Route exact path="/users/dashboard"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='user'
						path='/users/dashboard'
						hasProps={true}
						component={<DashboardUser/>}
					/>}/>

					<Route exact path="/users/myapplications"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='user'
						path='/users/myapplications'
						hasProps={true}
						component={<ViewApplications/>}
					/>}/>

					<Route exact path="/users/update"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='user'
						path='/users/update'
						hasProps={true}
						component={<UpdateUser/>}
					/>}/>

					<Route exact path="/recruiters/update"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='recruiter'
						path='/recruiters/update'
						hasProps={true}
						component={<UpdateRecruiter/>}
					/>}/>

					<Route exact path="/recruiters/dashboard"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='recruiter'
						path='/recruiters/dashboard'
						hasProps={true}
						component={<DashboardRecruiter/>}
					/>}/>

					<Route exact path="/recruiters/:jobid"
						component={SelectedJob} />

					<Route exact path="/applications/selected"
					render = {
						(props) => <PrivateRouter {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType='recruiter'
						path='/applications/selected'
						hasProps={true}
						component={<SelectedApplications/>}
					/>}/>

					<Route exact path="/logout" component={()=><Logout clogout={this.clogout} type={this.state.userType} isLoggedIn={this.state.isLoggedIn}/>} />

                  </Switch>
            </div>
        );
    }
}

export default Main;


            //   /* <Route exact path='/users/dashboard' component={DashboardUser} />
			// 		<Route exact path='/users/myapplications' component={ViewApplications} />
			// 		<Route exact path='/users/update' component={UpdateUser} />
			// 		<Route exact path='/recruiters/update' component={UpdateRecruiter} />
			// 		<Route exact path='/recruiters/dashboard' component={DashboardRecruiter} />
			// 		<Route exact path='/recruiters/:jobid' component={SelectedJob} />
			// 		<Route exact path='/applications/selected' component={SelectedApplications} /> */