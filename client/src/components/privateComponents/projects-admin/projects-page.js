import React, { Component } from "react";
import Project from "./project";
import ProjectsCreate from "./projects-create";
import ProjectList from "./project-list";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

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
    Axios.get("/admin/projectname", { params: { id: id } }).then(res => {
      this.setState({ currentUser: res.data });
    });
  }

  handleSubmit(name, location) {
    this.setState({ newName: name, newLocation: location });
  }

  getProjects() {
    Axios.get("/admin/projects").then(res => {
      this.setState({
        data: res.data
      });
    });
  }

  

  finished(id) {
    if (id) {
      this.getUser(id);
    } else {
      this.getProjects()
    }
  }

  deleteProject(project) {
    if (
      window.confirm(`Delete project ${project.name} from ${project.location}?`)
    ) {
      if (project.images.length > 0) {
        window.alert("You must delete all images from a project first!");
      } else {
        Axios.delete("/admin/deleteproject", {
          data: {
            id: project._id
          }
        }).then(res => {
          // this.props.finishedFunction(project._id)
          this.getProjects()
        });
      }
    } else {
    }
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Manage projects</h4>
        </Typography>
        <ProjectsCreate handleSubmit={this.getProjects} />
        <div className="container">
          <ProjectList projects={this.state.data} getUser={this.getUser} finishedFunction={this.getProjects} deleteProject={this.deleteProject}/>
          {this.state.currentUser.length > 0 ? (
            <Project
              user={this.state.currentUser}
              finishedFunction={this.finished}
              deleteUser={this.userIdChanged}
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
