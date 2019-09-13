import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

class Home extends Component {
  constructor() {
    super();
    this.state = { logoUrl: "", testimonial: "" };
  }

  componentDidMount() {
    Axios.get("/admin/imgurl").then(res => {
      this.setState({ logoUrl: res.data[0].img });
    });
    Axios.get("/api/testimonials").then(res => {
      this.setState({
        testimonial: res.data[Math.floor(Math.random() * res.data.length)]
      });
    });
  }

  render() {
    return (
      <div className="home-flex">
        <div>
          <img
            src="https://efcontractors.s3.us-east-2.amazonaws.com/logo.png"
            alt=""
            className="logo-img"
          />
          <div className="testimonials-grid">
            <Typography component="span">
              <blockquote>
                {" "}
                {this.state.testimonial.text}{" "}
                <span>
                  {this.state.testimonial.name} |{" "}
                  {this.state.testimonial.cityState}
                </span>
              </blockquote>
            </Typography>
          </div>
        </div>
        <div className="facebook-button">
          <iframe
          title='facebook-button'
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fefcontractorsllc2015%2F&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
            width="340"
            height="130"
            // style="border:none;overflow:hidden"
            scrolling="no"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>
      </div>
    );
  }
}

export default Home;
