import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import Axios from "axios";

class ProjectsCreate extends Component {
  constructor() {
    super();
    this.state = {
      correctInputs: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    // console.log(this.state.name + this.state.location)
    Axios.post("/admin/newproject", {
      name: this.state.name,
      location: this.state.location
    }).then(res => {
      if (res.data.error) {
        window.alert(res.data.error);
      } else if (res.status === 200) {
        this.setState({name: "", location: ""})
        document.getElementById("project-form").reset()
        this.props.handleSubmit();
      }
    });
  }

  render() {
    return (
      <div className="create-container">
        <form autoComplete="off" id="project-form" onSubmit={this.handleSubmit}>
          <div className='login'>
          <TextField
            name="name"
            type="text"
            color="secondary"
            placeholder="Facundo Figueroa"
            onChange={this.handleChange}
          />
          <TextField
            name="location"
            type="text"
            color="secondary"
            placeholder="Lilburn, GA"
            onChange={this.handleChange}
          />
          <Button
            color="secondary"
            variant="text"
            // onClick={this.handleSubmit}
            type="submit"
          >
            Create new project
          </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default ProjectsCreate;
