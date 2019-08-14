import React from "react";
import { Typography, Divider } from "@material-ui/core";
import CompanyInformation from './company-information'
import ManageServices from "./manage-services";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='settings-root'>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Settings</h4>
        </Typography>
        <Divider className='divider' />
        <CompanyInformation />
        <Divider className='divider' />
        <ManageServices />
        <Divider className='divider' />
      </div>
    );
  }
}
