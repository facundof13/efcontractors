import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

class Home extends Component {
  constructor() {
    super();
    this.state = { logoUrl: "" };
  }

  componentDidMount() {
    Axios.get("/admin/imgurl").then(res => {
      this.setState({ logoUrl: res.data[0].img });
      // console.log(res.data[0].img)
    });
  }

  render() {
    return (
      <div>
        <Typography component="span" variant="h4">
          <h4 className="yellow">Home</h4>
        </Typography>
        <img
              src='https://efcontractors.s3.us-east-2.amazonaws.com/logo.png'
              alt=""
              className='logo-img'
            />
      </div>
    );
  }
}

export default Home;
