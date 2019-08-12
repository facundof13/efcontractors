import React from "react";
import { Typography, Paper } from "@material-ui/core";
import Axios from "axios";
export default class Testimonials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testimonials: [],
    };
  }

  //get all testimonials
  componentDidMount() {
    Axios.get("/testimonials").then(
      res => {
        var arr = [];
        res.data.map(testimonial => {
          arr.push(
              <Typography key={testimonial._id} component="span">
                <p> {testimonial.Text}</p>
              </Typography>
          );
        });
        this.setState({ testimonials: [...arr] });
      }
    );
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
        <div className='testimonials-grid'>
        <div>{this.state.testimonials}</div>
        </div>
      </div>
    );
  }
}
