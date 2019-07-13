import React, { Component } from "react";
import axios from "axios";
import { Route, Switch } from "react-router-dom";

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

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
    
    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }
  
  componentDidMount() {
    this.getUser()
  }
  
  updateUser(userObject) {
    this.setState(userObject);
  }
  
  getUser() {
    axios.get("/user").then(response => {
      if (response.data) {
        this.setState({
          loggedIn: true
        });
      } else {
        this.setState({loggedIn: false})
      }
    });
  }
  
  render() {
    return (
      <div className="App">
        <div>
          <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
          {/* Routes to different components */}

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/projects" render={() => <ViewProjects />} />
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
            <Route
              exact
              path="/admin"
              render={() => <Admin loggedIn={this.state.loggedIn} />}
            />
            <Route
              exact
              path="/admin/projects"
              render={() => <ProjectsPage loggedIn={this.state.loggedIn} />}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
