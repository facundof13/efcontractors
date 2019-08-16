import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
  Grid
} from "@material-ui/core";
import ExpandedProject from "./expanded-project";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
export default class Viewprojects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selected: {},
      elemArr: '',
      open: false
    };
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
    this.closeProject = this.closeProject.bind(this);
    this.showProject = this.showProject.bind(this)
  }

  componentDidMount() {
    this.getAllProjects();
  }

  getAllProjects() {
    axios.get("/projects").then(res => this.setState({ projects: res.data }));
  }

  showProject(project) {
    let arr = []
    this.setState({ selected: project, open: true }, () => {
      this.state.selected.images.map(img => {
        let item = (<div>
          {img.slice(-4) === '.mp4' ? (<iframe width="560" height="315" src={img} />) : (<img src={img} />)}
        </div>)
        arr = [...arr, item]
      });
      this.setState({elemArr: arr})
    });
  }

  closeProject() {
    this.setState({ selected: {}, open: false });
  }

  render() {
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
                        component={
                          project.images[0].slice(-4) === ".mp4"
                            ? "video"
                            : "img"
                        }
                        image={project.images[0]}
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
        {/* {this.state.open && (
          <div className="carousel">
            <Carousel
              dynamicHeight={true}
              width="90vw"
              useKeyboardArrows={true}
            >
              {this.state.elemArr}
            </Carousel>
          </div>
        )} */}
        {this.state.open && this.state.selected.images.length > 0 && <ExpandedProject project={this.state.selected} closeProject={this.closeProject} />}
      </div>
    );
  }
}
