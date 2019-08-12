import React from "react";
import {
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  Button,
  TextField
} from "@material-ui/core";
import Axios from "axios";
export default class Testimonials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testimonials: [],
      open: false,
      text: "",
      name: "",
      cityState: ""
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //get all testimonials
  componentDidMount() {
    Axios.get("/testimonials").then(res => {
      var arr = [];
      res.data.map(testimonial => {
        console.log(testimonial);
        arr.push(
          <Typography key={testimonial._id} component="span">
            <blockquote key={testimonial._id}>
              {" "}
              {testimonial.Text}{" "}
              <span>
                {testimonial.Name} | {testimonial.CityState}
              </span>
            </blockquote>
          </Typography>
        );
      });
      this.setState({ testimonials: [...arr] });
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    if (this.state.text === '' || 
    this.state.name === ''||
    this.state.cityState === '') {
      window.alert("Empty field!")
    } else {
      Axios.post('/testimonials', {text: this.state.text, name: this.state.name, cityState: this.state.cityState})
      .then(res => {
        this.setState({
          open: false
        })
      })
    }
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <div>
          <Typography color="secondary" component="span" variant="h4">
            <h4>Testimonials</h4>
          </Typography>
        </div>
        <div className="testimonials-grid">{this.state.testimonials}</div>
        <div className="submit-testimonial">
          <div>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleClickOpen}
            >
              Submit a testimonial
            </Button>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                We appreciate your feedback!
              </DialogTitle>
              <DialogContent>
                
                <TextField
                className='black-text'
                value={this.state.text}
                name="text"
                type="text"
                label="Tell us what you think"
                color="primary"
                onChange={this.handleChange}
                multiline
                fullWidth
              />
               <TextField
                className='black-text'
                value={this.state.name}
                name="name"
                type="text"
                label="Name"
                color="primary"
                onChange={this.handleChange}
                fullWidth
              />
               <TextField
                className='black-text'
                value={this.state.cityState}
                name="cityState"
                type="text"
                label="City, State"
                color="primary"
                onChange={this.handleChange}
                multiline
                fullWidth
              />
              <DialogContentText color="primary">
                  Please note: your submission may not be immediately available
                  on our testimonials page. The submission will be available
                  once it is reviewed by a moderator.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleSubmit} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}
