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

  componentDidMount() {}

  render() {
    return (
      <footer className="footer-bar">
        <Typography variant="inherit" color="secondary">
          <div className="footer-items">
            <p>Lilburn, GA</p>
            <p>Copyright © 2019 EF Contractors LLC</p>
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
