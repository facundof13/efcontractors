import React from "react";
import {
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog
} from "@material-ui/core";
import Axios from "axios";
export default class Testimonials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testimonials: []
    };
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
                {testimonial.Name}, {testimonial.CityState}
              </span>
            </blockquote>
          </Typography>
        );
      });
      this.setState({ testimonials: [...arr] });
    });
  }
  //render them

  render() {
    console.log(this.state);
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
              color="primary"
              onClick={handleClickOpen}
            >
              Open form dialog
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To subscribe to this website, please enter your email address
                  here. We will send updates occasionally.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                  Subscribe
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}
