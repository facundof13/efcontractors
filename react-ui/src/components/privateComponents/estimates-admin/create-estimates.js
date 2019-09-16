import React from "react";
import { Typography } from "@material-ui/core";
import { TextField, Button, Divider } from "@material-ui/core";
import Axios from "axios";
import ItemField from "./estimates-items-field";
import SelectExistingClient from "./select-existing-client";
export default class CreateEstimate extends React.Component {
  constructor() {
    super();
    this.state = {
      services: [],
      itemsField: [],
      items: [],
      name: "",
      title: "",
      email: "",
      address: "",
      cityState: "",
      zip: "",
      expiration: "",
      itemError: "",
      phone: "",
      disabled: true,
      selectedItem: [],
      customers: [],
      client: [],
      clientSelected: false,
      idToUpdate: "",
      invoice: false,
      attachContract: false,
      contractSpecs: "",
      paid: false,
      paymentSteps: [],
      pdfLink: "",
      estimateNum: 0,
      paidDate: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.resetFields = this.resetFields.bind(this);
    // this.filterItemsArr = this.filterItemsArr.bind(this);
    this.submitInvoice = this.submitInvoice.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.fillWithSelectedCustomer = this.fillWithSelectedCustomer.bind(this);
  }

  componentDidMount() {
    //load the services from db, then populate the service selectors
    this.getServices().then(() => {
      this.addItem();
    });

    this.getCustomers();

    Axios.get("/admin/api/estimateNum").then(res => {
      this.setState({ estimateNum: res.data });
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  getServices() {
    return new Promise((resolve, reject) => {
      Axios.get("/admin/api/invoiceServices").then(res => {
        this.setState({ services: res.data });
        resolve();
      });
    });
  }

  getCustomers() {
    // get available customers
    Axios.get("/admin/api/invoiceCustomers").then(res => {
      this.setState({ customers: res.data });
    });
  }

  fillWithSelectedCustomer(client) {
    if (client) {
      this.setState({
        clientSelected: true,
        name: client.name,
        email: client.email,
        address: client.address,
        cityState: client.cityState,
        zip: client.zip,
        phone: client.phone,
        idToUpdate: client._id
      });
    } else {
      this.resetFields();
    }
  }

  addItem() {
    let date = Date.now();
    let newItem = (
      <div key={date}>
        <ItemField
          key={date}
          num={date}
          removeItem={this.removeItem}
          services={this.state.services}
          updateItems={this.updateItems}
        />
        <Divider />
      </div>
    );
    this.setState(prevState => ({
      itemsField: [...prevState.itemsField, newItem]
    }));
  }

  removeItem(date) {
    if (this.state.itemsField.length !== 1) {
      this.setState(prevState => ({
        itemsField: prevState.itemsField.filter(function(item) {
          return String(date) !== String(item.key);
        })
      }));
    }
  }

  updateItems(itemArr) {
    this.setState(prevState => ({
      items: [
        ...prevState.items.filter(item => {
          return item.num !== itemArr.num;
        }),
        itemArr
      ]
    }));
  }

  resetFields() {
    this.setState(
      {
        clientSelected: false,
        name: "",
        address: "",
        cityState: "",
        zip: "",
        expiration: "",
        title: "",
        email: "",
        items: [],
        itemsField: [],
        itemError: "",
        disabled: true,
        helperText: "",
        phone: "",
        contractSpecs: "",
        invoice: false,
        attachContract: false,
        paid: this.state.paid,
        pdfLink: "",
        paidDate: this.state.paidDate
      },
      () => {
        this.addItem();
      }
    );
  }

  checkForm() {
    let zipOk = false;
    let itemsOk = false;
    let cityStateOk = false;
    let emailOk = false;
    let phoneOk = false;
    let titleOk = false;

    if (
      this.state.name !== "" &&
      this.state.address !== "" &&
      this.state.cityState !== "" &&
      this.state.zip !== "" &&
      this.state.expiration !== "" &&
      this.state.title !== "" &&
      this.state.email !== "" &&
      this.state.phone !== ""
    ) {
      titleOk = true;
      if (this.state.zip.match(/^\d{5}$/)) {
        zipOk = true;
      }
      if (
        this.state.cityState.match(/([A-Za-z]+(?: [A-Za-z]+)*),? ([A-Za-z]{2})/)
      ) {
        cityStateOk = true;
      }

      if (this.state.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/)) {
        emailOk = true;
      }

      if (
        this.state.phone.match(
          /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s-]?[\0-9]{3}[\s-]?[0-9]{4}$/g
        )
      ) {
        phoneOk = true;
      }

      this.state.items.forEach(item => {
        if (
          item.itemDescription === "" ||
          item.serviceItem === "" ||
          item.quantity === "" ||
          item.dollarAmount === ""
        ) {
          // window.alert("An item is empty/incorrect.");
        } else {
          itemsOk = true;
        }
      });
    }

    if (itemsOk && zipOk && cityStateOk && emailOk && phoneOk && titleOk) {
      this.setState({ disabled: false });
    }
  }

  submitInvoice() {
    var expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + Number(this.state.expiration)
    );

    let query = {
      expiration: expirationDate,
      title: this.state.title,
      items: this.state.items,
      invoice: this.state.invoice,
      paidDate: this.state.paidDate,
      estimateNum: this.state.estimateNum,
      pdfLink: this.state.pdfLink,
      paymentSteps: this.state.paymentSteps,
      paid: this.state.paid,
      attachContract: this.state.attachContract,
      contractSpecs: this.state.contractSpecs
    };

    if (this.state.clientSelected) {
      query.id = this.state.idToUpdate;
      query.date = new Date();
      Axios.post("/admin/api/invoiceupdate", query).then(res => {
        if (res.status === 200) {
          Axios.post("/admin/api/estimateNum").then(() => {
            this.resetFields();
          });
        }
      });
    } else {
      query.name = this.state.name;
      query.address = this.state.address;
      query.cityState = this.state.cityState;
      query.zip = this.state.zip;
      query.phone = this.state.phone;
      query.email = this.state.email;
      query.dateSubmitted = new Date();
      Axios.post("/admin/api/invoice", query).then(res => {
        if (res.status === 200) {
          Axios.post("/admin/api/estimateNum").then(() => {
            this.resetFields();
          });
        }
      });
    }
  }

  render() {
    return (
      <div>
        {/* //update existing customer */}
        {this.state.customers.length > 0 ? (
          <SelectExistingClient
            update={this.fillWithSelectedCustomer}
            customers={this.state.customers}
          />
        ) : (
          ""
        )}

        <div>
          <form autoComplete="off" id="create-form">
            <div className="top login">
              <TextField
                value={this.state.name}
                helperText={this.state.name === "" ? this.state.helperText : ""}
                name="name"
                disabled={this.state.clientSelected}
                type="text"
                label="Client Name"
                color="secondary"
                placeholder="Client Name"
                onChange={this.handleChange}
              />

              <TextField
                value={this.state.email}
                helperText={
                  this.state.email === "" ||
                  !this.state.email.match(
                    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/
                  )
                    ? this.state.helperText
                    : ""
                }
                name="email"
                disabled={this.state.clientSelected}
                label="Client Email"
                type="email"
                color="secondary"
                placeholder="Client Email"
                onChange={this.handleChange}
              />
              <TextField
                value={this.state.phone}
                helperText={
                  this.state.phone === "" ||
                  !this.state.phone.match(
                    /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s-]?[\0-9]{3}[\s-]?[0-9]{4}$/g
                  )
                    ? this.state.helperText
                    : ""
                }
                name="phone"
                disabled={this.state.clientSelected}
                label="Client Phone Number"
                type="text"
                color="secondary"
                placeholder="Client Phone Number"
                onChange={this.handleChange}
              />
            </div>
            <div className="login">
              <TextField
                value={this.state.address}
                helperText={
                  this.state.address === "" ? this.state.helperText : ""
                }
                name="address"
                label="Client Street Address"
                disabled={this.state.clientSelected}
                type="text"
                color="secondary"
                placeholder="Client Street Address"
                onChange={this.handleChange}
              />
              <TextField
                value={this.state.cityState}
                helperText={
                  this.state.cityState === "" ||
                  !this.state.cityState.match(
                    /([A-Za-z]+(?: [A-Za-z]+)*),? ([A-Za-z]{2})/
                  )
                    ? this.state.helperText
                    : ""
                }
                name="cityState"
                disabled={this.state.clientSelected}
                label="Client City, State"
                type="text"
                color="secondary"
                placeholder="Client City, State"
                onChange={this.handleChange}
              />
              <TextField
                value={this.state.zip}
                helperText={
                  this.state.zip === "" || !this.state.zip.match(/^\d{5}$/)
                    ? this.state.helperText
                    : ""
                }
                name="zip"
                label="Client Zip Code"
                disabled={this.state.clientSelected}
                type="text"
                maxLength="2"
                color="secondary"
                placeholder="Client Zip Code"
                onChange={this.handleChange}
              />
            </div>
            <div className="login">
              <TextField
                value={this.state.title}
                helperText={
                  this.state.title === "" ? this.state.helperText : ""
                }
                name="title"
                label="Title"
                type="text"
                color="secondary"
                placeholder="Title"
                onChange={this.handleChange}
              />
              <TextField
                value={this.state.expiration}
                helperText={
                  this.state.expiration === "" ||
                  !this.state.expiration.match(/\d{1,3}/)
                    ? this.state.helperText
                    : ""
                }
                name="expiration"
                type="number"
                label="Expires in x days"
                pattern="[0-9]"
                color="secondary"
                placeholder="Expires in x days"
                onChange={this.handleChange}
              />
            </div>
          </form>
          <Divider />
          <Divider />
          <Divider />
        </div>
        <Button
          color="secondary"
          className="add-item-btn"
          onClick={this.addItem}
        >
          Add Item
        </Button>
        {this.state.itemsField}
        <Button
          color="secondary"
          className="add-item-btn"
          onClick={this.checkForm}
          disabled={false}
        >
          Save Form
        </Button>
        <Button
          color="secondary"
          className="add-item-btn"
          onClick={this.submitInvoice}
          disabled={this.state.disabled}
        >
          Submit Estimate
        </Button>
      </div>
    );
  }
}
