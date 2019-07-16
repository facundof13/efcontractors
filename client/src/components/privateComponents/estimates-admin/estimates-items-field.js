import React from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
  FormControl,
  FormLabel
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export default class ItemField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceItem: "",
      itemDescription: "",
      tax: false,
      expense: false,
      quantity: 1,
      num: 0,
      dollarAmount: 0,
      helperText: "",
      helperTextList: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  componentDidMount() {
    this.setState({
      num: this.props.num
    });
  }

  showError() {
    this.setState({helperText:"Required"})
  }

  handleOpen() {
    this.setState({ helperTextList: "Required" });
    this.showError()
  }

  handleChange(event) {
    this.setState({helperText:"Required"})
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      () => this.updateValues()
    );
  }

  handleCheckbox(event, isChecked) {
    this.setState({ [event.target.name]: isChecked }, () =>
      this.updateValues()
    );
  }

  updateValues() {
    if (this.state.serviceItem === "") {
      console.log("Empty item");
    }
    this.props.updateItems(this.state);
  }

  render() {
    return (
      <form>
        <FormControl>
          <Select
          className='estimate-item-select-width'
            onChange={this.handleChange}
            onOpen={this.handleOpen}
            value={this.state.serviceItem}
            name="serviceItem"
            required
          >
            {this.props.services
              ? this.props.services.map(item => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))
              : ""}
          </Select>
          <FormHelperText>{this.state.serviceItem === "" ? this.state.helperTextList : ""}</FormHelperText>
        </FormControl>

          <TextField
            label="Description"
            name="itemDescription"
            type="text"
            color="secondary"
            required
            placeholder="Description"
            helperText={
              this.state.itemDescription === "" ? this.state.helperText : ""
            }
            onChange={this.handleChange}
          />

        <TextField
        label="Quantity"
          name="quantity"
          type="number"
          color="secondary"
          required
          placeholder="Quantity"
          helperText={
            this.state.quantity === "" ? this.state.helperText : ""
          }
          value={this.state.quantity}
          onChange={this.handleChange}
        />
         <TextField
         label='Amount'
          name="dollarAmount"
          type="number"
          color="secondary"
          required
          placeholder="$0.00"
          helperText={
            this.state.dollarAmount === "" ? this.state.helperText : ""
          }
          value={this.state.dollarAmount}
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
