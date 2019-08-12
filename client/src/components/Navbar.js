import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";

export default function Navbar(props) {
  // console.log(`Logged In: ${props.loggedIn}`);
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    setAnchorEl(null);
  }

  return (
    <div className="root">
      <AppBar position="static" >
        <Toolbar>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="secondary"
          >
            <MenuIcon />
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            color="primary"
          >
            {/* Show different links depending on logged in status */}
            {/* Logged in currently: */}
            {props.loggedIn ? (
              <div>
                <Link className="navbar-link" to="/">
                  <MenuItem color="secondary" onClick={handleClose}>Home</MenuItem>
                </Link>
                <Link className="navbar-link" to="/projects">
                  <MenuItem color="secondary" onClick={handleClose}>Projects</MenuItem>
                </Link>
                <Link className="navbar-link" to="/admin">
                  <MenuItem color="secondary" onClick={handleClose}>Admin Home</MenuItem>
                </Link>
                <Link className="navbar-link" to="/admin/projects">
                  <MenuItem color="secondary" onClick={handleClose}>Manage Projects</MenuItem>
                </Link>
                <Link className="navbar-link" to="/admin/estimates">
                  <MenuItem color="secondary" onClick={handleClose}>Manage Estimates</MenuItem>
                </Link>
              </div>
            ) : (
              <div>
              {/* Not Logged in currently: */}
                <Link className="navbar-link" to="/">
                  <MenuItem color="secondary" onClick={handleClose}>Home</MenuItem>
                </Link>
                <Link className="navbar-link" to="/about">
                  <MenuItem color="secondary" onClick={handleClose}>About Us</MenuItem>
                </Link>
                <Link className="navbar-link" to="/testimonials">
                  <MenuItem color="secondary" onClick={handleClose}>Testimonials</MenuItem>
                </Link>
                <Link className="navbar-link" to="/projects">
                  <MenuItem color="secondary" onClick={handleClose}>Projects</MenuItem>
                </Link>
                <Link className="navbar-link" to="/services">
                  <MenuItem color="secondary" onClick={handleClose}>Services</MenuItem>
                </Link>
                
              </div>
            )}
          </Menu>
          <Typography color="secondary" variant="h6" className="title">
            EFContractors
          </Typography>
          {props.loggedIn ? (
            <Link className="navbar-link" to="/logout">
              <Button color="secondary">Logout</Button>
            </Link>
          ) : (
            <Link className="navbar-link" to="/login">
              <Button color="secondary">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
    /*
              <section>
                <Link to="/" className="">
                  <span className="">Home</span>
                </Link>
                <Link to="/projects" className="">
                  <span className="">Projects</span>
                </Link>
                <Link to="/login" className="">
                  <span className="">Login</span>
                </Link>
              </section>
            )} }*/
  );
}
