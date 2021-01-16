import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import axios from 'axios';

import Signup from './Signup'
import Login from './Login'

class Main extends Component{
    constructor(){
        super();
		this.state = {
			isLogin: false,
			userName: null,
			userId: null,
			userType: null,
			bearerToken: null
		};
		this.clogin = this.clogin.bind(this);
		this.clogout = this.clogout.bind(this);
    }

    clogin(token) {
		console.log("Logged In")
		// localStorage.setItem("weBuyToken", token);
		// setAuthToken(token);
		// const decoded = jwt_decode(token);
		this.setState({
			isLoggedIn: true,
			token: 'Bearer '+token
		});
		axios.defaults.headers.common["Authorization"] = this.state.token;
		console.log(this.state.token);
	}

	clogout() {
		console.log("Logged Out")
		// if (localStorage && localStorage.weBuyToken) {
		// 	localStorage.removeItem("weBuyToken");
		// }
		this.setState({
			isLoggedIn: false,
			userName: null,
			userId: null,
			userType: null,
			token: null
		});
		delete axios.defaults.headers.common["Authorization"];
        return <Redirect to='/' />
    }

    render(){
        return (
            <div>
              {/* <Header />
              <TransitionGroup>
                <CSSTransition key={this.props.location.key} classNames="page" timeout={300}> */}
                  <Switch>
				  	<Route exact path='/' component={Signup} />
					<Route exact path='/login' component={()=><Login clogin={this.clogin}/>} />
                    {/* <Route exact path='/users/dashboard' component={HomePage} />
                    <Route path='/apply/:jobid' component={()=><About leaders={this.props.leaders}/>} />
                    <Route exact path='users/myapplications' component={() => <Menu dishes={this.props.dishes} />} />
                    <Route exact path='users/update' component={() => <Menu dishes={this.props.dishes} />} />

                    <Route exact path='/recruiters/dashboard' component={SelectedDish} />
                    <Route exact path='/recruiters/myjobs' component= {() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} />
                    <Route exact path='/recruiters/update' component= {() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} />
					<Redirect to="/createjob/" /> */}
                  </Switch>
                {/* </CSSTransition>
              </TransitionGroup>
              <Footer /> */}
            </div>
        );
    }
}

export default Main;