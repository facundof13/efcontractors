import React from "react";
import { TextField, IconButton } from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
export default class PaymentSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stepName: "", stepDescription: "", stepAmount: "" };

    this.handleChange = this.handleChange.bind(this);
    this.render = this.render.bind(this);
  }

  handleChange(e) {
    console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.props.updateStep({
        id: this.props.id,
        stepName: this.state.stepName,
        stepDescription: this.state.stepDescription,
        stepAmount: this.state.stepAmount
      });
    });
  }

  render() {
    return (
      <div className="step">
        <TextField
          onChange={this.handleChange}
          label="Step Name"
          name="stepName"
          value={this.state.stepName}
        >
          {this.state.stepName}
        </TextField>
        <TextField
          onChange={this.handleChange}
          label="Step Description"
          name="stepDescription"
          value={this.state.stepDescription}
        >
          {this.state.stepDescription}
        </TextField>
        <TextField
          onChange={this.handleChange}
          label="Step Amount"
          name="stepAmount"
          value={this.state.stepAmount}
        >
          {this.state.stepAmount}
        </TextField>
        <IconButton onClick={this.props.removeStep}>
          <DeleteOutlined />
        </IconButton>
      </div>
    );
  }
}
