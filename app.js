/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = ""; // extract the message text from the webhook payload
      let name_user = req.body.entry[0].changes[0].value.contacts[0].profile.name; //extract name the
      if(req.body.entry[0].changes[0].value.messages[0].text){
        msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; 
      }
      else if(req.body.entry[0].changes[0].value.messages[0].button){
        msg_body = req.body.entry[0].changes[0].value.messages[0].button.text;
      } else if (req.body.entry[0].changes[0].value.messages[0].interactive.list_reply){
        msg_body = req.body.entry[0].changes[0].value.messages[0].interactive.list_reply.title;
      }
            
      if(msg_body === "Hola" ||
         msg_body === "Hey" ||
         msg_body === "HOLA" ||
         msg_body === "Buenos Dias" ||
         msg_body === "buenos dias" ||
         msg_body === "buenas"
        ){
        axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            type: "template",
            template: {
              name: "mensaje_bienvenida",
              language: {
                code:"es"
              }
            }
          },
        headers: { "Content-Type": "application/json" },
      });
         
 }   
      // else if (!res.sendStatus(200)){
//     // Return a '404 Not Found' if event is not from a WhatsApp API
//     res.sendStatus(404);
//   }
  else if(msg_body === "Menu" || msg_body === "MENU" || msg_body === "Regresar a Menu" || msg_body === "No" || msg_body === "Regresar al Menu"){
     axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
      messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "interactive",
    interactive: {
        type: "list",
        header: {
            type: "text",
            text: "MENÚ PRINCIPAL"
        },
        body: {
            text: "Elige una opción"
        },
        footer: {
            text: "Querido " + name_user
        },
        action: {
            button: "Seleccionar Opción",
            sections: [
                {
                    title: "Lista de opciones",
                    rows: [
                        {
                            id: "1",
                            title: "Montar Pedido",
                            description: "Quiero montar mi pedido"
                        },
                        {
                            id: "2",
                            title: "Catalogos LV",
                            description: "Quiero conocer los catálogos de La Vital"
                        },
                        {
                            id: "3",
                            title: "Otros canales",
                            description: "Otros canales de atención"
                        },
                      {
                            id: "4",
                            title: "Estado Pedido",
                            description: "Quiero saber cuál es el estado de mi pedido "
                        },
                      {
                            id: "5",
                            title: "Mi Negocio Vital",
                            description: "Quiero saber más sobre mi negocio Vital y sus beneficios "
                        },
                      {
                            id: "6",
                            title: "Mi Directora",
                            description: "Quiero saber quién es mi directora de zona"
                        }
                    ]
                }]
        }
    }
},
        headers: { "Content-Type": "application/json" },
      });
  }
   else if(msg_body === "Acepto"){
        axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          
          text: { body: "Por favor compárteme tu número de cédula para identificarte y brindarte información personalizada." },
        },
        headers: { "Content-Type": "application/json" },
      });
         
}   
      else if(msg_body === "1144104695"){
        axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data:  {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "mensaje_menu",
       "language": {
           "code": "es"
       },
      "components": [
            {
                "type": "header",
                "parameters": [
                    {
                    "type": "text",
                    "text": name_user
                }
                ]
            },
            {
                 "type" : "body",
               "parameters": [
                   {
                       "type": "text",
                       "text": "202207"
                   },
                   {
                       "type": "text",
                       "text": "21/06/2022"
                   },
                   {  
                       "type": "text",
                       "text": "400000"
                   },
                   {
                       "type": "text",
                       "text": "0"
                   },
                   {
                       "type": "text",
                       "text": "0"
                   },
                   {
                       "type": "text",
                       "text": "00/00/00"
                   }
               ]
            }    
       ]
    }
},
        headers: { "Content-Type": "application/json" },
      });
         
} 
       else if(msg_body === "Montar Pedido"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    messaging_product: "whatsapp",
    to: from,
    type: "template",
    template: {
       name: "mensaje_terminoscondiciones",
       language: {
           "code": "es"
       },
      components: [
           {
               type: "header",
               parameters: [
                   {
                       "type": "text",
                       "text": name_user
                   }
               ]
           }
       ]
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
       else if(msg_body === "Sticker"){
        axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "sticker",
          sticker: { link: "https://www.tyntec.com/sites/default/files/2020-07/tyntec_rocket_sticker_512px_001_.webp" },
        },
        headers: { "Content-Type": "application/json" },
      });
         
}   
      else if(msg_body === "Si"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
          data: {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          
          text: { body: "Por favor Ingresa tu contraseña de oficina virtual" },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
        else if(msg_body === "Ir a pagar" || msg_body === "Ir a Pagar"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "mensaje_pagar",
       "language": {
           "code": "es"
       }, 
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
       else if(msg_body === "Catalogos LV" || msg_body === "Catálogos LV"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "mensaje_catalogos",
       "language": {
           "code": "es"
       }, 
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
      else if(msg_body === "Catalogo Bienestar"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "catalogo_bienestar",
       "language": {
           "code": "es"
       }, 
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
      else if(msg_body === "Catalogo Merca Ahorro"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "catalogo_mercahorro",
       "language": {
           "code": "es"
       }, 
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
      else if(msg_body === "Otros Canales"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "mensaje_contacto",
       "language": {
           "code": "es",
           "policy": "deterministic"
       }, 
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
       else if(msg_body === "Mi Negocio Vital"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "mensaje_beneficios",
       "language": {
           "code": "es",
           "policy": "deterministic"
       }, 
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
    else if(msg_body === "Mi Directora"){
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data : {
    "messaging_product": "whatsapp",
    "to": from,
    "type": "template",
    "template": {
       "name": "mensaje_directora",
       "language": {
           "code": "es",
       }, 
      "components": [
         {
           "type": "body",
           "parameters": [
               {
                   "type": "text",
                   "text": "Santiago Aponte"
               },
               {
                   "type": "text",
                   "text": "3163127211"
               },
               {
                   "type": "text",
                   "text": "santiago.aponte@lavital.co"
               }
           ]
         }
       ]
    }
},
        headers: { "Content-Type": "application/json" },
      });
    }
}
res.sendStatus(200);
}
else {
  res.sendStatus(404);
}
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
