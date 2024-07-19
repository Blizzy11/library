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

// REGION FOR WHATSAPP SEND API MESSAGE
export async function sendMessage(message: string, phone: string) {
  const data = new FormData();
  data.append("target", phone);
  data.append("message", message);
  data.append("url", "https://md.fonnte.com/images/wa-logo.png");
  // data.append("filename", "filename.pdf");
  data.append("schedule", "0");
  data.append("delay", "2");
  data.append("countryCode", "62");
  // data.append(
  //   "buttonJSON",
  //   '{"message":"fonnte button message","footer":"fonnte footer message","buttons":[{"id":"mybutton1","message":"hello fonnte"},{"id":"mybutton2","message":"fonnte pricing"},{"id":"mybutton3","message":"tutorial fonnte"}]}'
  // );
  // data.append(
  //   "templateJSON",
  //   '{"message":"fonnte template message","footer":"fonnte footer message","buttons":[{"message":"fonnte","url":"https://fonnte.com"},{"message":"call me","tel":"6282227097005"},{"id":"mybutton1","message":"hello fonnte"}]}'
  // );
  // data.append(
  //   "listJSON",
  //   '{"message":"fonnte list message","footer":"fonnte footer message","buttonTitle":"fonnte\'s packages","title":"fonnte title","buttons":[{"title":"text only","list":[{"message":"regular","footer":"10k messsages/month","id":"list-1"},{"message":"regular pro","footer":"25k messsages/month","id":"list-2"},{"message":"master","footer":"unlimited messsages/month","id":"list-3"}]},{"title":"all feature","list":[{"message":"super","footer":"10k messsages/month","id":"list-4"},{"message":"advanced","footer":"25k messsages/month","id":"list-5"},{"message":"ultra","footer":"unlimited messsages/month","id":"list-6"}]}]}'
  // );

  const response = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    mode: "cors",
    headers: new Headers({
      Authorization: "ca2Db#cLsjWkESNZXG+A",
    }),
    body: data,
  });

  const res = await response.json();
  return res;
}
export interface WhatsAppMessageProps {
  userName: string;
  collectionTitle: string;
  borrowedDate: string;
  dueDate: string;
  contactInfo: string;
  yourName: string;
  yourPosition: string;
  libraryName: string;
}

export function generateWhatsAppMessage({
  userName,
  collectionTitle,
  borrowedDate,
  dueDate,
  contactInfo,
  yourName,
  yourPosition,
  libraryName,
}: WhatsAppMessageProps) {
  return `Hello ${userName},

This is a friendly reminder to return the collection document "${collectionTitle}" that you borrowed from ${libraryName}. The details of your borrowed item are as follows:

* Borrowed Date: ${borrowedDate}
* Due Date: ${dueDate}

We kindly request that you return the item by the due date to avoid any late fees and to ensure that other members can access the collection as well.

If you have any questions or need to extend the borrowing period, please contact us at ${contactInfo}.

Thank you for your cooperation.

Best regards,
${yourName}
${yourPosition}
${libraryName}
${contactInfo}`;
}

interface AdminBorrowMessageProps {
  adminName: string;
  userName: string;
  collectionTitle: string;
  borrowDate: string;
  returnDate: string;
}

export function generateAdminApprovalMessage({
  adminName,
  userName,
  collectionTitle,
  borrowDate,
  returnDate,
}: AdminBorrowMessageProps) {
  return `
Hello ${adminName},

A new borrowing request has been submitted for your approval. Below are the details of the request:

Requester: ${userName}
Collection Title: ${collectionTitle}
Borrow Date: ${borrowDate}
Return Date: ${returnDate}

Please review the request and take the appropriate action:

If you have any questions regarding this request, please reach out to the requester or the library management team.

Thank you for your prompt attention to this matter.

Best regards,
`;
}

type AdminApprovalMessageProps = {
  adminName: string;
  userName: string;
  collectionTitle: string;
  borrowDate: string;
  returnDate: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
};

export function generateTransactionMessage({
  adminName,
  userName,
  collectionTitle,
  borrowDate,
  returnDate,
  status,
  rejectionReason,
}: AdminApprovalMessageProps) {
  if (status === "approved") {
    return `
Hello ${userName},

Your borrowing request has been approved by ${adminName}. Below are the details of your approved request:

Collection Title: ${collectionTitle}
Borrow Date: ${borrowDate}
Return Date: ${returnDate}

Please ensure that you return the collection by the return date to avoid any penalties.

If you have any questions regarding this request, please reach out to the library management team.

Thank you for using our library services.

Best regards,
Library Management Team
`;
  } else if (status === "rejected") {
    return `
Hello ${userName},

We regret to inform you that your borrowing request has been rejected by ${adminName}. Below are the details of your request:

Collection Title: ${collectionTitle}
Borrow Date: ${borrowDate}
Return Date: ${returnDate}

Reason for rejection: ${rejectionReason}

If you have any questions regarding this request or the reason for rejection, please reach out to the library management team.

Thank you for your understanding.

Best regards,
Library Management Team
`;
  }
  return "";
}
