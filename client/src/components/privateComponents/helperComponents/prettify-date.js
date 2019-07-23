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

export function subtractDates(created, expiration) {
  let createdDate = new Date(created)
  let expirationDate = new Date(expiration)

  expirationDate -= createdDate
  return (Math.round(expirationDate/86400000))
}