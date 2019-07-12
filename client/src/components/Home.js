import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";

class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <Typography component="span" variant="h4">
            <h4 className='yellow'>Home</h4>
          </Typography>
      </div>
    );
  }
}

export default Home;
