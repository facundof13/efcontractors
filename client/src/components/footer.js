import React from "react";
import "../App.css";
import Typography from "@material-ui/core/Typography";

export default function Footer(props) {
  return (
    <footer className='footer-bar'>
        <Typography variant="inherit" color='secondary'>
            <p>Lilburn, GA | Copyright © 2019 EF Contractors LLC | <a className='navbar-link' href='tel:4044093715'>404-409-3715</a></p>
        </Typography>
    </footer>
  );
}
