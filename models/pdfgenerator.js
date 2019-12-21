var settings = require("../models/settings");
var taxAmt = 0;
var company = "";
var cityState = "";
var address = "";
var zip = "";
var phone = "";
settings.getSettings().then(res => {
  phone = res[0].telephone;
});
settings.getInvoiceSettings().then(res => {
  taxAmt = Number(res[0].taxAmt);
  company = res[0].company;
  cityState = res[0].cityState;
  address = res[0].address;
  zip = res[0].zip;
});

function renderPdf(data, cb) {
  var fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
      bold: "fonts/Roboto-Bold.ttf",
      italics: "fonts/Roboto-Italic.ttf",
      bolditalics: "fonts/Roboto-BoldItalic.ttf"
    },
    RobotoMono: {
      normal: "fonts/RobotoMono-Regular.ttf",
      bold: "fonts/RobotoMono-Regular.ttf",
      italics: "fonts/RobotoMono-Regular.ttf",
      bolditalics: "fonts/RobotoMono-Regular.ttf"
    }
  };

  var PdfPrinter = require("pdfmake");
  var printer = new PdfPrinter(fonts);

  var estimateOrInvoice = data.estimate.paid
    ? "Receipt"
    : data.estimate.invoice
    ? "Invoice"
    : "Estimate";
  var items = [];
  var descriptions = [];
  var quantities = [];
  var amounts = [];
  var taxes = 0;
  let paymentSchedule = [];

  var currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  for (let j = 0; j < data.estimate.paymentSteps.length; j++) {
    console.log(data.estimate.paymentSteps[j].stepAmount);
    paymentSchedule.push(
      `${data.estimate.paymentSteps[j].stepName} ${
        data.estimate.paymentSteps[j].stepDescription
      } ${currencyFormatter.format(
        Number(data.estimate.paymentSteps[j].stepAmount.replace("$", ""))
      )}\n`
    );
  }

  // console.log(paymentSchedule);

  for (let i = 0; i < data.estimate.items.length; i++) {
    let num = data.estimate.items[i].amount;
    if (data.estimate.items[i].tax) {
      taxes += num.replace("$", "") / taxAmt;
    }
  }
  let grandTotal = taxes + data.estimate.total;
  //row height = 8

  const DESCRIPTION_DIVISOR = 45.3;
  for (let i = 0; i < data.estimate.items.length; i++) {
    let numDescriptionRows = Math.round(
      data.estimate.items[i].description.length / DESCRIPTION_DIVISOR
    );
    let numItemRows = Math.ceil(data.estimate.items[i].item.length / 18);

    let itemMargin = 0;
    let descriptionMargin = 0;
    let otherMargins = 0;
    // a row is 14 in height,
    const ROW = 14;

    if (numItemRows === numDescriptionRows) {
      if (numItemRows > 1) {
        otherMargins = numItemRows * ROW;
      }
    } else if (numDescriptionRows > numItemRows) {
      descriptionMargin = 0;
      itemMargin = numDescriptionRows * ROW - numItemRows * ROW;
      otherMargins = numDescriptionRows * ROW - ROW;
    } else if (numItemRows > numDescriptionRows) {
      itemMargin = 0;
      descriptionMargin = numItemRows * ROW - numDescriptionRows * ROW;
      otherMargins = numItemRows * ROW - ROW;
    }

    console.log(
      `${i}: ${data.estimate.items[i].description.length / DESCRIPTION_DIVISOR}`
    );

    itemMargin += ROW;
    otherMargins += ROW;
    descriptionMargin += ROW;

    items.push({
      text: data.estimate.items[i].item,
      alignment: "center",
      fontSize: 12,
      height: "auto",
      margin: [0, 0, 0, itemMargin]
    });
    descriptions.push({
      text: data.estimate.items[i].description,
      alignment: "left",
      fontSize: 12,
      // font: "RobotoMono",
      margin: [0, 0, 0, descriptionMargin]
    });
    quantities.push({
      text: data.estimate.items[i].quantity,
      alignment: "center",
      fontSize: 12,
      height: "auto",
      margin: [0, 0, 0, otherMargins]
    });
    amounts.push({
      text: currencyFormatter.format(
        data.estimate.items[i].amount.replace(/\$/g, "").replace(/\.00+/, "")
      ),
      alignment: "right",
      fontSize: 12,
      height: "auto",
      margin: [0, 0, 0, otherMargins]
    });
  }

  var docDefinition = {
    // ...
    info: {
      title: `Estimate for ${data.client.name}`
    },
    content: [
      {
        text: estimateOrInvoice,
        fontSize: 30,
        bold: true,
        alignment: "center",
        color: "grey"
      },
      {
        image: data.imgUrl,
        width: 100,
        margin: [-20, -50]
      },
      {
        table: {
          widths: ["*", 60],
          body: [
            ["Date", "Estimate #"],
            [prettifyDate(data.estimate.date), data.estimate.estimateNum]
          ]
        },
        alignment: "center",
        margin: [400, 0],
        width: 200,
        color: "grey"
      },
      {
        columns: [
          {
            text: [`\n\n${address}\n`, `${cityState}\n`, `${zip}`],
            color: "grey",
            alignment: "left"
          },
          {
            text: "\n\n" + data.estimate.title,
            color: "grey",
            alignment: "center"
          },
          {
            text: [
              `\n\n${data.client.name}\n${data.client.address}\n${data.client.cityState}\n${data.client.zip}`
            ],
            color: "grey",
            alignment: "right"
          }
        ]
      },
      {
        text: data.estimate.paid ? "PAID" : "",
        alignment: "center"
      },
      {
        table: {
          widths: [100],
          body: [
            [{ text: "Expiration Date", bold: true }],
            [prettifyDate(data.estimate.expiration)]
          ]
        },
        color: "grey",
        alignment: "center",
        margin: [405, 20]
      },
      {
        table: {
          widths: [100, 320, 20, "auto"],
          fontSize: 10,
          headerRows: 1,
          body: [
            [
              {
                text: "Item",
                alignment: "center",
                fontSize: 10,
                bold: true
              },
              {
                text: "Description",
                alignment: "center",
                fontSize: 10,
                bold: true
              },
              {
                text: "Qty.",
                alignment: "center",
                fontSize: 10,
                bold: true
              },
              {
                text: "Amount",
                alignment: "center",
                fontSize: 10,
                bold: true
              }
            ],
            [[items], [descriptions], [quantities], [amounts]]
          ]
        }
      },
      {
        table: {
          widths: [60, 60],
          body: [
            [
              { text: "Subtotal", fontSize: 12 },
              {
                text: currencyFormatter.format(data.estimate.total),
                fontSize: 12
              }
            ],
            [
              { text: "Taxes", fontSize: 12 },
              {
                text: currencyFormatter.format(taxes),
                fontSize: 12
              }
            ],
            [
              { text: "Total", fontSize: 12 },
              {
                text: currencyFormatter.format(grandTotal),
                fontSize: 12
              }
            ]
          ]
        },
        margin: [374, 10]
      }
    ]
  };

  if (data.estimate.attachContract && !data.estimate.paid) {
    docDefinition.content.push(
      {
        text: company,
        bold: true,
        alignment: "center",
        fontSize: "24",
        pageBreak: "before"
      },
      {
        text: phone,
        alignment: "center",
        fontSize: 10
      },
      {
        text: "\n\nCONTRACT AGREEMENT",
        fontSize: 14,
        alignment: "center",
        bold: true
      },
      {
        text: ["\nDate ", prettifyDate(data.estimate.date)]
      },
      {
        text: [
          `\n${data.client.name}`,
          `\n${data.client.email}`,
          `\n${data.client.address}`,
          `\n${data.client.cityState}`,
          `\n${data.client.zip}`
        ]
      },
      {
        text: ["\nJOB TITLE: ", data.estimate.title]
      },
      {
        text: "\nArticle One: Contract Document"
      },
      {
        text: `\nThese documents constitute an agreement between ${company} hereinafter referred to as the "Contractor" and ${data.client.name} hereinafter referred to as the "Owner", to renovate the project located at ${data.client.address}, ${data.client.cityState} ${data.client.zip}`,
        margin: [40, 0],
        alignment: "left"
      },
      {
        text:
          "\nThe contract documents consists of this agreement, general conditions, construction documents, specifications, allowances, finish schedule, construction draw schedule, addenda issued prior to by both parties.",
        margin: [40, 0],
        alignment: "left"
      },
      {
        text:
          "\nThe Contractor shall provide all documents noted herein to the Owner. These contract documents represent the entire agreement of both parties and supersede any prior oral or written agreement."
      },
      {
        text: "\n\nArticle Two: Duties of the Contractor"
      },
      {
        text: [
          "\nAll work shall be in concordance to the provisions of the plans and specification. All systems shall be in good working order.",
          "\n\nAll work completed in a competent manner, and shall comply with all applicable national, state, and local building codes and laws.",
          "\n\nAll individuals will perform their said work as outlined by law.",
          "\n\nContractor shall remove all construction debris and leave the project in a broom clean conditions."
        ],
        alignment: "left",
        margin: [40, 0]
      },
      {
        text: "\n\nArticle Three: Owner"
      },
      {
        text: [
          "\nThe Owner shall communicate with subcontractors only through the Contractor.",
          "\n\nThe Owner will not assume any liability or responsibility, nor control over or change of construction means, methods, techniques, sequences, procedures, or for safety precautions and programs in connection with the project since these are solely the Contractor's responsibility."
        ],
        alignment: "left",
        margin: [40, 0]
      },
      {
        text: "\n\nArticle Four: Change Order and Finish Schedules"
      },
      {
        text: [
          "\nA Change Order is any change to the original contracted plans and/or specifications.",
          "\n\nAll change orders are to be administered through direct contact between the Owner and the Contractor.",
          "\n\nAny additional time needed to complete change order is into consideration in the project completion date."
        ],
        alignment: "left",
        margin: [40, 0]
      },
      {
        text: [
          "\nAny Change Order is subject to a fee of $175.",
          "\n\nDelayed deliveries and back orders from the Owner will be considered as a Change Order."
        ],
        alignment: "left",
        margin: [40, 0],
        bold: true
      },
      {
        text: [
          "\n\nAny delays or changes in finish selection schedules may delay the projected completion date. Contractor's Initials ____",
          "\n\nOwner understands any Change Order will be a fee of $175.\nOwner's Initials ____"
        ]
      },
      {
        text: "\n\nArticle Five: Building & Specifications"
      },
      {
        text: "\n" + data.estimate.contractSpecs,
        alignment: "left",
        margin: [40, 0]
      },
      {
        text: "\n\nArticle Six: Progress Payments"
      },
      {
        text: [
          "\n\nThe owner will make payments to the contractor pursuant to the construction draw schedule as each phase of the construction schedule is satisfactorily complete",
          "\n\nDraw payments are made payable to EF Contractors LLC"
        ],
        alignment: "left",
        margin: [40, 0]
      },
      {
        text: paymentSchedule.length > 0 ? "\nPayment schedule\n\n" : "",
        alignment: "center"
      },
      {
        text: paymentSchedule.reverse(),
        alignment: "center"
      },
      {
        text: "\n\nArticle Seven: Warranty",
        alignment: "left"
      },
      {
        text:
          "\n\nAt the completion of the project, contractor shall execute an instrument to owner warranting the project for one year against defects in workmanship or materials utilized.",
        alignment: "left",
        margin: [40, 0]
      },
      {
        pageBreak: "before",
        text: [
          "\n\n\n",
          "________________________________________",
          " \n",
          "Ernesto Figueroa",
          "\n\n",
          "________________________________________",
          "\n",
          "Date",
          "\n\n",
          "\n\n\n\n\n",
          "________________________________________",
          " \n",
          data.client.name,
          "\n\n",
          "________________________________________",
          "\n",
          "Date",
          "\n\n"
        ]
      }
    );
  }

  var options = {
    // ...
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  let chunks = [];

  pdfDoc.on("data", chunk => {
    chunks.push(chunk);
  });

  pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks);
    cb("data:application/pdf;base64," + result.toString("base64"));
  });

  pdfDoc.end();
}

function prettifyDate(date) {
  let dateString = "";
  let newDate = new Date(date);

  dateString =
    (1 + newDate.getMonth()).toString().padStart(2, "0") +
    "/" +
    newDate
      .getDate()
      .toString()
      .padStart(2, "0") +
    "/" +
    newDate.getFullYear();

  return new Date(dateString).toLocaleDateString();
}

module.exports = {
  renderPdf
};
