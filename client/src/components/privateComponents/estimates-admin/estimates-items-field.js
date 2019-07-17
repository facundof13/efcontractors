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
  InputLabel
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export default class ItemField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceItem: "",
      itemDescription: "",
      quantity: "",
      num: 0,
      dollarAmount: "",
      itemError: "",
      descriptionError: "",
      quantityError: "",
      amountError: "",
      tax: false,
      expense: false,
      neither: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleMoney = this.handleMoney.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  componentDidMount() {
    this.setState({
      num: this.props.num
    });
  }

  handleOpen() {
    this.setState({ itemError: "Required" });
  }

  handleChange(event) {
    var error = "";
    switch (event.target.name) {
      case "itemDescription":
        error = "descriptionError";
        break;
      case "quantity":
        error = "quantityError";
        break;
      default:
        break;
    }

    this.setState(
      {
        [event.target.name]: event.target.value,
        [error]: "Required"
      },
      () => this.updateValues()
    );
  }

  handleCheckbox(event, isChecked) {
    this.setState({ [event.target.name]: isChecked }, () =>
      this.updateValues()
    );

    // let boxChecked = event.target.name;
    // // if(boxChecked === 'neither') {
    // //   if (this.state.neither) {
    // //     this.setState({neither: false, tax: true})
    // //   } else if (!this.state.neither) {
    // //     this.setState({neither: true, tax: false, expense: false})
    // //   }
    // // } else {
    // //   if (boxChecked === 'tax') {
    // //     this.setState({neither: false, tax: true})
    // //   }
    // // }

    // // switch(boxChecked) {
    // //   case 'tax':
    // //     this.setState(prevState => ({tax:!prevState.tax}))
    // //     break;
    // //   case 'expense':
    // //       this.setState(prevState => ({expense:!prevState.expense}))
    // //     break;
    // //   case 'neither':
    // //       this.setState(prevState => ({neither:!prevState.neither}))
    // //     break;
    // //   default:
    // //     break;
    // // }

    // let taxClicked = event.target.name === "tax";
    // let expenseClicked = event.target.name === "expense";
    // let neitherClicked = event.target.name === "neither";
    // let tax = this.state.tax;
    // let expense = this.state.expense;
    // let neither = this.state.neither;

    // if (neitherClicked && neither) {
    //   this.setState({ neither: false, tax: true });
    // } else if (neitherClicked && !neither) {
    //   this.setState({ neither: true, tax: false, expense: false });
    // } else if (taxClicked && neither) {
    //   this.setState({ tax: true, neither: false });
    // } else if (taxClicked && !neither) {
    //   if (!tax && !expense) {
    //     this.setState({ tax: true });
    //   } else if (expense) {
    //     this.setState(prevState => ({ tax: !prevState.tax }));
    //   } else if (tax && !expense) {
    //     this.setState({ tax: false, neither: true });
    //   }
    // } else if (expenseClicked && !neither) {
    //   if (tax) {
    //     this.setState(prevState => ({ expense: !prevState.expense }));
    //   } else if (!tax && expense) {
    //     this.setState({ expense: false, neither: true });
    //   }
    // } else if (expenseClicked && neither) {
    //   this.setState({ neither: false, expense: true });
    // }
  }

  handleMoney(event) {
    event.preventDefault();

    this.setState(
      {
        dollarAmount: "$" + event.target.value.replace(/\$/g, ""),
        amountError: "Required"
      },
      () => this.updateValues()
    );
  }

  updateValues() {
    if (
      this.state.serviceItem !== "" &&
      this.state.quantity !== "" &&
      (this.state.dollarAmount !== "" && this.state.dollarAmount !== "$") &&
      this.state.itemDescription !== ""
    ) {
      let itemsToReturn = {
        item: this.state.serviceItem,
        description: this.state.itemDescription,
        quantity: this.state.quantity,
        amount: this.state.dollarAmount,
        tax: this.state.tax,
        expense: this.state.expense
      };
      // if (this.state.tax) {
      //   itemsToReturn.push('tax');
      // }
      // if (this.state.expense) {
      //   itemsToReturn.push('expense');
      // }
      this.props.updateItems(itemsToReturn);
    }
  }

  render() {
    return (
      <form id="item-form">
        <div>
          <FormControl>
            <InputLabel htmlFor="item-select">Item</InputLabel>
            <Select
              className="estimate-item-select-width"
              id="item-select"
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
            <FormHelperText>
              {this.state.serviceItem === "" ? this.state.itemError : ""}
            </FormHelperText>
          </FormControl>

          <TextField
            label="Description"
            name="itemDescription"
            type="text"
            color="secondary"
            placeholder="Description"
            className="description"
            multiline={true}
            value={this.state.itemDescription}
            helperText={
              this.state.itemDescription === ""
                ? this.state.descriptionError
                : ""
            }
            onChange={this.handleChange}
          />

          <TextField
            className="quantity-amount-width"
            label="Quantity"
            name="quantity"
            type="number"
            color="secondary"
            placeholder="Quantity"
            helperText={
              this.state.quantity === "" ? this.state.quantityError : ""
            }
            value={this.state.quantity}
            onChange={this.handleChange}
          />
          <TextField
            className="quantity-amount-width"
            label="Amount"
            name="dollarAmount"
            type="text"
            color="secondary"
            placeholder="$0.00"
            helperText={
              this.state.dollarAmount === "" || this.state.dollarAmount === "$"
                ? this.state.amountError
                : ""
            }
            value={this.state.dollarAmount}
            onChange={this.handleMoney}
          />
          <IconButton
            color="secondary"
            onClick={() => this.props.removeItem(this.props.num)}
          >
            <DeleteOutlinedIcon />
          </IconButton>
          {/* checkboxes */}
          <div>
            <FormControlLabel
              checked={this.state.tax}
              color="secondary"
              className="unselectable"
              name="tax"
              control={<Checkbox color="secondary" />}
              label="Tax"
              labelPlacement="end"
              onChange={this.handleCheckbox}
            />
            <FormControlLabel
              checked={this.state.expense}
              color="secondary"
              className="unselectable"
              name="expense"
              control={<Checkbox color="secondary" />}
              label="Expense"
              labelPlacement="end"
              onChange={this.handleCheckbox}
            />
            <FormControlLabel
              color="secondary"
              checked={this.state.neither}
              className="unselectable"
              name="neither"
              control={<Checkbox color="secondary" />}
              label="Neither"
              labelPlacement="end"
              onChange={this.handleCheckbox}
            />
          </div>
        </div>
      </form>
    );
  }
}
