import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@material-ui/core";

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { project: "" };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    if (this.props.user.length > 0) {
      // this.setState({ project: this.props.user[0].name });
      // Infinite loop here
    }
  }

  handleChange(event, value) {
    this.setState({ project: event.target.value });
    this.props.getUser(value.key);
    // console.log(value)
  }

  render() {
    // console.log(this.state.project.name);
    return (
      <div>
        <form id="item-form">
          <div className="login">
            <FormControl>
              <InputLabel htmlFor="customer-select">
                Select a project
              </InputLabel>
              <Select
                className="estimate-item-select-width"
                id="item-select"
                // className="estimate-item-select-width"
                // id="customer-select"
                onChange={this.handleChange}
                // onOpen={this.handleOpen}
                value={this.state.project}
                name="selectedCustomer"
                // required
              >
                <MenuItem value="">None</MenuItem>
                {this.props.projects
                  ? this.props.projects.map(project => (
                      <MenuItem
                        value={project.name}
                        id={project._id}
                        key={project._id}
                      >
                        {project.name}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
            </FormControl>
          </div>
        </form>
      </div>
    );
  }
}
