// simple get request
$.get("/api/texts", function( data ) {
  // iterate for each datapoint in the database
  for (var d in data) {
    console.log(data[d].message);
    $( ".result" ).append( `<p>${data[d].message}</p>` );
  }
});