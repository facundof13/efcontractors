import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import { Card, CardHeader, CardMedia, CardActionArea } from "@material-ui/core";


export default class Viewprojects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selected: {},
      photoIndex: 0,
      open: false,
      data: ""
    };
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
  }

  getAllProjects() {
    axios.get("/projects").then(res => this.setState({ projects: res.data }));
  }

  showProject(project) {
    this.setState({ selected: project, open: true }, this.createObject);
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Projects</h4>
        </Typography>
        {this.state.selected.name ? (
          ""
        ) : (
          <div className="project-card">
            {this.state.projects.map(project => (
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
            ))}
          </div>
        )}
    </div>
    );
  }
}
