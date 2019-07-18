import React from "react";
import Typography from "@material-ui/core/Typography";
import CreateEstimate from "./create-estimates";
import { Button } from "@material-ui/core";

//components
import EstimatesTable from "./estimates-table";

export default class Estimates extends React.Component {
  constructor() {
    super();
    this.state = { showCreateEstimate: false, showTable: true };

    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleTable = this.toggleTable.bind(this);
  }

  toggleCreate() {
    if (!this.state.showCreateEstimate && this.state.showTable) {
      this.setState({ showTable: false });
    }
    this.setState(prevState => ({
      showCreateEstimate: !prevState.showCreateEstimate
    }));
  }

  toggleTable() {
    if (this.state.showCreateEstimate && !this.state.showTable) {
      this.setState({ showCreateEstimate: false });
    }
    this.setState(prevState => ({
      showTable: !prevState.showTable
    }));
  }

  render() {
    return (
      <div>
        <Typography component="span" variant="h4" color="secondary">
          <h4>Manage Estimates</h4>
        </Typography>
        <Button color="secondary" onClick={this.toggleCreate}>
          {this.state.showCreateEstimate ? "Hide Create" : "Show Create"}
        </Button>
        <Button color="secondary" onClick={this.toggleTable}>
          {this.state.showTable ? "Hide Table" : "Show Table"}
        </Button>

        {this.state.showCreateEstimate ? (
          <div id="showCreateEstimate">
            <CreateEstimate />
          </div>
        ) : (
          ""
        )}

        {this.state.showTable ? (
          <div id="showEstimateTable">
            <EstimatesTable />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
