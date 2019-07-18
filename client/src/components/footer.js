import React from "react";
import "../App.css";
import Typography from "@material-ui/core/Typography";

export default class Footer extends React.Component {
  constructor() {
    super();
    this.state = {
      date: ""
    };
  }

  componentDidMount() {
    var date = new Date();
    this.setState({ date: date.getFullYear() });
  }

  render() {
    return (
      <footer className="footer-bar">
        <Typography variant="inherit" color="secondary">
          <div className="footer-items">
            <p>Lilburn, GA </p>
            <p className="copyright-spacer">
              {" "}
              Copyright © 2015-{this.state.date} EF Contractors LLC{" "}
            </p>
            <p>
              <a className="navbar-link" href="tel:4044093715">
                404-409-3715
              </a>
            </p>
          </div>
        </Typography>
      </footer>
    );
  }
}
