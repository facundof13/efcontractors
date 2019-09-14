import React, { Component } from "react";
import Project from "./project";
import ProjectsCreate from "./projects-create";
import ProjectList from "./project-list";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import { Divider } from "@material-ui/core";

class ProjectsPage extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      location: "",
      currentUser: [],
      newName: "",
      newLocation: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUser = this.getUser.bind(this);
    this.finished = this.finished.bind(this);
    this.render = this.render.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  componentDidMount() {
    this.getProjects();
  }

  getUser(id) {
    if (id) {
      Axios.get("/admin/api/projectname", { params: { id: id } }).then(res => {
        this.setState({ currentUser: res.data });
      });
    } else {
      this.setState({ currentUser: [] });
    }
  }

  handleSubmit() {
    this.getProjects()
    .then(() => {
      this.setState({ currentUser: this.state.data[this.state.data.length - 1] }, () => {
        this.getUser(this.state.currentUser._id)
      });
    })
  }

  async getProjects() {
    let projects = await Axios.get("/admin/api/projects")
    this.setState({
      data: projects.data
    })
  }

  finished(id) {
    if (id) {
      this.getUser(id);
    } else {
      this.getProjects();
    }
  }

  deleteProject(project) {
    if (
      window.confirm(`Delete project ${project.name} from ${project.location}?`)
    ) {
      if (project.images.length > 0) {
        window.alert("You must delete all images from a project first!");
      } else {
        Axios.delete("/admin/api/deleteproject", {
          data: {
            id: project._id
          }
        });
        this.setState({ currentUser: [], data: [] }, () => {
          this.getProjects();
        });
      }
    }
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Manage projects</h4>
        </Typography>
        <div className="projects-top">
          <ProjectsCreate handleSubmit={this.handleSubmit} />
          <ProjectList
            projects={this.state.data}
            getUser={this.getUser}
            finishedFunction={this.getProjects}
            user={this.state.currentUser}
          />
        </div>
        <Divider />
        <div className="container">
          {this.state.currentUser.length > 0 ? (
            <Project
              deleteProject={this.deleteProject}
              user={this.state.currentUser}
              finishedFunction={this.finished}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default ProjectsPage;

// <ProjectsCreate handleSubmit={this.handleSubmit} />
// <ul>
//   {this.state.data.map(project => (
//     <div key={project._id}>
//       <Project data={project} finishedFunction={this.finished}  />
//     </div>
//   ))}{" "}
// </ul>
