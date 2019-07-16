import React from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  IconButton
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export default class ItemField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceItem: "",
      itemDescription: "",
      tax: false,
      expense: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleCheckbox(event, isChecked) {
    this.setState({ [event.target.name]: isChecked });
  }

  render() {
    return (
      <form>
        <Select
          onChange={this.handleChange}
          value={this.state.serviceItem}
          name="serviceItem"
        >
          {this.props.services
            ? this.props.services.map(item => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))
            : ""}
        </Select>
        <TextField
          name="itemDescription"
          type="text"
          color="secondary"
          placeholder="Description"
          onChange={this.handleChange}
        />
        <FormControlLabel
          color="secondary"
          className="unselectable"
          name="tax"
          control={<Checkbox color="secondary" />}
          label="Tax"
          labelPlacement="end"
          onChange={this.handleCheckbox}
        />
        <FormControlLabel
          color="secondary"
          className="unselectable"
          name="expense"
          control={<Checkbox color="secondary" />}
          label="Expense"
          labelPlacement="end"
          onChange={this.handleCheckbox}
        />
        <IconButton
          color="secondary"
          onClick={() => this.props.removeItem(this.props.num)}
          // onClick={this.props.removeItem(this.props.num)}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </form>
    );
  }
}
