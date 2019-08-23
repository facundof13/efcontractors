import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import ExpandedProject from "./expanded-project";
const videoTypes = ['.mp4', '.mov']


export default class Viewprojects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selected: {},
      elemArr: "",
      open: false
    };
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
    this.closeProject = this.closeProject.bind(this);
    this.showProject = this.showProject.bind(this);
  }

  componentDidMount() {
    this.getAllProjects().then(() => {
      var newProjects = [...this.state.projects]
      this.state.projects.forEach((project, i) => {
        if(videoTypes.includes(project.images[0])) {
          var firstThumbIndex = project.images.findIndex((elem) => {
            return elem.includes('thumb')
          }) 
          var firstThumb = project.images.find((elem) => {
            return elem.includes('thumb')
          }) 
          newProjects[i].images.splice(firstThumbIndex, 1)
          newProjects[i].images.unshift(firstThumb)

        }
      })
      this.setState({projects: [...newProjects]})
    });
  }

  getAllProjects() {
    return new Promise((r, rj) => {
      axios.get("/projects").then(res =>
        this.setState({ projects: res.data }, () => {
          r();
        })
      );
    });
  }

  showProject(project) {
    let arr = [];
    this.setState({ selected: project, open: true }, () => {
      this.state.selected.images.map(img => {
        let item = (
          <div key="img">
            {videoTypes.includes(img.url.slice(-4)) ? (
              <video controls src={img.url} />
            ) : (
              <img src={img.url} />
            )}
          </div>
        );
        arr = [...arr, item];
      });
      this.setState({ elemArr: arr });
    });
  }

  closeProject() {
    this.setState({ selected: {}, open: false });
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Projects</h4>
        </Typography>
        {this.state.open ? (
          ""
        ) : (
          <div className="project-card">
            {this.state.projects.map(project =>
              project.images.length < 1 ? (
                ""
              ) : (
                <div key={project._id}>
                  <Card>
                    <CardActionArea
                      onClick={e => {
                        this.showProject(project);
                      }}
                    >
                      <CardMedia
                        component='img'
                        // {
                        //   videoTypes.includes(project.images[0].slice(-4))
                        //     ? "video"
                        //     : "img"
                        // }
                        image={project.images[0].thumbUrl || project.images[0].url}
                        height={200}
                      />
                      <CardHeader
                        subheader={project.name + " - " + project.location}
                      />
                    </CardActionArea>
                  </Card>
                </div>
              )
            )}
          </div>
        )}
        {this.state.open && this.state.selected.images.length > 0 && (
          <ExpandedProject
            project={this.state.selected}
            closeProject={this.closeProject}
          />
        )}
      </div>
    );
  }
}
