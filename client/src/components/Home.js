import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

class Home extends Component {
  constructor() {
    super();
    this.state = { logoUrl: "", testimonial: '' };
  }

  componentDidMount() {
    Axios.get("/admin/imgurl").then(res => {
      this.setState({ logoUrl: res.data[0].img });
      // console.log(res.data[0].img)
    });
    Axios.get('/testimonials').then(res => {
      console.log(res.data)
      this.setState({testimonial: res.data[Math.floor((Math.random()* res.data.length))]})
    })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <img
              src='https://efcontractors.s3.us-east-2.amazonaws.com/logo.png'
              alt=""
              className='logo-img'
            />
        <div className="testimonials-grid"><Typography component="span">
              <blockquote>
                {" "}
                {this.state.testimonial.text}{" "}
                <span>
                  {this.state.testimonial.name} | {this.state.testimonial.cityState}
                </span>
              </blockquote>
            </Typography></div>
      </div>
    );
  }
}

export default Home;
