import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import "../App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";

export default function Footer(props) {
  return (
    <footer className='footer-bar'>
        <Typography variant="inherit" color='secondary'>
            <p>Lilburn, GA | Copyright © 2019 EF Contractors LLC | <a className='navbar-link' href='tel:4044093715'>404-409-3715</a></p>
        </Typography>
    </footer>
  );
}
