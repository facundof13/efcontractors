var settings = require("../models/settings");
var taxAmt = 0;
var company = "";
var cityState = "";
var address = "";
var zip = "";
var phone = "";
settings.getSettings().then((res) => {
  phone = res[0].telephone;
});
settings.getInvoiceSettings().then((res) => {
  taxAmt = Number(res[0].taxAmt);
  company = res[0].company;
  cityState = res[0].cityState;
  address = res[0].address;
  zip = res[0].zip;
});

function renderPdf(data, cb) {
  try {
    var fonts = {
      Roboto: {
        normal: "fonts/Roboto-Regular.ttf",
        bold: "fonts/Roboto-Bold.ttf",
        italics: "fonts/Roboto-Italic.ttf",
        bolditalics: "fonts/Roboto-BoldItalic.ttf",
      },
      RobotoMono: {
        normal: "fonts/RobotoMono-Regular.ttf",
        bold: "fonts/RobotoMono-Regular.ttf",
        italics: "fonts/RobotoMono-Regular.ttf",
        bolditalics: "fonts/RobotoMono-Regular.ttf",
      },
      "AlexBrush-Regular": {
        normal: "fonts/AlexBrush-Regular.ttf",
      },
    };

    var PdfPrinter = require("pdfmake");
    var printer = new PdfPrinter(fonts);

    var estimateOrInvoice = data.estimate.paid
      ? "Receipt"
      : data.estimate.invoice
      ? "Invoice"
      : "Estimate";

    var taxes = 0;
    let paymentSchedule = [];

    var currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    data.estimate.paymentSteps.forEach((i) => {
      paymentSchedule.unshift(
        `${i.stepName} ${i.stepDescription} ${currencyFormatter.format(
          Number(i.stepAmount.replace("$", ""))
        )}\n`
      );
    });

    let item = [];
    data.estimate.items.forEach((i) => {
      let num = i.amount;
      if (i.tax) {
        taxes += num.replace("$", "") / taxAmt;
      }
      item.push({
        table: {
          widths: [100, 315, 20, 41],
          fontSize: 10,
          body: [
            [
              {
                border: [true, false, true, true],
                text: i.item,
                alignment: "center",
                fontSize: 12,
              },
              {
                border: [true, false, true, true],
                text: i.description,
                alignment: "center",
                fontSize: 12,
              },
              {
                border: [true, false, true, true],
                text: i.quantity,
                alignment: "center",
                fontSize: 12,
              },
              {
                border: [true, false, true, true],
                text: i.amount,
                alignment: "center",
                fontSize: 12,
              },
            ],
          ],
        },
      });
    });

    let grandTotal = taxes + data.estimate.total;

    var docDefinition = {
      pageOrientation: "portrait",
      pageSize: "LETTER",
      info: {
        title: `Estimate for ${data.client.name}`,
      },
      content: [
        {
          text: estimateOrInvoice,
          fontSize: 30,
          bold: true,
          alignment: "center",
          color: "grey",
        },
        {
          image: data.imgUrl,
          width: 100,
          margin: [-20, -50],
        },
        {
          table: {
            widths: ["*", 60],
            body: [
              ["Date", "Estimate #"],
              [prettifyDate(data.estimate.date), data.estimate.estimateNum],
            ],
          },
          alignment: "center",
          margin: [400, 0],
          width: 200,
          color: "grey",
        },
        {
          columns: [
            {
              text: [`\n\n${address}\n`, `${cityState}\n`, `${zip}`],
              color: "grey",
              alignment: "left",
            },
            {
              text: "\n\n" + data.estimate.title,
              color: "grey",
              alignment: "center",
            },
            {
              text: [
                `\n\n${data.client.name}\n${data.client.address}\n${data.client.cityState}\n${data.client.zip}`,
              ],
              color: "grey",
              alignment: "right",
            },
          ],
        },
        {
          text: data.estimate.paid ? "PAID" : "",
          alignment: "center",
        },
        {
          table: {
            widths: [100],
            body: [
              [{ text: "Expiration Date", bold: true }],
              [prettifyDate(data.estimate.expiration)],
            ],
          },
          color: "grey",
          alignment: "center",
          margin: [405, 20],
        },
        {
          table: {
            widths: [100, 315, 20, 41],
            fontSize: 10,
            headerRows: 1,
            body: [
              [
                {
                  text: "Item",
                  alignment: "center",
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: "Description",
                  alignment: "center",
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: "Qty.",
                  alignment: "center",
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: "Amount",
                  alignment: "center",
                  fontSize: 10,
                  bold: true,
                },
              ],
              // [["test"]]
              // [[items], [descriptions], [quantities], [amounts]]
            ],
          },
        },
        item,
        {
          columns: [
            {
              width: "*",
              text: "",
            },
            {
              width: "auto",
              table: {
                widths: [100, 60],
                body: [
                  [
                    { text: "Subtotal", fontSize: 12 },
                    {
                      text: currencyFormatter.format(data.estimate.total),
                      fontSize: 12,
                    },
                  ],
                  [
                    { text: "Taxes", fontSize: 12 },
                    {
                      text: currencyFormatter.format(taxes),
                      fontSize: 12,
                    },
                  ],
                  [
                    { text: "Total", fontSize: 12 },
                    {
                      text: currencyFormatter.format(grandTotal),
                      fontSize: 12,
                    },
                  ],
                ],
              },
            },
          ],
          margin: [0, 10],
        },
      ],
    };

    if (data.estimate.attachContract && !data.estimate.paid) {
      docDefinition.content.push(
        {
          text: company,
          bold: true,
          alignment: "center",
          fontSize: "24",
          pageBreak: "before",
        },
        {
          text: phone,
          alignment: "center",
          fontSize: 10,
        },
        {
          text: "\n\nCONTRACT AGREEMENT",
          fontSize: 14,
          alignment: "center",
          bold: true,
        },
        {
          text: ["\nDate ", prettifyDate(data.estimate.date)],
        },
        {
          text: [
            `\n${data.client.name}`,
            `\n${data.client.email}`,
            `\n${data.client.address}`,
            `\n${data.client.cityState}`,
            `\n${data.client.zip}`,
          ],
        },
        {
          text: ["\nJOB TITLE: ", data.estimate.title],
        },
        {
          text: "\nArticle One: Contract Document",
        },
        {
          text: `\nThese documents constitute an agreement between ${company} hereinafter referred to as the "Contractor" and ${data.client.name} hereinafter referred to as the "Owner", to renovate the project located at ${data.client.address}, ${data.client.cityState} ${data.client.zip}`,
          margin: [40, 0],
          alignment: "left",
        },
        {
          text: "\nThe contract documents consists of this agreement, general conditions, construction documents, specifications, allowances, finish schedule, construction draw schedule, addenda issued prior to by both parties.",
          margin: [40, 0],
          alignment: "left",
        },
        {
          text: "\nThe Contractor shall provide all documents noted herein to the Owner. These contract documents represent the entire agreement of both parties and supersede any prior oral or written agreement.",
        },
        {
          text: "\n\nArticle Two: Duties of the Contractor",
        },
        {
          text: [
            "\nAll work shall be in concordance to the provisions of the plans and specification. All systems shall be in good working order.",
            "\n\nAll work completed in a competent manner, and shall comply with all applicable national, state, and local building codes and laws.",
            "\n\nAll individuals will perform their said work as outlined by law.",
            "\n\nContractor shall remove all construction debris and leave the project in a broom clean conditions.",
          ],
          alignment: "left",
          margin: [40, 0],
        },
        {
          text: "\n\nArticle Three: Owner",
        },
        {
          text: [
            "\nThe Owner shall communicate with subcontractors only through the Contractor.",
            "\n\nThe Owner will not assume any liability or responsibility, nor control over or change of construction means, methods, techniques, sequences, procedures, or for safety precautions and programs in connection with the project since these are solely the Contractor's responsibility.",
          ],
          alignment: "left",
          margin: [40, 0],
        },
        {
          text: "\n\nArticle Four: Change Order and Finish Schedules",
        },
        {
          text: [
            "\nA Change Order is any change to the original contracted plans and/or specifications.",
            "\n\nAll change orders are to be administered through direct contact between the Owner and the Contractor.",
            "\n\nAny additional time needed to complete change order is into consideration in the project completion date.",
          ],
          alignment: "left",
          margin: [40, 0],
        },
        {
          text: [
            "\nAny Change Order is subject to a fee of $175.",
            "\n\nDelayed deliveries and back orders from the Owner will be considered as a Change Order.",
          ],
          alignment: "left",
          margin: [40, 0],
          bold: true,
        },
        {
          text: [
            "\n\nAny delays or changes in finish selection schedules may delay the projected completion date. Contractor's Initials ",
            {
              text: "  EF  \n",
              decoration: "underline",
              font: "AlexBrush-Regular",
            },
            "\n\nOwner understands any Change Order will be a fee of $175.\nOwner's Initials ____",
          ],
        },
        {
          text: "\n\nArticle Five: Building & Specifications",
        },
        {
          text: "\n" + data.estimate.contractSpecs,
          alignment: "left",
          margin: [40, 0],
        },
        {
          text: "\n\nArticle Six: Progress Payments",
        },
        {
          text: [
            "\n\nThe owner will make payments to the contractor pursuant to the construction draw schedule as each phase of the construction schedule is satisfactorily complete",
            "\n\nDraw payments are made payable to EF Contractors LLC",
          ],
          alignment: "left",
          margin: [40, 0],
        },
        {
          text: paymentSchedule.length > 0 ? "\nPayment schedule\n\n" : "",
          alignment: "center",
          bold: true,
        },
        {
          text: paymentSchedule.reverse(),
          alignment: "center",
        },
        {
          text: "\n\nArticle Seven: Warranty",
          alignment: "left",
        },
        {
          text: "\n\nAt the completion of the project, contractor shall execute an instrument to owner warranting the project for one year against defects in workmanship or materials utilized.",
          alignment: "left",
          margin: [40, 0],
        },
        {
          pageBreak: "before",
          text: [
            "\n\n\n",
            {
              text: "Ernesto Figueroa                                     ",
              fontSize: 16,
              decoration: "underline",
              font: "AlexBrush-Regular",
            },
            " \n",
            "Ernesto Figueroa",
            "\n\n",
            {
              text: `${prettifyDate(
                new Date().toString()
              )}                                                     `,
              decoration: "underline",
            },
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
            "\n\n",
          ],
        }
      );
    }

    var options = {
      // ...
    };

    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    let chunks = [];

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      cb("data:application/pdf;base64," + result.toString("base64"));
    });

    pdfDoc.end();
  } catch (err) {
    console.log(err);
  }
}

function prettifyDate(date) {
  let dateString = "";
  let newDate = new Date(date);

  dateString =
    (1 + newDate.getMonth()).toString().padStart(2, "0") +
    "/" +
    newDate.getDate().toString().padStart(2, "0") +
    "/" +
    newDate.getFullYear();

  return new Date(dateString).toLocaleDateString();
}

module.exports = {
  renderPdf,
};
