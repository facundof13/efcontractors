import React from "react";
import {
  Typography,
  IconButton,
  Divider,
  Button,
  ButtonBase
} from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useSwipeable, Swipeable } from "react-swipeable";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";

export default class ExpandedProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = { photoIndex: 0 };

    this.handleArrows = this.handleArrows.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrev = this.gotoPrev.bind(this);
    this.gotoThumb = this.gotoThumb.bind(this);
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

  gotoThumb(img) {
    let index = 0;
    for (let i = 0; i < this.props.project.images.length; i++) {
      if (this.props.project.images[i] === img) {
        index = i;
      }
    }
    this.setState({
      photoIndex: index
    });
  }

  // TODO: Fix videos, fix styling of scrollable container under

  extractFrame(video, canvas, offset) {
    return new Promise((resolve, reject) => {
      video.onseeked = event => {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          resolve({offset: offset, imgUrl: canvas.toDataURL() , blob: blob});
        }, "image/png");
      };
      video.currentTime = offset;
    });
  };


  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h5">
          <h5>{this.props.project.name + " " + this.props.project.location}</h5>
        </Typography>

        <Divider className=".top" />

        {/* TODO: sort videos to beginning of array */}
        <div>
          <Button
            variant="outlined"
            color="secondary"
            className="btn-login"
            onClick={this.props.closeProject}
          >
            Back to projects
          </Button>
        </div>
        <div className="expanded-project">
          <div className="arrow">
            <IconButton
              color="secondary"
              onClick={this.gotoPrev}
              disableRipple={true}
              className="arrow-left"
            >
              <ArrowBack />
            </IconButton>
          </div>
          {/* TODO: fix video icon not showing on ios */}
          <Swipeable onSwipedRight={this.gotoPrev} onSwipedLeft={this.gotoNext}>
            {this.props.project.images[this.state.photoIndex]
              .slice(-4)
              .match(/(.mp4)|(.mov)|(.m4v)/) ? (
              <video
                controls
                className="big-image"
                type="video/mp4"
                id="myVid"
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
          </Swipeable>
          <div className="arrow">
            <IconButton
              onClick={this.gotoNext}
              color="secondary"
              disableRipple={true}
              className="arrow-right"
            >
              <ArrowForward />
            </IconButton>
          </div>
        </div>
        <Typography component="p" variant="caption" color="secondary">
          {this.state.photoIndex + 1}/{this.props.project.images.length}
        </Typography>
        <div className="small-images-container">
          {this.props.project.images.map(img => {
            return (
              <div className="small-images" key={img}>
                <ButtonBase>
                  {img.slice(-4) === ".mp4" ? (
                    <video
                      src={img}
                      onClick={() => {
                        this.gotoThumb(img);
                      }}
                    />
                  ) : (
                    <img
                      src={img}
                      onClick={() => {
                        this.gotoThumb(img);
                      }}
                    />
                  )}
                </ButtonBase>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
