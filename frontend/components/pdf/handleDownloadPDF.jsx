import jsPDF from "jspdf";
import { barcodeBase64, qrCodeBase64, paidStamp } from "../../public/base64Image";
// Import jspdf-autotable correctly
import 'jspdf-autotable';
import { addFont } from "./pdfFonts";


function getDate(inputDate = null) {
  const date = inputDate ? new Date(inputDate) : new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString('default', { month: 'long' }); // Full month name
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function getTime(inputTime = null) {
  const time = inputTime ? new Date(inputTime) : new Date();
  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12; // The hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");
  return `${formattedHours}:${minutes} ${ampm}`;
}

// Helper function to format currency
function formatCurrency(amount) {
  if (!amount) return "0.00";
  return parseFloat(amount).toFixed(2);
}

const handleDownloadPDF = (payment) => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Try to add custom font if available
  try {
    addFont(doc);
    doc.setFont("Poppins");
  } catch (error) {
    console.log("Using default font");
  }

  // Set document properties
  doc.setProperties({
    title: "Payment Receipt",
    subject: "Payment Receipt for " + (payment.name || "Service"),
    author: "Try Ship",
    keywords: "payment, receipt, invoice",
    creator: "Try Ship Payment System"
  });

  // Define colors
  const primaryColor = [41, 103, 255]; // #2967FF in RGB
  const secondaryColor = [70, 70, 70]; // Dark gray
  const lightGray = [240, 240, 240]; // Light gray for backgrounds

  // Add a colored header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 35, "F");

  // Add company logo and name
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Try Ship", 20, 15);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Your Travel Companion", 20, 22);

  // Add document title
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 40, 180, 12, 3, 3, "FD");
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(16);
  doc.text("PAYMENT RECEIPT", 105, 48, null, null, "center");

  // Add receipt information
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT #", 15, 65);
  doc.text("DATE", 15, 72);
  doc.text("TIME", 15, 79);

  doc.setFont("helvetica", "normal");
  doc.text(payment.transactionId || "TRX-" + Date.now().toString().slice(-8), 50, 65);
  doc.text(getDate(payment.date), 50, 72);
  doc.text(getTime(payment.date), 50, 79);

  // Add QR code positioned lower
  doc.addImage(qrCodeBase64, "JPEG", 150, 60, 30, 30);
  doc.setFontSize(8);
  doc.text("Scan to verify", 165, 95, null, null, "center");

  // Add customer information section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15, 90, 180, 30, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Customer Information", 25, 100);
  
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(10);
  doc.text("Name:", 25, 108);
  doc.text("Service:", 25, 115);
  
  doc.setFont("helvetica", "normal");
  doc.text(payment.userName || "Guest User", 60, 108);
  doc.text(payment.name || "Travel Service", 60, 115);

  // Add payment details section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Payment Details", 105, 135, null, null, "center");

  // Create a custom payment details table since autoTable is having issues
  // Table header
  const tableStartY = 140;
  const colWidth1 = 90;
  const colWidth2 = 90;
  const rowHeight = 12;
  const tableX = 15;
  
  // Draw table header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(tableX, tableStartY, colWidth1, rowHeight, "F");
  doc.rect(tableX + colWidth1, tableStartY, colWidth2, rowHeight, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Description", tableX + (colWidth1/2), tableStartY + (rowHeight/2) + 2, null, null, "center");
  doc.text("Amount", tableX + colWidth1 + (colWidth2/2), tableStartY + (rowHeight/2) + 2, null, null, "center");
  
  // Draw table rows
  const items = [
    { description: payment.name || "Travel Service", amount: formatCurrency(payment.amount) + " BDT" }
  ];
  
  // Add additional fees if present
  if (payment.additionalFees) {
    items.push({ description: "Service Fee", amount: formatCurrency(payment.additionalFees) + " BDT" });
  }
  
  // Draw each row
  let currentY = tableStartY + rowHeight;
  items.forEach((item, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(tableX, currentY, colWidth1 + colWidth2, rowHeight, "F");
    }
    
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    // Add text with proper alignment
    doc.text(item.description, tableX + 5, currentY + (rowHeight/2) + 2, null, null, "left");
    doc.text(item.amount, tableX + colWidth1 + colWidth2 - 5, currentY + (rowHeight/2) + 2, null, null, "right");
    
    currentY += rowHeight;
  });
  
  // Add table border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  doc.rect(tableX, tableStartY, colWidth1 + colWidth2, currentY - tableStartY, "S");
  
  // Add total amount
  const finalY = currentY + 10;
  
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(120, finalY, 75, 15, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL: " + formatCurrency(payment.amount) + " BDT", 158, finalY + 10, null, null, "center");

  // Add paid stamp
  doc.addImage(paidStamp, "JPEG", 70, finalY + 20, 60, 40);

  // Add barcode with a title
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Transaction Reference", 105, finalY + 60, null, null, "center");
  doc.addImage(barcodeBase64, "JPEG", 55, finalY + 65, 100, 20);

  // Add footer with gradient background
  const pageHeight = doc.internal.pageSize.height;
  
  // Add subtle gradient footer background
  const footerY = pageHeight - 30;
  for (let i = 0; i < 10; i++) {
    const alpha = 0.05 - (i * 0.005);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], alpha);
    doc.rect(0, footerY + i*1, 210, 1, "F");
  }
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 25, 195, pageHeight - 25);
  
  // Add company logo/icon in footer
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.circle(25, pageHeight - 15, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TB", 25, pageHeight - 13, null, null, "center");
  
  // Footer text
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business with Try Ship!", 105, pageHeight - 20, null, null, "center");
  doc.text("For any inquiries, please contact support@Try Ship.com", 105, pageHeight - 15, null, null, "center");
  doc.text("© " + new Date().getFullYear() + " Try Ship. All rights reserved.", 105, pageHeight - 10, null, null, "center");

  // Add a watermark (very light)
  try {
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({opacity: 0.03}));
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("Try Ship", 105, 140, null, null, "center");
    doc.restoreGraphicsState();
  } catch (error) {
    // Fallback if GState is not supported
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.03);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("Try Ship", 105, 140, null, null, "center");
  }

  // Save the PDF
  doc.save("Try Ship-Receipt.pdf");
};

export default handleDownloadPDF;
