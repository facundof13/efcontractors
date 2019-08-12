import React from "react";
import Axios from "axios";
import { TextField, FormControlLabel, Checkbox, Typography } from "@material-ui/core";

export default class ManageTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testimonials: [],
      testimonialElements: []
    };

    this.createElements = this.createElements.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    Axios.get("/admin/testimonials")
      .then(res => {
        this.setState({ testimonials: res.data });
      })
      .then(() => {
        this.createElements();
      });
  }

  handleChange(e, key) {
   //grab index of editing item
   //edit it
   //repush it to state

    
    // remove the current index from array
    // make a copy of the current array
    // edit the array
    // push it back to the state
  }

  createElements() {
    let arr = [];
    this.state.testimonials.map(i => {
      let item = (
        <div className='testimonials-field' key={i._id}>
          <TextField
            className="black-text"
            value={i.Text}
            name="text"
            type="text"
            color="primary"
            onChange={(event, key) => this.handleChange(event, i._id)}
            // multiline
          />
          <TextField
            className="black-text"
            value={i.Name}
            name="name"
            type="text"
            color="primary"
            onChange={(event, key) => this.handleChange(event, i._id)}
          />
          <TextField
            className="black-text"
            value={i.CityState}
            name="cityState"
            type="text"
            color="primary"
            onChange={(event, key) => this.handleChange(event, i._id)}
            // multiline
          />
          <FormControlLabel
            label="Published"
            name="Verified"
            className="estimate-checkbox"
            control={<Checkbox />}
            checked={i.Verified}
            onChange={(event, key) => this.handleChange(event, i._id)}
          />
        </div>
      );
      arr.push(item);
    });
    this.setState({
      testimonialElements: [...arr]
    });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <div className="manage-testimonials">
        <Typography color="secondary" component="span" variant="h4">
            <h4>Manage Testimonials</h4>
          </Typography>
          {this.state.testimonialElements.length > 0
            ? this.state.testimonialElements
            : ""}
        </div>
      </div>
    );
  }
}
