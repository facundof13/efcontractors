import React from "react";
import { Typography, Divider } from "@material-ui/core";
import Axios from "axios";

export default class AboutUs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      telephone: ""
    };
  }

  componentDidMount() {
    Axios.get("/admin/api/settings").then(res => {this.setState({telephone: res.data.telephone})});
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>About Us</h4>
        </Typography>
        <div className='about-us-root'>
          <div>
            <h5 className="about-us-header">
              EF Contractors Home & Residential
            </h5>
            <p className="about-us-body">
              At EF Contractors you will receive unrivaled service that is
              personalized to your every need. We provide and utilize premium
              products, quality materials, and reliable workers at all times.
              Whether it is a small kitchen improvement or a large commercial
              project, we strive to complete every job with 100% satisfaction.
              During projects, our project managers will continuously focus on
              project budgets, schedule and the overall satisfaction of every
              customer. EF Contractors brings years of experience to every
              project along with our proven subcontractors to provide you with
              an affordable, easy and overall great remodeling experience!
            </p>
          </div>
          <Divider />
          <div>
            <h5 className="about-us-header">Dreams Come True</h5>
            <p className="about-us-body">
              EF Contractors provides every customer with the options they have
              been searching for. We strive to provide outstanding customer care
              on all projects, big or small. Our team of experts will work
              together with you to create something that is both beautiful and
              functional. You can count on our expertise to turn your home into
              the dream home you have always desired.
            </p>
          </div>
          <Divider />
          <div>
            <h5 className="about-us-header">Why Call Us</h5>
            <p className="about-us-body">
              We work in the city of Atlanta constantly providing homeowners and
              businesses alike remodeling and renovation services, room
              additions, new buildings and so much more! Give our office a call
              today for a free estimate!
            </p>
          </div>
          <Divider />
          <div>
            <h5 className="about-us-header">Responsive</h5>
            <p className="about-us-body">
              When you hire us as your General Contractor you can expect 24/7
              communication. Once your project is underway, you'll reach us at {" "} 
              {this.state.telephone}. EF Contractors works hard to be available at all
              times!
            </p>
          </div>
        </div>
      </div>
    );
  }
}
