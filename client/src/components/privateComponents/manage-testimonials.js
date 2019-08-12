import React from "react";
import Axios from "axios";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Button
} from "@material-ui/core";

export default class ManageTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testimonials: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    Axios.get("/admin/testimonials")
      .then(res => {
        this.setState({ testimonials: res.data });
      })
  }

  handleChange(e, key) {
    let index = this.state.testimonials.findIndex(x => x._id === key);
    let copyObj = JSON.parse(JSON.stringify(this.state.testimonials[index]));
    if(e.target.name === 'verified') {
      copyObj.verified = e.target.checked
    } else {
      copyObj[e.target.name] = e.target.value;
    }
    let newArr = [...this.state.testimonials].filter(item => {
      return item._id !== key;
    });
    newArr.splice(index, 0, copyObj);

    this.setState({
      testimonials: [...newArr]
    });
  }

  handleSubmit() {
    Axios.post('/admin/updatetestimonials', {testimonials: this.state.testimonials})
  }

  render() {
    console.log(this.state);
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
      </div>
    );
  }
}
