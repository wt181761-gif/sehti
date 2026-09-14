/**
 * AAFIYATI — Google Sheets Webhook Script
 * 
 * SETUP:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire script
 * 4. Save (Ctrl+S)
 * 5. Click Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL
 * 7. Paste it in .env.local as NEXT_PUBLIC_WEBHOOK_URL
 */

const SHEET_NAME = "Orders"; // Change if your sheet tab has a different name

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "التاريخ",
        "الاسم",
        "الهاتف",
        "المنتجات",
        "المجموع (درهم)",
        "الحالة",
        "ملاحظات",
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#1B4332").setFontColor("white");
    }

    // Format products list
    const productsList = data.products
      .map(p => `${p.name} × ${p.quantity} (${p.price * p.quantity} درهم)`)
      .join(" | ");

    // Append order row
    sheet.appendRow([
      new Date(data.timestamp).toLocaleString("ar-MA", { timeZone: "Africa/Casablanca" }),
      data.customer_name,
      data.phone,
      productsList,
      data.total,
      "جديد — ينتظر التأكيد",
      "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this manually to check connection
function testConnection() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log("Connected to sheet: " + sheet.getName());
  Logger.log("Current rows: " + sheet.getLastRow());
}
