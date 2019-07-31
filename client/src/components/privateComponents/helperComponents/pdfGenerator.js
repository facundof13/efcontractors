import jsPDF from "jspdf";
import Axios from "axios";

export async function generatePDF(client, estimate) {
  console.log(estimate)
  var doc = new jsPDF();
  doc.setProperties({
    title: client.name,
    author: "EFContractors"
  });

  //get image and add it to pdf
  let res = await Axios.get("/admin/imgurl");
  var img = res.data[0].img;

  doc.text(estimate.invoice? "INVOICE" : "ESTIMATE", 80, 10);
  doc.addImage(img, "JPEG", 10, 5);


  return doc.output("datauristring");
  // doc.addImage(img, 'PNG', 15, 40, 100, 100)
}

export function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (Math.round(
      (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    ) *
      10000) /
    100
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
