import React from "react";
import { Typography } from "@material-ui/core";

export default class ExpandedProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = { photoIndex: 0 };

    this.handleArrows = this.handleArrows.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrev = this.gotoPrev.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleArrows, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleArrows, false);
  }

  gotoNext() {
    this.setState(prevState => ({
      photoIndex: (prevState.photoIndex + 1) % this.props.project.images.length
    }));
  }

  gotoPrev() {
    this.setState(prevState => ({
      photoIndex:
        (prevState.photoIndex + this.props.project.images.length - 1) %
        this.props.project.images.length
    }));
  }

  handleArrows(e) {
    console.log(e.keyCode);
    // left is 37
    // right is 39

    if (e.keyCode === 39) {
      // Move index + 1
      this.gotoNext();
    } else if (e.keyCode === 37) {
      // Move index -1
      this.gotoPrev();
    } else if (e.keyCode === 27) {
      // close project
      this.props.closeProject();
    }
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <Typography color="secondary" component="span" variant="h5">
          <h5>{this.props.project.name + " " + this.props.project.location}</h5>
        </Typography>

        <div className="expanded-project">
          {this.props.project.images[this.state.photoIndex]
            .slice(-4)
            .match(/(.mp4)|(.mov)|(.m4v)/) ? (
            <video
              controls
              className="big-image"
              src={this.props.project.images[this.state.photoIndex]}
              key={this.props.project.images[this.state.photoIndex]}
            />
          ) : (
            <img
              key={this.props.project.images[this.state.photoIndex]}
              src={this.props.project.images[this.state.photoIndex]}
              alt=""
              className="big-image"
            />
          )}
          <Typography component="p" variant="caption" color="secondary">
            {this.state.photoIndex + 1}/{this.props.project.images.length}
          </Typography>
          {this.props.project.images.map(img => {
              {console.log(img)}
              return (
                  <div key={img}>
                      </div>
              )
          })}
        </div>
      </div>
    );
  }
}
