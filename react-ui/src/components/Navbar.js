import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import { Drawer,ClickAwayListener, Divider } from "@material-ui/core";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false };

    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    
  }
  // console.log(`Logged In: ${props.loggedIn}`);
  // const [anchorEl, setAnchorEl] = React.useState(null);

  handleClick() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }
  render() {
    return (
      <div className="root">
        <ClickAwayListener onClickAway={this.handleClose}>

        <AppBar position="static">
          <Toolbar>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
              color="secondary"
            >
              <MenuIcon />
            </Button>
            <Typography color="secondary" variant="h6" className="title">
              EFContractors
            </Typography>
            {this.props.loggedIn ? (
              <Link className="navbar-link" to="/logout">
                <Button color="secondary">Logout</Button>
              </Link>
            ) : (
              <Link className="navbar-link" to="/login">
                <Button color="secondary">Login</Button>
              </Link>
            )}
          </Toolbar>
          <Drawer className='navbar-drawer' variant="temporary" anchor="left" open={this.state.open}>
          <img src='https://efcontractors.s3.us-east-2.amazonaws.com/logosmall.png' alt='small logo' width='200px'></img>
          <Divider />
            {/* Show different links depending on logged in status */}
            {/* Logged in currently: */}
            {this.props.loggedIn ? (
              <div>
                <Link className="navbar-link" to="/admin">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Admin Home
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/admin/projects">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Manage Projects
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/admin/estimates">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Manage Estimates
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/admin/testimonials">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Manage Testimonials
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/admin/settings">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Settings
                  </MenuItem>
                </Link>
                <Divider />
              </div>
            ) : (
              <div>
                {/* Not Logged in currently: */}
                <Link className="navbar-link" to="/">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Home
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/about">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    About Us
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/testimonials">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Testimonials
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/projects">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Projects
                  </MenuItem>
                </Link>
                <Divider />
                <Link className="navbar-link" to="/services">
                  <MenuItem color="secondary" onClick={this.handleClose}>
                    Services
                  </MenuItem>
                </Link>
                <Divider />
              </div>
            )}
          </Drawer>
        </AppBar>
        </ClickAwayListener>
      </div>
    );
  }
}
