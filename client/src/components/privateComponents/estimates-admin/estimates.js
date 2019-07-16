import React from "react";
import Typography from "@material-ui/core/Typography";
import CreateEstimate from "./create-estimates";

export default class Estimates extends React.Component {
  // constructor() {
  //   super();
  // }

  //post to db
  postEstimate(info) {
    //post
  }

  render() {
    return (
      <div>
        <Typography component="span" variant="h4" color="secondary">
          <h4>Manage Estimates</h4>
        </Typography>
        <CreateEstimate post={this.postEstimate} />
      </div>
    );
  }
}
