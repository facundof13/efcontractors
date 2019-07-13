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
import PrivateRoute from "./components/privateComponents/private-route";
import Estimates from './components/privateComponents/estimates'

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: true
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
    axios.get("/user").then(response => {
      if (response.data) {
        this.setState({
          loggedIn: true
        });
        // return true;
      } else {
        this.setState({ loggedIn: false });
        // return false;
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
            <PrivateRoute
              path="/admin"
              component={Admin}
              isAuthenticated={this.state.loggedIn}
            />
            <Route
              exact
              path="/admin/estimates"
              render={() => <Estimates/>}
            />
            <Route
              exact
              path="/admin/projects"
              render={() => <ProjectsPage/>}
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
