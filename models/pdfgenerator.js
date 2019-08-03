function renderPdf(data, cb) {
  console.log(data);
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

  var estimateOrInvoice = data.estimate.invoice ? "Invoice" : "Estimate";
  var items = [];
  var descriptions = [];
  var quantities = [];
  var amounts = [];
  var taxes = 0

  for (let i = 0; i < data.estimate.items.length; i++) {
    if (data.estimate.items[i].tax) {
      taxes += (Number(data.estimate.items[i].amount.replace('$', '')) / 6.5)
    }
  }

  //row height = 8

  for (let i = 0; i < data.estimate.items.length; i++) {
    let numRows = Math.ceil(data.estimate.items[i].description.length / 49) - 1;
    console.log(numRows);
    let margin = 0;
    if (numRows > 0) {
      margin = numRows * 13;
    }
    items.push({
      text: data.estimate.items[i].item,
      alignment: "center",
      fontSize: 10,
      height: "auto",
      margin: [0, 0, 0, margin],
      font: "RobotoMono"
    });
    descriptions.push({
      text: data.estimate.items[i].description,
      alignment: "center",
      fontSize: 10,
      font: "RobotoMono"
    });
    quantities.push({
      text: data.estimate.items[i].quantity,
      alignment: "center",
      fontSize: 10,
      height: "auto",
      margin: [0, 0, 0, margin],
      font: "RobotoMono"
    });
    amounts.push({
      text: data.estimate.items[i].amount,
      alignment: "center",
      fontSize: 10,
      height: "auto",
      margin: [0, 0, 0, margin],
      font: "RobotoMono"
    });

    // descriptions.push(data.estimate.items[i].description);
    // quantities.push(data.estimate.items[i].quantity);
    // amounts.push(data.estimate.items[i].amount);
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
            text: ["\n\nPO Box 3104\n", "Lilburn, GA\n", "30048"],
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
              `\n\n${data.client.name}\n${data.client.address}\n${
                data.client.cityState
              }\n${data.client.zip}`
            ],
            color: "grey",
            alignment: "right"
          }
        ]
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
          widths: [100, 300, "*", "auto"],
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
                text: "Quantity",
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

            // [items],
            // [descriptions],
            // [amounts],
            // [quantities],
          ]
        }
      },
      {
        table: {
          body: [
            [{text: 'Subtotal', fontSize:8}, {text: data.estimate.total, fontSize:8}],
            [{text: 'Taxes', fontSize:8}, {text: taxes.toLocaleString({maximumFractionDigits: 2}), fontSize:8}]
          ]
        }
      }
    ]
  };

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

  // console.log(ret)
  return new Date(dateString).toLocaleDateString();
}

module.exports = {
  renderPdf
};
