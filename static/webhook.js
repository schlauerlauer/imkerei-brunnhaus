const send = document.querySelector("#sendmessage").addEventListener("click", () => {
    sendWebhook();
});

async function sendWebhook() {
    const name = document.querySelector("#nachricht-name").value;
    const mail = document.getElementById("nachricht-mail").value;
    const nachricht = document.getElementById("nachricht").value;
    const responseOut = document.getElementById("message-response");
    const url = "https://home.brunnhaus.de/api/webhook/honig.brunnhaus";
    if (name != "" && mail != "" && nachricht != "") {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `name=${name}&mail=${mail}&nachricht=${nachricht}`
      });
      console.log(response.status);
      if (response.status === 200) {
          document.getElementById("nachricht-name").value = "";
          document.getElementById("nachricht-mail").value = "";
          document.getElementById("nachricht").value = "";
          responseOut.style.color = "MediumSeaGreen";
          responseOut.innerHTML = "Vielen Dank für deine Nachricht!";
      } else {
        responseOut.style.color = "IndianRed";
        responseOut.innerHTML = "Etwas ist schiefgelaufen. Bitte versuche es später noch einmal!";
      }
    } else {
      responseOut.style.color = "IndianRed";
      responseOut.innerHTML = "Bitte alle Felder ausfüllen.";
    }
    setTimeout(() => {
      responseOut.innerHTML = "";
    }, 5000);
}