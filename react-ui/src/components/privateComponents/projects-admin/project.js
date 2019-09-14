import React, { Component } from "react";
import Axios from "axios";
import ProjectsUpload from "./projects-upload";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = { areImagesVisible: false, deleting: false, };
    this.toggleImages = this.toggleImages.bind(this);
    this.imgDelete = this.imgDelete.bind(this);
    this.render = this.render.bind(this);
    this.finishedFunction = this.finishedFunction.bind(this);
  }

  imgDelete(event) {
    if (window.confirm("Delete this image?")) {
      this.setState({deleting: true})
      Axios.delete("/admin/api/deleteimg", {
        data: { id: this.props.user[0]._id, image: event.target.src }
      }).then(res => {
        this.props.finishedFunction(this.props.user[0]._id);
        this.props.finishedFunction();
        this.setState({deleting: false})
      });
    }
  }

  toggleImages = () => {
    this.setState(prevState => ({
      areImagesVisible: !prevState.areImagesVisible
    }));
  };

  finishedFunction(user) {
    if (user) {
      this.props.finishedFunction(user);
    } else {
      this.props.finishedFunction();
    }
  }

  render() {
    console.log(this.props)
    return (
      <div className="user-container">
        <Typography color="secondary" component="span" variant="h5">
          <h5>{this.props.user[0].name}</h5>
        </Typography>
        <ProjectsUpload
          user={this.props.user[0]}
          finishedFunction={this.props.finishedFunction}
        />
        <Button 
        className='alert-delete'
        onClick={() => {this.props.deleteProject(this.props.user[0])}} >
          Delete Project
        </Button>
        <div>
          {this.state.uploading ? <CircularProgress color="secondary" /> : ""}
        </div>
        {this.props.user[0].images.map(image =>
          image.url.substr(image.length - 4).match(/(mp4)|(mov)|(m4v)/) ? (
            <video
            className='small-preview'
              controls
              width="200px"
              height="200px"
              src={image.url}
              key={image.url}
              onClick={this.imgDelete}
            />
          ) : (
            <img
            className='small-preview'
              key={image.url}
              src={image.url}
              onClick={this.imgDelete}
              alt=""
              height="200px"
              width="200px"
            />
          )
        )}
      </div>
      /*{ { <ul>
          <li>{this.props.data.name + " " + this.props.data.location}</li>
          <Button variant="contained" onClick={this.toggleImages}>Show options</Button>
          <div className={this.state.areImagesVisible ? "" : "hidden"}>
            {this.props.data.images.map(image =>
              image.substr(image.length - 4).match(/(mp4)|(mov)|(m4v)/) ? (
                <video
                  controls
                  width="200px"
                  height="200px"
                  src={image}
                  key={image}
                  onClick={this.imgDelete}
                />
              ) : (
                <img
                  key={image}
                  src={image}
                  onClick={this.imgDelete}
                  alt=""
                  height="200px"
                  width="200px"
                />
              )
            )}
            <Button variant="contained" onClick={this.deleteProject}>Delete this project</Button>
            
          </div>
        </ul> } }*/
    );
  }
}

export default Project;
