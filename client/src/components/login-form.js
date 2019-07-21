import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirectTo: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            username: response.data.username
          });
          // update the state to redirect to home
          this.setState({
            redirectTo: "/admin"
          });
        }
      })
      .catch(error => {});
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <div>
          <Typography component="span" variant="h4" color="secondary">
            <h4>Login</h4>
          </Typography>
          <form>
            <div>
              <Typography color="secondary">
                <label className="" htmlFor="username">
                  Username
                </label>
              </Typography>
              <div className="login">
                <TextField
                  type="text"
                  id="username"
                  name="username"
                  color="secondary"
                  placeholder="Username"
                  variant="outlined"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
                <Typography color="secondary">
                  <label htmlFor="password">Password: </label>
                </Typography>

                <TextField
                  name="password"
                  type="password"
                  placeholder="password"
                  color="secondary"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="btn-login">
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleSubmit}
                type="submit"
                className="btn-login"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default LoginForm;
