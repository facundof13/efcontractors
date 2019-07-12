import React, { Component } from "react";
import axios from "axios";
import { Route } from "react-router-dom";

// components
import LoginForm from "./components/login-form";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Admin from "./components/admin";
import Logout from "./components/logout";
import ProjectsPage from "./components/projects-page";
import ViewProjects from "./components/ViewProjects";
import Footer from "./components/footer";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      username: null
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);

    
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    axios.get("/user").then(response => {
      if (response.data.user) {
        this.setState({
          loggedIn: true,
          username: response.data.user.username
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
          {/* Routes to different components */}
          <Route exact path="/" component={Home} />
          <Route
            path="/login"
            render={() => <LoginForm updateUser={this.updateUser} />}
          />
          <Route
            exact
            path="/admin"
            render={() => <Admin loggedIn={this.state.loggedIn} />}
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
          <Route path="/projects" render={() => <ViewProjects />} />
          <Route
            exact
            path="/admin/projects"
            render={() => <ProjectsPage loggedIn={this.state.loggedIn} />}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
