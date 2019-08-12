import React from 'react'
import { Typography } from "@material-ui/core";

export default class Services extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Services</h4>
        </Typography>
      </div>
    )
  }
}