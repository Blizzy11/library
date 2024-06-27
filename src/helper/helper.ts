import { string } from "yup";

export default function pagination(totalData: number, totalPage: number) {
  return {
    totalData,
    totalPage,
  };
}

export function thousandSeparator(number: number) {
  let formattedNumber: string;
  if (number >= 1000) {
    formattedNumber = `${Math.floor(number / 1000)}k+`;
  } else {
    formattedNumber = `${number}x`;
  }

  return formattedNumber;
}

// Utility function to truncate description
export function truncateDescription(description: string, wordLimit: number) {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + " ....";
  }
  return description;
}
