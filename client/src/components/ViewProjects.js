import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
export default class Viewprojects extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
  }

  componentDidMount() {
    this.getAllProjects();
  }

  getAllProjects() {
    axios.get("/projects").then(res => this.setState({ projects: res.data }));
  }

  render() {
    // console.log(this.state.projects);
    return (
      <div>
        <Typography color='secondary' component="span" variant="h4">
            <h4>Projects</h4>
          </Typography>
      </div>
    );
  }
}
