/**
 * SEHTI - Google Sheets Webhook
 *
 * Setup:
 * 1. Open the Google Sheet.
 * 2. Extensions -> Apps Script.
 * 3. Paste this file.
 * 4. Deploy -> New deployment -> Web app.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone.
 * 7. Copy the web app URL into backend env:
 *    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */

const SHEET_NAME = "Orders";

const HEADERS = [
  "Order ID",
  "Order Number",
  "Created At",
  "Customer Name",
  "Phone Local",
  "Phone E164",
  "Products",
  "Normal Items Total MAD",
  "Upsell Product",
  "Upsell Total MAD",
  "Order Total MAD",
  "Currency",
  "Status",
  "Source",
  "Page URL",
  "Event ID",
  "Meta Sent",
  "TikTok Sent",
  "Notes",
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Missing POST body" }, 400);
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    ensureHeaders(sheet);

    const normalProducts = (data.products || []).filter(
      (item) => item.item_type !== "post_form_upsell"
    );
    const upsellProducts = (data.products || []).filter(
      (item) => item.item_type === "post_form_upsell"
    );

    const productText = normalProducts
      .map((item) => {
        return `${item.product_name_ar} - ${item.offer_qty} قطعة - ${item.price_mad} درهم`;
      })
      .join(" | ");

    const upsellText = upsellProducts
      .map((item) => `${item.product_name_ar} - ${item.price_mad} درهم`)
      .join(" | ");

    sheet.appendRow([
      data.order_id || "",
      data.order_number || "",
      data.created_at || new Date().toISOString(),
      data.customer_name || "",
      data.phone_local || "",
      data.phone_e164 || "",
      productText,
      data.normal_items_total_mad || 0,
      upsellText,
      data.upsell_total_mad || 0,
      data.order_total_mad || 0,
      data.currency || "MAD",
      data.status || "new",
      data.source || "sehti.online",
      data.page_url || "",
      data.event_id || "",
      data.meta_sent === true ? "yes" : "no",
      data.tiktok_sent === true ? "yes" : "no",
      data.notes || "",
    ]);

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) }, 500);
  }
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const range = sheet.getRange(1, 1, 1, HEADERS.length);
    range.setFontWeight("bold");
    range.setBackground("#123C2D");
    range.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
}

function jsonResponse(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function testWebhook() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        order_id: "test-order-id",
        order_number: 1001,
        created_at: new Date().toISOString(),
        customer_name: "محمد العلوي",
        phone_local: "0612345678",
        phone_e164: "+212612345678",
        products: [
          {
            product_id: "miswak-powder",
            product_name_ar: "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
            item_type: "normal",
            offer_qty: 2,
            price_mad: 279,
          },
          {
            product_id: "digestive-herbs",
            product_name_ar: "خليط الأعشاب الهاضمة ضد الانتفاخ",
            item_type: "post_form_upsell",
            offer_qty: 1,
            price_mad: 99,
          },
        ],
        normal_items_total_mad: 279,
        upsell_total_mad: 99,
        order_total_mad: 378,
        currency: "MAD",
        status: "new",
        source: "sehti.online",
        page_url: "https://sehti.online/products/miswak-natural-powder-sensitive-teeth",
        event_id: "test-event-id",
        meta_sent: true,
        tiktok_sent: true,
        notes: "Test row",
      }),
    },
  };

  doPost(fakeEvent);
}
