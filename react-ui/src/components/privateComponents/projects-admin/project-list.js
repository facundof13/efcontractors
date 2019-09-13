import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { Paper, IconButton } from "@material-ui/core";
import Axios from "axios";

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { target: "", data: [] };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // this.getProjects();
  }

  handleSubmit(name, location) {
    Axios.post("/admin/api/newproject", {
      name: name,
      location: location
    }).then(res => {
      if (res.data.error) {
        window.alert(res.data.error);
      } else if (res.status === 200) {
        this.props.finishedFunction();
      }
    });
  }

  handleClick(id) {
    this.props.getUser(id);
  }



  render() {
    return (
        <div className="projects-container">
          <Paper>
            {this.props.projects ? (this.props.projects.map(project => (
              <div justify="space-between" key={project._id}>
                <ListItem
                  dense={true}
                  button
                  onClick={() => this.handleClick(project._id)}
                >
                  {project.name}
                  <IconButton onClick={() => this.props.deleteProject(project)}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))) : ("")}
          </Paper>
      </div>
    );
  }
}
