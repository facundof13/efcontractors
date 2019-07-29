import React from "react";
import { TextField, IconButton } from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
export default class PaymentSchedule extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.existingStep) {
      this.state = {
        id: this.props.id,
        stepName: this.props.existingStep.stepName,
        stepDescription: this.props.existingStep.stepDescription,
        stepAmount: this.props.existingStep.stepAmount
      };
    } else {
      this.state = {
        id: this.props.id,
        stepName: "",
        stepDescription: "",
        stepAmount: ""
      };
    }

    this.handleChange = this.handleChange.bind(this);
    this.render = this.render.bind(this);
  }

  handleChange(e) {
    console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.props.updateStep({
        id: this.state.id,
        stepName: this.state.stepName,
        stepDescription: this.state.stepDescription,
        stepAmount: this.state.stepAmount
      });
    });
  }

  render() {
    console.log(this.state)
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
