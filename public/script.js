const socket = io();

$( document ).ready(init)

function init () {
  getMessages()
}

function getMessages () {
  // simple get request
  $.get("/api/texts", function( texts ) {
    // iterate for each datapoint in the database
    updateData(texts)
  });
}

function updateData (texts) {
  $( ".result" ).empty()
  for (var i in texts) {
    addMessage(texts[i])
  }
  setInteract()
}

function addMessage (data) {
  var id = data.id
  var x = data.x
  var y = data.y
  var message = data.message
  $( ".result" ).append(`
    <div id="${id}" style="left: ${x}%; top: ${y}%;" class="draggable">
      <span>${message}</span>
    </div>
  `);
}

function updateMessage (data) {
  $(`#${data.id}`).css("left", data.x + "%");
  $(`#${data.id}`).css("top", data.y + "%");
}

function deleteMessage (id) {
  $.ajax({
    type: 'DELETE',
    url: "/api/text",   
    contentType: 'application/json',
    data:  JSON.stringify({
      id: id
    })
  })
}

function changeMessagePosition (id, x, y) {
  $.ajax({
    type: 'put',
    url: "/api/text",   
    contentType: 'application/json',
    data:  JSON.stringify({
      x: x,
      y: y,
      id: id
    })
  })
}


function submitText (text) {
  var x = Math.random() * 100
  var y = Math.random() * 100
  var id = guid()
  $.ajax({
    type: 'post',
    url: "/api/text",   
    contentType: 'application/json',
    data:  JSON.stringify({
      id: id,
      x: x,
      y: y,
      message: text
    }),
    success: function (data) {
      console.log("done")
      // updateData(data)
    },
    error: function () {
      console.log('We are sorry but our servers are having an issue right now');
    }
  })
}

function setInteract () {
  $( ".draggable" ).draggable({
    containment: ".result",
    start: function (evt) {
      console.log("start", evt, evt.target.offsetLeft, evt.target.offsetTop)
      this.startX = evt.target.offsetLeft
      this.startY = evt.target.offsetTop
    },
    stop: function (evt) {
      console.log("end", evt, this.startX, this.startY, evt.offsetX, evt.offsetY)
      var x = ( 100 * (parseFloat(evt.target.offsetLeft) / parseFloat($(this).parent().width())) )
      var y = ( 100 * (parseFloat(evt.target.offsetTop) / parseFloat($(this).parent().height())) )
      console.log("end 2 ", this.startX + evt.offsetX, this.startY + evt.offsetY)
      $(this).css("left", x + "%");
      $(this).css("top", y + "%");
      changeMessagePosition(evt.target.id, x, y)
    }
  });

  $( ".draggable" ).dblclick(function (evt) {
    console.log("delete", $(this)[0].id)
    deleteMessage($(this)[0].id)
    $(this).remove()
  })
}

socket.on('message_added', function(data) {
  addMessage(data)
  setInteract()
});

socket.on('message_updated', function(data) {
  updateMessage(data)
  console.log("data", data)
});

socket.on('message_deleted', function(id) {
  console.log("message_deleted", id)
  $(`#${id}`).remove()
});

$('#submit').click(function (evt) {
  console.log('text',  $("#text").val())
  submitText($("#text").val())
  $("#text").val('')
})


let guid = () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}