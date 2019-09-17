import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  Button,
  CircularProgress
} from "@material-ui/core";
import Axios from "axios";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export default class ManageServices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      servicesToChange: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getServices();
  }

  getServices() {
    Axios.get("/api/services").then(res => {
      this.setState({ services: res.data });
    });
  }

  handleChange(e, key) {
    let index = this.state.services.findIndex(x => x._id === key);
    let copyObj = JSON.parse(JSON.stringify(this.state.services[index]));
    if (e.target.name === "Residential" || e.target.name === "Commercial") {
      copyObj[e.target.name] = e.target.checked;
    } else {
      copyObj[e.target.name] = e.target.value;
    }
    let newArr = [...this.state.services].filter(item => {
      return item._id !== key;
    });
    newArr.splice(index, 0, copyObj); //add to new arr
    this.setState(prevState => ({
      services: [...newArr],
      servicesToChange: [
        ...prevState.servicesToChange.filter(item => {
          return item._id !== key;
        }),
        copyObj
      ]
    }));
  }

  deleteRow(e) {
    if (window.confirm("Delete service?")) {
      Axios.delete("/admin/api/services", { data: { _id: e } });
      this.setState(
        prevState => ({
          services: prevState.services.filter(item => {
            return item._id !== e;
          })
        }),
        this.getServices
      );
    }
  }

  addService() {
    let newObj = {
      Service: "",
      Residential: false,
      Commercial: false,
      _id: Date.now()
    };

    this.setState(prevState => ({
      services: [...prevState.services, newObj]
    }));
  }

  saveServices() {
    this.setState({ loading: true });
    this.state.servicesToChange.map(service => {
      if (typeof service._id === "number") {
        Axios.post("/admin/api/addservices", {
          Service: service.Service,
          Residential: service.Residential,
          Commercial: service.Commercial
        });
      } else {
        Axios.post("/admin/api/services", {
          _id: service._id,
          Service: service.Service,
          Residential: service.Residential,
          Commercial: service.Commercial
        });
      }
      return 0;
    });
    setTimeout(() => {
      this.setState({ loading: false, servicesToChange: [], });
      this.getServices();
    }, 1000);
  }

  render() {
    return (
      <div className="manage-services">
        <div className="loading">
          {this.state.loading ? (
            <CircularProgress size={30} color="secondary" />
          ) : (
            ""
          )}
        </div>

        <div className="save-services-btns">
        </div>
          <div>
            <div className="save-services-btns">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => this.addService()}
              >
                Add Service
              </Button>
            </div>
            <Paper className="manage-services-table-root">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Residential</TableCell>
                    <TableCell align="right">Commercial</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.services.map(service => (
                    <TableRow key={service._id}>
                      <TableCell align="left">
                        <TextField
                          name="Service"
                          onChange={e => this.handleChange(e, service._id)}
                          value={service.Service}
                          // multiline={true}
                          fullWidth={true}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <FormControlLabel
                          name="Residential"
                          className="estimate-checkbox"
                          control={<Checkbox />}
                          checked={service.Residential}
                          onChange={e => this.handleChange(e, service._id)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <FormControlLabel
                          name="Commercial"
                          className="estimate-checkbox"
                          control={<Checkbox />}
                          checked={service.Commercial}
                          onChange={e => this.handleChange(e, service._id)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => this.deleteRow(service._id)}>
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <div className="save-services-btns">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => this.saveServices()}
              >
                Save
              </Button>
            </div>
          </div>
      </div>
    );
  }
}
