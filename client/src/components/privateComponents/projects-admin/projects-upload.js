import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { pathToFileURL } from "url";

class ProjectsUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: null,
      label: "",
      uploading: false,
      done: false
    };
  }
  multipleFileChangedHandler = event => {
    this.setState({
      selectedFiles: event.target.files,
      label: `Select Files (${event.target.files.length})`
    });
  };

  takeScreenshot(vid) {
    return new Promise((resolve, reject) => {
      var url = URL.createObjectURL(vid);
      var video = document.createElement("video");
      video.src = url;
      // video.muted = true;
      video.play();
  
      var canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      
      //convert to desired file format
      setTimeout(() => {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL("image/jpeg"); // can also use 'image/png'
        URL.revokeObjectURL(url)
        video.pause()
        resolve(dataURI)
      }, 1000);
    })
  }


  multipleFileUploadHandler = () => {
    const data = new FormData();
    let selectedFiles = this.state.selectedFiles;
    // If file selected
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append(
          "galleryImage",
          selectedFiles[i],
          selectedFiles[i].name.replace(/\s/g, "")
        );
      }
      if (this.state.selectedFiles.length > 30) {
        window.alert("Only 30 images allowed at once");
      } else {
        this.setState({
          uploading: true
        });
        setTimeout(() => {
          axios
            .post("/upload/multiple-file-upload", data, {
              params: {
                // folder name/Project Client's id: asdkfj13d32kdjasd
                projectName: this.props.user._id
              },
              headers: {
                accept: "application/json",
                "Accept-Language": "en-US,en;q=0.8",
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`
              }
            })
            .then(response => {
              if (200 === response.status) {
                // If file size is larger than expected.
                if (response.data.error) {
                  this.setState({
                    label: "Select Files",
                    selectedFiles: null,
                    uploading: false
                  });
                  if ("LIMIT_FILE_SIZE" === response.data.error.code) {
                    window.alert("File is larger than max size");
                  } else if (
                    "LIMIT_UNEXPECTED_FILE" === response.data.error.code
                  ) {
                    window.alert("Only 30 images allowed at a time");
                  } else {
                    // If not the given file type
                    window.alert("Incorrect file type");
                  }
                } else {
                  // Success
                  // let fileName = response.data;
                  // window.alert("Upload successful!");
                  this.props.finishedFunction(this.props.user._id);
                  this.props.finishedFunction();
                  this.setState({
                    label: "Select Files",
                    selectedFiles: null,
                    uploading: false
                  });
                }
              }
            })
            .catch(error => {
              // If another error
              window.alert(error);
            });
          
        }, 5000);
        }
    } else {
      // if file not selected throw error
      window.alert("Please upload file.");
    }
  };

  render() {
    return (
      <div>
        <div>
          <Button color="secondary" variant="text" component="label">
            {this.state.label === "" ? "Select Files" : this.state.label}
            <input
              type="file"
              multiple
              onChange={this.multipleFileChangedHandler}
              className="hide"
            />
          </Button>
          <Button color="secondary" onClick={this.multipleFileUploadHandler}>
            Upload!
          </Button>
        </div>
        <div>
          {this.state.uploading ? <CircularProgress color="secondary" /> : ""}
        </div>
      </div>
    );
  }
}
export default ProjectsUpload;
