import React from "react";
import Axios from "axios";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  CircularProgress
} from "@material-ui/core";

export default class ManageTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testimonials: [],
      loading: false,
      updatedTestimonials: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getTestimonials = this.getTestimonials.bind(this);
  }

  componentDidMount() {
    this.getTestimonials();
  }

  getTestimonials() {
    Axios.get("/admin/api/testimonials").then(res => {
      this.setState({ testimonials: res.data });
    });
  }

  handleChange(e, key) {
    let index = this.state.testimonials.findIndex(x => x._id === key);
    let copyObj = JSON.parse(JSON.stringify(this.state.testimonials[index]));
    if (e.target.name === "verified") {
      copyObj.verified = e.target.checked;
    } else {
      copyObj[e.target.name] = e.target.value;
    }
    let newArr = [...this.state.testimonials].filter(item => {
      return item._id !== key;
    });
    newArr.splice(index, 0, copyObj); //add to new arr
    this.setState(prevState => ({
      testimonials: [...newArr],
      updatedTestimonials: [...prevState.updatedTestimonials.filter(item => {
        return item._id !== key}), copyObj]
    }));
  }

  handleSubmit() {
    this.setState({ loading: true });
    Axios.post("/admin/api/updatetestimonials", {
      testimonials: this.state.updatedTestimonials
    }).then(() => {
      setTimeout(() => {
        this.setState({ loading: false, updatedTestimonials: [] });
      }, 400);
    });
  }

  deleteTestimonial(id) {
    if (window.confirm(`Delete testimonial?`)) {
      Axios.delete(`/admin/api/testimonials`, { data: { id: id } }).then(() => {
        this.getTestimonials();
      });
    }
  }

  render() {
    return (
      <div>
        <div className="manage-testimonials">
          <Typography color="secondary" component="span" variant="h4">
            <h4>Manage Testimonials</h4>
          </Typography>
          {this.state.testimonials.length > 0
            ? this.state.testimonials.map(i => (
                <div className="testimonials-field" key={i._id}>
                  <TextField
                    className="black-text"
                    value={i.text}
                    name="text"
                    type="text"
                    color="primary"
                    onChange={(event, key) => this.handleChange(event, i._id)}
                    // multiline
                  />
                  <TextField
                    className="black-text"
                    value={i.name}
                    name="name"
                    type="text"
                    color="primary"
                    onChange={(event, key) => this.handleChange(event, i._id)}
                  />
                  <TextField
                    className="black-text"
                    value={i.cityState}
                    name="cityState"
                    type="text"
                    color="primary"
                    onChange={(event, key) => this.handleChange(event, i._id)}
                    // multiline
                  />
                  <FormControlLabel
                    label="Published"
                    name="verified"
                    className="estimate-checkbox"
                    control={<Checkbox />}
                    checked={i.verified}
                    onChange={(event, key) => this.handleChange(event, i._id)}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.deleteTestimonial(i._id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            : ""}
          <Button
            variant="outlined"
            color="secondary"
            onClick={this.handleSubmit}
          >
            Submit changes
          </Button>
        </div>
        <div className="loading">
          {this.state.loading ? (
            <CircularProgress size={30} color="secondary" />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
