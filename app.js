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
let products = [];
// Accepts POST requests at /webhook endpoint
app.post("/webhook",async (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  let nombreAsesor = "";
  let campana = "";
  let fechaLimite = "";
  let cupoDisponible = "";
  let vitalPlata = "";
  let totalAPagar = "";
  let fechaPago = "";
  let opcionCedula = "";
  let bodyOfWS = "";
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
  else if(msg_body === "Menu" || 
          msg_body === "MENU" || 
          msg_body === "Regresar a Menu" || 
          msg_body === "No" ||
          msg_body === "Regresar al Menu"){
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
     opcionCedula = "1"
 
}   
        
       else if(opcionCedula === "1"){
        
        let xmls=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
                            xmlns:tem="http://tempuri.org/">\
            <soapenv:Header/>\
            <soapenv:Body>\
              <tem:confirmaDatosBasicos>\
                <tem:numeroDocumento>${msg_body}</tem:numeroDocumento>\
                <tem:Usuario>ftMQaMKlOcZs1xkbtkdQcxROYzDVpJGunMpu1QgJ0LI=</tem:Usuario>\
              <tem:Password>Zqxl82ZBJ2lk6DxZUh6ZV98JF60YgQJMuc7Oo5UYuMI=</tem:Password>\
            </tem:confirmaDatosBasicos>\
            </soapenv:Body>\
          </soapenv:Envelope>`;

axios.post('https://portal.lavital.co/WS_LIQUIDACION_PBA/wsConsultaDocumento.asmx?wsdl',
           xmls,
           {headers:
             {'Content-Type': 'text/xml'}
           }).then(res=>{
            var respuesta = res.data
            console.log(res.data)
           var cadenaCompleta = respuesta.substring(1222,1808)
             var arrayDeCadenas = cadenaCompleta.split("|");
           var cadenaError = respuesta.substring(1173,1202)
           if (cadenaError === "NO EXISTE NUMERO DE DOCUMENTO"){
             console.log("no haga nada");
             
          //   axios({
        //method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        //url:
          //"https://graph.facebook.com/v12.0/" +
          //phone_number_id +
          //"/messages?access_token=" +
          //token,
          //data: {
            //messaging_product: "whatsapp",
            //to: from,
            //type: "template",
            //template: {
              //name: "mensaje_noregistrado",
              //language: {
               // code:"es"
             // }
           // }
         // },
       // headers: { "Content-Type": "application/json" },
     // });
             
           }
  
  else if (msg_body != msg_body){
            nombreAsesor = arrayDeCadenas[0].substring(0,15)
            campana = arrayDeCadenas[8].substring(9,15)
            fechaLimite = arrayDeCadenas[5].substring(24,34);
            cupoDisponible = arrayDeCadenas[1].substring(17,18);
            vitalPlata = arrayDeCadenas[12].substring(13,14);
            totalAPagar = arrayDeCadenas[2].substring(15,16);
            fechaPago = arrayDeCadenas[3].substring(22,32);
             
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
                    "text": nombreAsesor
                }
                ]
            },
            {
                 "type" : "body",
               "parameters": [
                   {
                       "type": "text",
                       "text": campana
                   },
                   {
                       "type": "text",
                       "text": fechaLimite
                   },
                   {  
                       "type": "text",
                       "text": cupoDisponible
                   },
                   {
                       "type": "text",
                       "text": vitalPlata
                   },
                   {
                       "type": "text",
                       "text": totalAPagar
                   },
                   {
                       "type": "text",
                       "text": fechaPago
                   }
               ]
            }    
       ]
    }
},
        headers: { "Content-Type": "application/json" },
      });
           }   
           //var parseString = require('xml2js').parseString;//forma de convertir respuesta a json, pero los parametros los muestra como por ejemplo: soap:Envelope (No Sirve).
           //parseString(respuesta, function (err, result) {//forma de convertir respuesta a json, pero los parametros los muestra como por ejemplo: soap:Envelope (No Sirve).
            //let data = JSON.stringify(result) //forma de convertir respuesta a json, pero los parametros los muestra como por ejemplo: soap:Envelope (No Sirve).
           // console.log(data); //forma de convertir respuesta a json, pero los parametros los muestra como por ejemplo: soap:Envelope (No Sirve).
         // }); //forma de convertir respuesta a json, pero los parametros los muestra como por ejemplo: soap:Envelope (No Sirve).
           }).catch(err=>{
              console.log(err)
});
        
} 
        
    if(msg_body === "ENVIAR"){
      for (var i = 0; i < products.length; i++) { 

            bodyOfWS += `<tem:objDetallePedido><tem:CodigoProducto>${products[i][0]}</tem:CodigoProducto><tem:Cantidad>${products[i][1]}</tem:Cantidad></tem:objDetallePedido>`
            console.log(bodyOfWS)
            
        } 
      
      
      let xmls=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:insertaPedido> 
         <tem:objEncabezadoPed>
            <tem:numeroDocumento>80219378</tem:numeroDocumento>
            <tem:Campana>202208</tem:Campana>
         </tem:objEncabezadoPed>
         <tem:objdetallePedido>
               ${bodyOfWS}
         </tem:objdetallePedido>
         <tem:opcion>1</tem:opcion>
         <tem:medioPago>1</tem:medioPago>
         <tem:VlrDescuentoPadic>0</tem:VlrDescuentoPadic>
         <tem:VlrDescuentoSaldoFavor>0</tem:VlrDescuentoSaldoFavor>
         <tem:ViaIngreso>CHAT_BOTS_R</tem:ViaIngreso>
         <tem:VlrAdicional1>0</tem:VlrAdicional1>
         <tem:DatoAdicional1>NA</tem:DatoAdicional1>
         <tem:Usuario>ftMQaMKlOcZs1xkbtkdQcxROYzDVpJGunMpu1QgJ0LI=</tem:Usuario>
         <tem:Password>Zqxl82ZBJ2lk6DxZUh6ZV98JF60YgQJMuc7Oo5UYuMI=</tem:Password>
      </tem:insertaPedido>
   </soapenv:Body>
</soapenv:Envelope>`; 
      
      console.log(xmls)
   
      axios.post('https://portal.lavital.co/WS_LIQUIDACION_PBA/wsConsultaDocumento.asmx?wsdl',
           xmls,
           {headers:
             {'Content-Type': 'text/xml'}
           }).then(res=>{
	console.log(res.data)
     	}).catch(err=>{
              console.log(err)
});
      
    }
      
    else if(msg_body === msg_body){
      
    var Codes = msg_body.split(" ");
      products.push(Codes);
      
  
       }
          
      else if (msg_body === "Montar Pedido"){

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
       "name": "mensaje_montarpedido",
       "language": {
           "code": "es"
       },
      "components": [
            {
                "type": "body",
                "parameters": [
                    {
                    "type": "text",
                    "text": "119.000"
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
      axios( {
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
      else if(msg_body === "Montar" || msg_body === "pedido"){
       try {
    await axios({
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
       name: "mensaje_condiciones",
       language: {
           code: "es"
       },
      components: [
           {
               type: "header",
               parameters: [
                   {
                       type: "text",
                       text: " "
                   }
               ]
           }
       ]
    }
},
    headers: { "Content-Type": "application/json" },
      })
    } catch (err) {
    console.log(err.response);
  }
 
}
      else if(msg_body === "Quiero un Asesor"){
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
          
          text: { body: "El Asesor Santiago Aponte Se pondra en contacto contigo" },
        },
        headers: { "Content-Type": "application/json" },
      });
       
}
 else if (
  msg_body != "Quiero un Asesor" ||
  msg_body != "pedido" ||
  msg_body != "Montar" ||
  msg_body != "Mi Directora" ||
  msg_body != "Mi Negocio Vital" ||
  msg_body != "Otros Canales" ||
  msg_body != "Catalogo Merca Ahorro" ||
  msg_body != "Catalogo Bienestar" ||
  msg_body != "Catálogos LV" ||
  msg_body != "Catalogos LV" ||
  msg_body != "Ir a Pagar" ||
  msg_body != "Ir a pagar" ||
  msg_body != "Si" ||
  msg_body != "Sticker" ||
  msg_body != "Menu" ||
  msg_body != "Regresar a Menu" ||
  msg_body != "Menú" 
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
          type: "text",
          
          text: { body: "Lo siento, no entiendo tu solicitud." },
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
      console.log(res)
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
