import React, { Component } from "react";
import axios from 'axios'
import { Route, Switch } from "react-router-dom";
import Favicon from 'react-favicon';

// components
import LoginForm from "./components/login-form";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Admin from "./components/privateComponents/admin";
import Logout from "./components/logout";
import ProjectsPage from "./components/privateComponents/projects-admin/projects-page";
import ViewProjects from "./components/ViewProjects";
import Footer from "./components/footer";
import NotFound from "./components/not-found";
import PrivateRoute from "./components/privateComponents/private-route";
import Estimates from "./components/privateComponents/estimates-admin/estimates";
import Testimonials from "./components/testimonials";
import AboutUs from "./components/about-us";
import Services from "./components/services";
import ManageTestimonials from "./components/privateComponents/manage-testimonials";
import Settings from './components/privateComponents/settings/settings'


class App extends Component {
  constructor() {
    super();
    this.getUser();
    this.state = {
      // Disable these for testing
      loggedIn: false,
      finished: false

      //Enable these when testing
      // loggedIn: true,
      // finished: true,
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    // Disable here for testing
    axios.get("/user").then(response => {
      if (response.data) {
        this.setState({
          loggedIn: true,
          finished: true
        });
      } else {
        this.setState({ loggedIn: false, finished: true });
      }
    });
  }

  render() {
    return this.state.finished ? (
      <div className="App">
        <Favicon url="https://efcontractors.s3.us-east-2.amazonaws.com/favicon.ico" />
        <div>
          <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
          {/* Routes to different components */}

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/projects" render={() => <ViewProjects />} />
            <Route path="/testimonials" render={() => <Testimonials />} />
            <Route path="/about" render={() => <AboutUs />} />
            <Route path="/services" render={() => <Services />} />
            <Route
              path="/login"
              render={() => <LoginForm updateUser={this.updateUser} />}
            />
            <Route
              path="/logout"
              render={() => (
                <Logout
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                />
              )}
            />
            <PrivateRoute
              exact
              path="/admin/estimates"
              isAuthenticated={this.state.loggedIn}
              component={Estimates}
            />
            <PrivateRoute
              exact
              path="/admin/projects"
              isAuthenticated={this.state.loggedIn}
              component={ProjectsPage}
            />
            <PrivateRoute
              path="/admin/testimonials"
              component={ManageTestimonials}
              isAuthenticated={this.state.loggedIn}
            />
            <PrivateRoute
              path="/admin/settings"
              component={Settings}
              isAuthenticated={this.state.loggedIn}
            />
            <PrivateRoute
              path="/admin"
              component={Admin}
              isAuthenticated={this.state.loggedIn}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    ) : (
      ""
    );
  }
}

export default App;
