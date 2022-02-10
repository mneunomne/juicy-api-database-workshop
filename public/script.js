// simple get request
$.get("/api/texts", function( data ) {
  // iterate for each datapoint in the database
  updateData(data)
});

function updateData (messages) {
  $( ".result" ).empty()
  for (var i in messages) {
    console.log(messages[i].message);
    $( ".result" ).append( `<p>${messages[i].message}</p>` );
  }
}


function submitText (text) {
  $.ajax({
    type: 'post',
    url: "/api/text",   
    contentType: 'application/json',
    data:  JSON.stringify({message: text}),
    success: function (data) {
      console.log("done", data)
      updateData(data)
    },
    error: function () {
      console.log('We are sorry but our servers are having an issue right now');
    }
  })
}

$('#submit').click(function (evt) {
  console.log('text',  $("#text").val())
  submitText($("#text").val())
  $("#text").val('')
})