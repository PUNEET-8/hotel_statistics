
String.prototype.format = String.prototype.create = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var Booking = function(selector) {
	console.log(selector)
    this.selector = selector;
    
}
Booking.Constructor = function(param, attrs) {
    var el = new Booking(param);
    return el.init(attrs);
};

Booking.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        Booking.prototype[m] = methods[m]
    })
}

let dataTable ;

Booking.extend({

    fetchTable: function(){
        dataTable =  $('#data-table-booking').DataTable({
        	'searching': true,
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: false,
            dom: 'Bfrtip',
            "ajax": {
                "url": $global_endpoint+"bookings/list-api"
            },
            "type": "GET",
            "dataType": 'json',
            "contentType": 'application/json; charset=utf-8',
            "columns": [
                { "data": "teacher.username" },
                { "data": "student.username" },
                { "data": "appointment_at" },
                { "data": "booking_status" },               
                { "data": "amount" },              
                { "data": "action" }               
            ],
        });
    },
})

var obj = new Booking()

obj.fetchTable()


$('#search-keyword').on( 'keyup', function () {
	
    dataTable.search( this.value ).draw();
});