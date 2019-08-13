import React from "react";
import { Typography, Divider } from "@material-ui/core";
import CompanyInformation from './company-information'

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Services</h4>
        </Typography>
        <Divider />
        <CompanyInformation />
        <Divider />
      </div>
    );
  }
}
