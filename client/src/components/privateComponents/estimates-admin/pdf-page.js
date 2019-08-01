import React from "react";
import Axios from "axios";
import prettifyDate from "../helperComponents/prettify-date";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Canvas
} from "@react-pdf/renderer";
import { callbackify } from "util";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white"
  },
  section: {
    margin: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  top_right_item: {
    width: 70,
    border: 1
  },
  inside_first_row_box_item: {
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  inside_second_row_box_item: {
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  main_box_headers: {
    backgroundColor: "grey",
    borderBottom: 1,
    height: 15,
    borderLeft: 1
  }
});

export default class PdfPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: this.props.estimate.items.length * 50 + 16
    };

    this.render = this.render.bind(this);
  }

  render() {
    console.log(this.state);
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Image
              src={this.props.imgUrl}
              style={{ width: "100px", marginTop: 15 }}
            />
            <Text style={{ marginLeft: 20, color: "grey" }}>
              {this.props.estimate.invoice ? "INVOICE" : "ESTIMATE"}
            </Text>
            <View
              style={{ flexDirection: "column", fontSize: 10, marginTop: 20 }}
            >
              <View style={{ flexDirection: "row", backgroundColor: "grey" }}>
                <View style={[styles.top_right_item, { marginBottom: -1 }]}>
                  <Text style={styles.inside_first_row_box_item}>Date</Text>
                </View>
                <View
                  style={[
                    styles.top_right_item,
                    { marginBottom: -1, marginLeft: -1 }
                  ]}
                >
                  <Text style={styles.inside_first_row_box_item}>
                    Estimate #
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={[styles.top_right_item, {}]}>
                  <Text style={styles.inside_second_row_box_item}>
                    {prettifyDate(this.props.estimate.date)}
                  </Text>
                </View>

                <View style={[styles.top_right_item, { marginLeft: -1 }]}>
                  <Text style={styles.inside_second_row_box_item}>
                    {this.props.estimate.estimateNum}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Second Row */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ marginLeft: 20, fontSize: 10, color: "grey" }}>
              <Text>PO Box 3104</Text>
              <Text>Lilburn, GA</Text>
              <Text>30048</Text>
            </View>
            <View style={{ fontSize: 10, color: "grey" }}>
              <Text style={{ marginTop: -25 }}>
                {this.props.estimate.title}
              </Text>
              <Text style={{ marginTop: 15 }}>{this.props.client.name}</Text>
              <Text>{this.props.client.address}</Text>
              <Text>{this.props.client.cityState}</Text>
              <Text style={{ marginRight: 130 }}>{this.props.client.zip}</Text>
            </View>
          </View>
          {/* Third Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              fontSize: 10,
              marginRight: 20,
              marginTop: 20
            }}
          >
            <View style={{ justifyContent: "column", width: 90 }}>
              <View style={{ border: 1 }}>
                <Text
                  style={{
                    textAlign: "center",
                    backgroundColor: "grey"
                  }}
                >
                  Expiration Date
                </Text>
              </View>
              <View
                style={{
                  borderTop: -1,
                  borderRight: 1,
                  borderLeft: 1,
                  borderBottom: 1
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  {prettifyDate(this.props.estimate.expiration)}
                </Text>
              </View>
            </View>
          </View>
          {/* Item Description Quantiy Total Box */}
          <View
            style={{
              marginRight: 20,
              marginLeft: 20,
              marginTop: 5,
              border: 1,
              width: 555,
              height: 550,
              flexDirection: "column",
              fontSize: 10
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.main_box_headers,
                  { paddingLeft: 58, width: 136, borderLeft: -1 }
                ]}
              >
                <Text>Item</Text>
              </View>
              <View
                style={[
                  styles.main_box_headers,
                  { paddingLeft: 123, width: 277 }
                ]}
              >
                <Text>Description</Text>
              </View>
              <View
                style={[
                  styles.main_box_headers,
                  { paddingLeft: 15, width: 70 }
                ]}
              >
                <Text>Quantity</Text>
              </View>
              <View
                style={[
                  styles.main_box_headers,
                  { paddingLeft: 15, width: 70 }
                ]}
              >
                <Text>Line Total</Text>
              </View>
            </View>

            {/* Second Row in Main Box */}
            <View style={{ flexDirection: "column", height: 20 }}>
              {this.props.estimate.items.map(item => (
                <View
                  key={item.num}
                  style={{ flexDirection: "row", height: 50 }}
                >
                  {/* {this.setState(prevState => ({height: prevState.height+20}))} */}
                  <View style={{ width: 136, textAlign: "left" }}>
                    <Text>{item.item}</Text>
                  </View>
                  <View
                    style={{ width: 277, borderLeft: 1, textAlign: "justify" }}
                  >
                    <Text>{item.description}</Text>
                  </View>
                  <View
                    style={{ width: 70, borderLeft: 1, textAlign: "center" }}
                  >
                    <Text>{item.quantity}</Text>
                  </View>
                  <View
                    style={{
                      width: 70,
                      borderLeft: 1,
                      textAlign: "right",
                      marginRight: 5
                    }}
                  >
                    <Text>
                      {item.amount
                        .replace("$", "")
                        .replace(".00", "")
                        .concat(".00")}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 137,
                    height: 550 - this.state.height,
                    borderRight: 1
                  }}
                />
                <View
                  style={{
                    width: 277,
                    height: 550 - this.state.height,
                    borderRight: 1
                  }}
                />
                <View
                  style={{
                    width: 70,
                    height: 550 - this.state.height,
                    borderRight: 1
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: 120,
              marginTop: 10
            }}
          >
            {/* <View style={{ width: 500 }} /> */}
            <View
              style={{
                fontSize: 8,
                border: 1,
                width: 150
              }}
            >
              <View style={{ flexDirection: "row", justifyContent:'space-between' }}>
                <Text>Subtotal:</Text>
                <Text>1000</Text>
              </View>
              <Text >Taxes:</Text>
              <View style={{flexDirection: 'row',justifyContent:'space-between', borderTop: 1}}>
                <Text style={{fontSize:10}}>Total:</Text>
                <Text style={{fontSize:10}}>{this.props.estimate.total}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
  }
}
