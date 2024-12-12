export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

var mousePosX, mousePosY;
document.addEventListener('mousemove', saveMousePosition);

export function saveMousePosition(event) {
   var eventDoc, doc, body;

   event = event || window.event; // IE-ism

   // If pageX/Y aren't available and clientX/Y are,
   // calculate pageX/Y - logic taken from jQuery.
   // (This is to support old IE)
   if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX = event.clientX +
         (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
         (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
         (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
         (doc && doc.clientTop  || body && body.clientTop  || 0 );
   }

   // Use event.pageX / event.pageY here
   mousePosX = event.pageX;
   mousePosY = event.pageY;
}

export function getMousePosition(){
   return [mousePosX,mousePosY];
}

export function smoothScrollJS(idDestino){
  document.getElementById(idDestino).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function randomFloatFromInterval(min, max, precision) {
  return (Math.random() * (max - min) + min).toFixed(precision);
}

export function setStylesOnElement(styles, element){
  Object.assign(element.style, styles);
}

export function copiarObjeto(source) {
  return Object.assign(new Object(), source);
}

export function mostrarMensajeEnCursor(mensajeAMostrar){
  var myDiv = '<div id="mensajesAJAXCursor">';
  var fadeDelay = 2000;
  var divMensajes = $(myDiv)
     .css({
        "left": mousePosX + 'px',
        "top": mousePosY + 'px',
        "z-index": '20'
     })
     .append(mensajeAMostrar)
     .appendTo(document.body);

  setTimeout(function() { 
     divMensajes.fadeOut("slow", function() { $(this).remove(); });
  }, fadeDelay);
  // $(document).mousemove(function(e){
  //    var divMensajes = $(myDiv)
  //       .css({
  //          "left": e.pageX + 'px',
  //          "top": e.pageY + 'px'
  //       })
  //       .append(mensajeAMostrar)
  //       .appendTo(document.body);
  //       $(document).off("mousemove");

  //    setTimeout(function() { 
  //       divMensajes.fadeOut("slow", function() { $(this).remove(); });
  //    }, fadeDelay);
  // });
}