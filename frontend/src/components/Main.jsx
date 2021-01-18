import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import Signup from './Signup';
import Login from './Login';
import CreateJob from './CreateJob';
import DashboardUser from './DashboardUser';


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
		// localStorage.setItem("weBuyToken", token);
		// setAuthToken(token);
		// const decoded = jwt_decode(token);
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
		if (localStorage && localStorage.japState) {
			localStorage.removeItem("japState");
		}
		this.setState({
			isLoggedIn: false,
			userName: null,
			userId: null,
			userType: null,
			bearerToken: null
		});
		delete axios.defaults.headers.common["Authorization"];
        return <Redirect to='/' />
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
        return (
            <div>
              {/* <Header />
              <TransitionGroup>
                <CSSTransition key={this.props.location.key} classNames="page" timeout={300}> */}
                  <Switch>
				  	<Route exact path='/' component={Signup} />
					<Route exact path='/login' component={()=><Login clogin={this.clogin}/>} />
					<Route exact path="/createjob" component={CreateJob}/>
                    <Route exact path='/users/dashboard' component={DashboardUser} />
                    {/* <Route path='/apply/:jobid' component={()=><About leaders={this.props.leaders}/>} />
                    <Route exact path='users/myapplications' component={() => <Menu dishes={this.props.dishes} />} />
                    <Route exact path='users/update' component={() => <Menu dishes={this.props.dishes} />} />

                    <Route exact path='/recruiters/dashboard' component={SelectedDish} />
                    <Route exact path='/recruiters/myjobs' component= {() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} />
                    <Route exact path='/recruiters/update' component= {() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} />
				 */}
                  </Switch>
                {/* </CSSTransition>
              </TransitionGroup>
              <Footer /> */}
            </div>
        );
    }
}

export default Main;