const colors = {
  red: "IndianRed",
  green: "MediumSeaGreen"
};

const urls = {
  webhook: "https://home.brunnhaus.de/api/webhook/honig.brunnhaus",
  mails: "https://mail.brunnhaus.de/subscription/form"
}

const headers = {
  'Accept': "application/x-www-form-urlencoded",
  'Content-Type': "application/x-www-form-urlencoded"
}

const messages = {
  none: "",
  successWebhook: "Vielen Dank für deine Nachricht!",
  failure: "Etwas ist schiefgelaufen. Bitte versuche es später noch einmal!",
  fieldMissing: "Bitte Namen und Email eintragen.",
  subscription: "Vielen Dank! Wir haben dir eine Email geschickt. Bitte bestätige das Abonnement noch.",
  bothSuccess: "Vielen Dank für deine Nachricht! Bitte bestätige dein Abonnement noch über die Email die wir dir geschickt haben.",
  bothFailiure: "Etwas ist schiefgelaufen.. Aber vielleicht kommt die Mail ja trotzdem bei dir an!"
}

const send = document.querySelector("#sendmessage").addEventListener("click", () => {
  processRequest();
});

const channelType = {
  none: "none",
  webhook: "webhook",
  subscription: "subscription",
  both: "both",
}

async function sendWebhook(form) {
  const webhookForm = new URLSearchParams({
    name: form.name,
    mail: form.mail,
    nachricht: form.nachricht
  });
  return fetch(urls.webhook, {
    method: 'POST',
    headers,
    body: webhookForm.toString()
  });

}

async function subscribe(form) {
  const mailForm = new URLSearchParams({
    name: form.name,
    email: form.mail,
  });
  let body = mailForm.toString();
  for (let i = 0; i < form.lists.length; i++) {
    body += `&l=${form.lists[i].value}`;
  }
  return await fetch(urls.mails, {
    method: 'POST',
    headers,
    body
  });
}

async function processRequest() {
  const nameDom = document.getElementById("nachricht-name");
  const mailDom = document.getElementById("nachricht-mail");
  const messageDom = document.getElementById("nachricht");
  const form = {
    name: nameDom.value,
    mail: mailDom.value,
    nachricht: messageDom.value,
    lists: document.querySelectorAll("input[class='mail']:checked")
  };
  const responseText = document.getElementById("message-response");
  if (form.name != "" && form.mail != "") {
    let channels = channelType.none;
    if (form.nachricht.length > 0) channels = channelType.webhook;
    if (form.lists.length > 0) channels = channelType.subscription;
    if (form.nachricht.length > 0 && form.lists.length > 0) channels = channelType.both;
    let message = messages.none;
    let color = colors.green;
    switch (channels) {
      case channelType.none:
        break;
      case channelType.webhook:
        const resultWebhook = await sendWebhook(form)
        if (resultWebhook.status === 200) message = messages.successWebhook;
        else {
          message = messages.failure;
          color = colors.red;
        }
        console.log("WEBHOOK");
        break;
      case channelType.subscription:
        subscribe(form);
        message = messages.subscription;
        console.log("SUBSCRIPTION");
        break;
      case channelType.both:
        subscribe(form);
        const resultBoth = await sendWebhook(form)
        if (resultBoth.status === 200) message = messages.bothSuccess;
        else {
          message = messages.bothFailiure;
          color = colors.red;
        }
        console.log("BOTH");
        break;
      default:
        break;
    }
    nameDom.value = "";
    mailDom.value = "";
    messageDom.value = "";
    responseText.style.color = color;
    responseText.innerHTML = message;
  } else {
    responseText.style.color = colors.red;
    nameDom.style.borderColor = colors.red;
    mailDom.style.borderColor = colors.red;
    responseText.innerHTML = messages.fieldMissing;
  }
  setTimeout(() => {
    responseText.innerHTML = "⠀";
    nameDom.style.borderColor = "";
    mailDom.style.borderColor = "";
  }, 5000);
}