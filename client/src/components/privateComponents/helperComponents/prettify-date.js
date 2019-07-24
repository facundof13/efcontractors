import { create } from "jss";

export default function prettifyDate(date) {
    let dateString = ''
    let newDate = new Date(date)

    dateString = (1 + newDate.getMonth()).toString().padStart(2, "0") +
      "/" +
      newDate
        .getDate()
        .toString()
        .padStart(2, "0") +
      "/" +
      newDate.getFullYear();


    // console.log(ret)
    return new Date(dateString).toLocaleDateString()
}

export function subtractDates(created, expiration) {
  let createdDate = new Date(created)
  let expirationDate = new Date(expiration)

  expirationDate -= createdDate
  return (Math.round(expirationDate/86400000))
}

export function addDates(created, expiredNum) {
  let createDate = new Date(created)
  createDate.setDate(createDate.getDate() + Number(expiredNum))
  return(createDate.toISOString())
}

export function compareDates(date1, date2) {
  console.log(date1, date2)
}