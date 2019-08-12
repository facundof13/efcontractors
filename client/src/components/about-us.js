import React from 'react'
import { Typography } from "@material-ui/core";

export default class AboutUs extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>About Us</h4>
        </Typography>
      </div>
    )
  }
}