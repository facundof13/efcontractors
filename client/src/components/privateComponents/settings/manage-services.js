import React from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody
} from "@material-ui/core";
import Axios from "axios";
export default class ManageServices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      services: []
    };
  }

  componentDidMount() {
    Axios.get("/services").then(res => {
      this.setState({ services: res.data });
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className="manage-services">
        <div>
          <Typography color="secondary" component="span" variant="h5">
            <h5>Manage Services</h5>
          </Typography>
        </div>
        <Paper className='manage-services-table-root'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell align='right'>Residential</TableCell>
                <TableCell align='right'>Commercial</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.services.map(service => (
                <TableRow key={service._id}>
                  <TableCell>
                    {service.Service}
                  </TableCell>
                  <TableCell>
                    {service.Residential}
                  </TableCell>
                  <TableCell>
                    {service.Commercial}
                  </TableCell>
                  <TableCell>
                    {service.Service}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
