// ===== ข้อมูลผู้ส่ง (ค่าสำรองกลาง กรณีผู้ใช้ยังไม่เคยเซฟค่าเริ่มต้นไว้ในเครื่อง) =====
const DEFAULT_SENDER_INFO = {
  name: "",
  phone: "",
  addressLines: [
    "",
    ""
  ]
};

// โหลดข้อมูลผู้ส่งจาก localStorage (ถ้ามี) หรือใช้ค่ากลาง
let SENDER_INFO = loadSenderFromStorage();

function loadSenderFromStorage() {
  const saved = localStorage.getItem("shipping_sender_info");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved sender info", e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_SENDER_INFO));
}

function buildSenderHTML() {
  const addr = SENDER_INFO.addressLines.join("<br>");
  return `ผู้ส่ง : ${SENDER_INFO.name} ${SENDER_INFO.phone}<br>${addr}`;
}

// นำค่าปัจจุบันใส่ลงในช่อง Input ตอนเปิดหน้าเว็บ
window.addEventListener("DOMContentLoaded", () => {
  setSenderInputs(SENDER_INFO);
});

function setSenderInputs(info) {
  const nameEl = document.getElementById("senderNameInput");
  const phoneEl = document.getElementById("senderPhoneInput");
  const addr1El = document.getElementById("senderAddr1Input");
  const addr2El = document.getElementById("senderAddr2Input");

  if (nameEl) nameEl.value = info.name || "";
  if (phoneEl) phoneEl.value = info.phone || "";
  if (addr1El) addr1El.value = info.addressLines[0] || "";
  if (addr2El) addr2El.value = info.addressLines[1] || "";
}

// อัปเดตข้อมูลแบบ Real-time ทันทีที่พิมพ์
function updateSenderInfoLive() {
  SENDER_INFO.name = document.getElementById("senderNameInput").value.trim();
  SENDER_INFO.phone = document.getElementById("senderPhoneInput").value.trim();
  SENDER_INFO.addressLines = [
    document.getElementById("senderAddr1Input").value.trim(),
    document.getElementById("senderAddr2Input").value.trim()
  ].filter(l => l);

  if (typeof renderAllPages === "function") {
    renderAllPages();
  }
}

// กดปุ่มบันทึกเป็นค่าเริ่มต้น (จำไว้ใช้ตลอดไปในเครื่องนี้)
function saveDefaultSender() {
  updateSenderInfoLive();
  localStorage.setItem("shipping_sender_info", JSON.stringify(SENDER_INFO));
  alert("✅ บันทึกข้อมูลผู้ส่งเป็นค่าเริ่มต้นของเครื่องนี้เรียบร้อยแล้วครับ!");
}

// กดปุ่มรีเซ็ตกลับเป็นค่าเริ่มต้นกลาง
function resetDefaultSender() {
  if (!confirm("ต้องการรีเซ็ตข้อมูลผู้ส่งกลับเป็นค่าเริ่มต้นทั้งหมดหรือไม่?")) return;
  localStorage.removeItem("shipping_sender_info");
  SENDER_INFO = JSON.parse(JSON.stringify(DEFAULT_SENDER_INFO));
  setSenderInputs(SENDER_INFO);
  if (typeof renderAllPages === "function") {
    renderAllPages();
  }
  alert("🔄 รีเซ็ตข้อมูลผู้ส่งเรียบร้อยครับ");
}