import React from "react";
import Axios from "axios";

export default class PdfPage extends React.Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
  }

  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <img src={this.props.imgUrl} />
      </div>
    );
  }
}
