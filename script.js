const API = "https://api.qrserver.com/v1/create-qr-code/";

const imgBox = document.querySelector("#imgBox");
const qrImage = document.querySelector("#qrImage");
const qrTitle = document.querySelector("#qrTitle");
const qrInputs = document.querySelector("#qrInputs");
const generateBtn = document.querySelector("#generateBtn");

const qrSize = document.querySelector("#qrSize");
const qrColor = document.querySelector("#qrColor");
const qrBg = document.querySelector("#qrBg");

let currentType = "text"; // default

// Navbar handling
document.querySelectorAll(".navbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".navbar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentType = btn.dataset.type;
    loadInputs(currentType);
  });
});

// Load input fields based on type
function loadInputs(type) {
  qrInputs.innerHTML = "";
  imgBox.classList.remove("show-img");
  qrImage.src = "";   // Clear old QR

  switch(type) {
    case "text":
      qrTitle.textContent = "Text / URL QR Generator";
      qrInputs.innerHTML = `<input type="text" id="qrText" placeholder="Enter text or URL">`;
      break;

    case "wifi":
      qrTitle.textContent = "Wi-Fi QR Generator";
      qrInputs.innerHTML = `
        <input type="text" id="wifiSsid" placeholder="Wi-Fi SSID">
        <input type="password" id="wifiPass" placeholder="Password">
        <select id="wifiEncrypt">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Password</option>
        </select>
      `;
      break;

    case "vcard":
      qrTitle.textContent = "vCard QR Generator";
      qrInputs.innerHTML = `
        <input type="text" id="vName" placeholder="Full Name">
        <input type="text" id="vPhone" placeholder="Phone Number">
        <input type="email" id="vEmail" placeholder="Email">
        <input type="text" id="vOrg" placeholder="Organization">
      `;
      break;

    case "email":
      qrTitle.textContent = "Email QR Generator";
      qrInputs.innerHTML = `
        <input type="email" id="eTo" placeholder="Recipient Email">
        <input type="text" id="eSubject" placeholder="Subject">
        <input type="text" id="eBody" placeholder="Message">
      `;
      break;

    case "sms":
      qrTitle.textContent = "SMS QR Generator";
      qrInputs.innerHTML = `
        <input type="text" id="sPhone" placeholder="Phone Number">
        <input type="text" id="sMsg" placeholder="Message">
      `;
      break;

    case "payment":
      qrTitle.textContent = "Payment QR Generator";
      qrInputs.innerHTML = `
        <select id="paymentType">
          <option value="upi">UPI</option>
          <option value="paypal">PayPal</option>
        </select>
        <div id="paymentFields"></div>
      `;
      loadPaymentFields("upi");
      document.querySelector("#paymentType").addEventListener("change", e => loadPaymentFields(e.target.value));
      break;

    case "event":
      qrTitle.textContent = "Event QR Generator";
      qrInputs.innerHTML = `
        <input type="text" id="evTitle" placeholder="Event Title">
        <input type="datetime-local" id="evStart">
        <input type="datetime-local" id="evEnd">
        <input type="text" id="evLoc" placeholder="Location">
      `;
      break;
  }
}

// Payment input fields
function loadPaymentFields(type) {
  const container = document.querySelector("#paymentFields");
  if (type === "upi") {
    container.innerHTML = `
      <input type="text" id="upiId" placeholder="UPI ID (example@upi)">
      <input type="text" id="upiName" placeholder="Payee Name">
      <input type="number" id="upiAmount" placeholder="Amount (INR)">
    `;
  } else if (type === "paypal") {
    container.innerHTML = `
      <input type="text" id="paypalUser" placeholder="PayPal Username">
      <input type="number" id="paypalAmount" placeholder="Amount (USD)">
    `;
  }
}

// Generate QR button click
generateBtn.addEventListener("click", () => {
  let data = "";

  switch(currentType) {
    case "text":
      data = document.querySelector("#qrText").value.trim();
      break;

    case "wifi":
        const ssid = document.querySelector("#wifiSsid").value.trim();
        const pass = document.querySelector("#wifiPass").value.trim();
        const enc = document.querySelector("#wifiEncrypt").value;

        if (!ssid) {
            alert("Please enter Wi-Fi SSID!");
            return;
        }

        if(enc === "nopass") {
            data = `WIFI:T:nopass;S:${ssid};;`;
        } else {
            data = `WIFI:T:${enc};S:${ssid};P:${pass};;`;
        }
        break;


    case "vcard":
      const vName = document.querySelector("#vName").value.trim();
      const vPhone = document.querySelector("#vPhone").value.trim();
      const vEmail = document.querySelector("#vEmail").value.trim();
      const vOrg = document.querySelector("#vOrg").value.trim();
      data = `BEGIN:VCARD\nVERSION:3.0\nN:${vName}\nORG:${vOrg}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
      break;

    case "email":
      const to = document.querySelector("#eTo").value.trim();
      const subject = document.querySelector("#eSubject").value.trim();
      const body = document.querySelector("#eBody").value.trim();
      data = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      break;

    case "sms":
      const sPhone = document.querySelector("#sPhone").value.trim();
      const sMsg = document.querySelector("#sMsg").value.trim();
      data = `SMSTO:${sPhone}:${sMsg}`;
      break;

    case "payment":
      const method = document.querySelector("#paymentType").value;
      if (method === "upi") {
        const upiId = document.querySelector("#upiId").value.trim();
        const name = document.querySelector("#upiName").value.trim();
        const amount = document.querySelector("#upiAmount").value.trim();
        if (!upiId || !name || !amount) {
          alert("Fill all UPI fields!");
          return;
        }
        data = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
      } else {
        const user = document.querySelector("#paypalUser").value.trim();
        const amount = document.querySelector("#paypalAmount").value.trim();
        if (!user || !amount) {
          alert("Fill all PayPal fields!");
          return;
        }
        data = `https://www.paypal.me/${user}/${amount}`;
      }
      break;

    case "event":
      const evTitle = document.querySelector("#evTitle").value.trim();
      const evStart = document.querySelector("#evStart").value;
      const evEnd = document.querySelector("#evEnd").value;
      const evLoc = document.querySelector("#evLoc").value.trim();
      data = `BEGIN:VEVENT\nSUMMARY:${evTitle}\nDTSTART:${evStart.replace(/[-:]/g,"")}\nDTEND:${evEnd.replace(/[-:]/g,"")}\nLOCATION:${evLoc}\nEND:VEVENT`;
      break;
  }

  if (!data) {
    alert("Please fill all required fields!");
    return;
  }

  const url = `${API}?size=${qrSize.value}&data=${encodeURIComponent(data)}&color=${qrColor.value.slice(1)}&bgcolor=${qrBg.value.slice(1)}`;
  qrImage.src = url;
  imgBox.classList.add("show-img");
});


const downloadBtn = document.querySelector("#downloadBtn");

downloadBtn.addEventListener("click", async () => {
    if (!qrImage.src) {
        alert("Generate a QR code first!");
        return;
    }

    try {
        // Fetch the image as a blob
        const response = await fetch(qrImage.src);
        const blob = await response.blob();

        // Create temporary link to download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "QRCode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release object URL
        URL.revokeObjectURL(url);
    } catch (error) {
        alert("Failed to download QR code.");
        console.error(error);
    }
});
