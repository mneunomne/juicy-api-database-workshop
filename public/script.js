const socket = io();

var context = null;

// wait for document to get loaded to init
$(document).ready(init)

function init() {
  getMessages()
  // add event listeners
  addEvents()
  addDrawEvents()
}

function getMessages() {
  // simple get request
  $.get("/api/texts", function (texts) {
    // iterate for each datapoint in the database
    updateData(texts)
  });
}

// fill screen with the message elements
function updateData(texts) {
  $(".result").empty()
  for (var i in texts) {
    addMessage(texts[i])
  }
  setInteractionEvents()
}

// insert new message on display
function addMessage(data) {
  var id = data.id
  var x = data.x
  var y = data.y
  var message = data.message
  $(".result").append(`
    <div id="${id}" style="left: ${x}px; top: ${y}px;" class="draggable">
      <span>${message}</span>
    </div>
  `);
}

// update position of a message
function updateMessage(data) {
  $(`#${data.id}`).css("left", data.x);
  $(`#${data.id}`).css("top", data.y);
}

// delete message
function deleteMessage(id) {
  // DELETE request
  $.ajax({
    type: 'DELETE',
    url: "/api/text",
    contentType: 'application/json',
    data: JSON.stringify({
      id: id
    })
  })
}

// send request to change position of message on the database
function changeMessagePosition(id, x, y) {
  // PUT request
  $.ajax({
    type: 'put',
    url: "/api/text",
    contentType: 'application/json',
    data: JSON.stringify({
      x: x,
      y: y,
      id: id
    })
  })
}

// submit new text from input element
function submitText(text) {
  var w = $(".result").width()
  var x = Math.random() * 100
  var y = Math.random() * 100
  var id = guid()
  // POST request
  $.ajax({
    type: 'post',
    url: "/api/text",
    contentType: 'application/json',
    data: JSON.stringify({
      id: id,
      x: x,
      y: y,
      message: text
    }),
    success: function (data) {
      console.log("success!", data)
    },
    error: function () {
      console.error('We are sorry but our servers are having an issue right now');
    }
  })
}

// set interaction events
function setInteractionEvents() {
  // set draggable event
  $(".draggable").draggable({
    containment: ".result",
    stop: function (evt) {
      var x = evt.target.offsetLeft
      var y = evt.target.offsetTop
      $(this).css("left", x + "px");
      $(this).css("top", y + "px");
      changeMessagePosition(evt.target.id, x, y)
    }
  });

  $(".draggable").dblclick(function (evt) {
    console.log("delete", $(this)[0].id)
    deleteMessage($(this)[0].id)
    $(this).remove()
  })
}

function addEvents() {
  // interaction events
  $('#submit').click(function (evt) {
    console.log('text', $("#text").val())
    submitText($("#text").val())
    $("#text").val('')
  })

  $('#text').on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      submitText($("#text").val())
      $("#text").val('')
    }
  });

  // Socket.io events
  socket.on('message_added', function (data) {
    addMessage(data)
    setInteractionEvents()
  });

  socket.on('message_updated', function (data) {
    updateMessage(data)
    console.log("data", data)
  });

  socket.on('message_deleted', function (id) {
    console.log("message_deleted", id)
    $(`#${id}`).remove()
  });
}

// unique id string generator
let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}