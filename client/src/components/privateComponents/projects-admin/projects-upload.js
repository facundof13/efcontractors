import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const videoTypes = [".mp4", ".mov"];

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
      console.log(url);
      var video = document.createElement("video");
      video.src = url;
      video.playsInline = true;
      video.muted = true;
      video.play();

      var canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;

      //convert to desired file format
      setTimeout(() => {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL("image/jpeg");
        URL.revokeObjectURL(url);
        resolve(dataURI);
      }, 1000); //at one second into the video
    });
  }
  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  getThumbnails(selectedFiles, data) {
    return new Promise(async (resolve, reject) => {
      // console.log(selectedFiles)
      // Array.from(selectedFiles).forEach((file, i) => {
      let mp4Avail = false;
      for (var file of Array.from(selectedFiles)) {
        if (videoTypes.includes(file.name.toLowerCase().slice(-4))) {
          mp4Avail = true;
        }
      }
      if (mp4Avail) {
        for (var file of Array.from(selectedFiles)) {
          if (videoTypes.includes(file.name.toLowerCase().slice(-4))) {
            let url = await this.takeScreenshot(file);
            data.append(
              "galleryImage",
              this.dataURItoBlob(url),
              file.name.toLowerCase().replace(/\.mp4|\.mov/g, "thumb.jpg")
            );
          }
        }
        resolve()
      } else {
        resolve();
      }
    });
  }

  multipleFileUploadHandler = () => {
    var data = new FormData();
    let selectedFiles = this.state.selectedFiles;
    // If file selected
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append(
          "galleryImage",
          selectedFiles[i],
          selectedFiles[i].name.toLowerCase().replace(/\s/g, "")
        );
      }
      if (this.state.selectedFiles.length > 30) {
        window.alert("Only 30 images allowed at once");
      } else {
        this.setState({
          uploading: true
        });
        this.getThumbnails(selectedFiles, data).then(res => {
          console.log(this.state);
          axios
            .post("/upload/multiple-file-upload", data, {
              params: {
                // folder name/Project Client's id: asdkfj13d32kdjasd
                projectName: this.props.user._id
              },
              headers: {
                accept: "application/json",
                "Accept-Language": "en-US,en;q=0.8",
                "Content-Type": `multipart/form-data; boundary=${
                  data._boundary
                }`
              }
            })
            .then(response => {
              this.setState({
                label: "Select Files",
                selectedFiles: null,
                uploading: false
              });
              if (200 === response.status) {
                // If file size is larger than expected.
                if (response.data.error) {
                  if ("LIMIT_FILE_SIZE" === response.data.error.code) {
                    window.alert("File is larger than max size");
                  } else if (
                    "LIMIT_UNEXPECTED_FILE" === response.data.error.code
                  ) {
                    window.alert("Only 30 images allowed at a time");
                  } else {
                    console.log(response.data.error);
                    // If not the given file type
                    window.alert("Incorrect file type");
                  }
                } else {
                  setTimeout(() => {
                    this.props.finishedFunction(this.props.user._id);
                    this.props.finishedFunction();
                  }, 2000); // wait 2 seconds for videos/files to finish uploading
                }
              }
            })
            .catch(error => {
              // If another error
              window.alert(error);
            });
        });
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
