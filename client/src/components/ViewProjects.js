import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import { Card, CardHeader, CardMedia, CardActionArea } from "@material-ui/core";
import ExpandedProject from "./expanded-project";
export default class Viewprojects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selected: {},
      open: false
    };
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
    this.closeProject = this.closeProject.bind(this);
    
  }

  componentDidMount() {
    this.getAllProjects();
  }

  handleArrows(k) {
    console.log(k)
  }

  getAllProjects() {
    axios.get("/projects").then(res => this.setState({ projects: res.data }));
  }

  showProject(project) {
    this.setState({ selected: project, open: true });
  }

  closeProject() {
    this.setState({ selected: {}, open: false });
    
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Projects</h4>
        </Typography>
        {this.state.open ? (
          ""
        ) : (
          <div className="project-card">
            {this.state.projects.map(project => (
              project.images.length < 1 ? '' : (
              <div key={project._id}>
                <Card>
                  <CardActionArea
                    onClick={e => {
                      this.showProject(project);
                    }}
                  >
                    <CardMedia
                      component={
                        project.images[0].slice(-4) === ".mp4" ? "video" : "img"
                      }
                      image={project.images[0]}
                      height={140}
                    />
                    <CardHeader
                      subheader={project.name + " - " + project.location}
                    />
                  </CardActionArea>
                </Card>
              </div>
              )
            ))}
          </div>
        )}
        {this.state.open && this.state.selected.images.length > 0 && <ExpandedProject project={this.state.selected} closeProject={this.closeProject} />}
      </div>
    );
  }
}
