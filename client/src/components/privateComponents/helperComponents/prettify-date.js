export default function prettifyDate(date) {
    let dateString = ''
    var newDate = new Date(date)

    dateString = (1 + newDate.getMonth()).toString().padStart(2, "0") +
      "/" +
      newDate
        .getDate()
        .toString()
        .padStart(2, "0") +
      "/" +
      newDate.getFullYear();


    // console.log(ret)
    return dateString
}