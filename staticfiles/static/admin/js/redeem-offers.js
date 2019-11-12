
String.prototype.format = String.prototype.create = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var Offers = function(selector) {
	console.log(selector)
    this.selector = selector;
    
}
Offers.Constructor = function(param, attrs) {
    var el = new Offers(param);
    return el.init(attrs);
};

Offers.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        Offers.prototype[m] = methods[m]
    })
}

let dataTable ;

Offers.extend({

    fetchTable: function(){
        dataTable =  $('#data-table-offers').DataTable({
        	'searching': true,
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: false,
            dom: 'Bfrtip',
            "ajax": {
                "url": $global_endpoint+"bookings/redeem_offer_list_api"
            },
            "type": "GET",
            "dataType": 'json',
            "contentType": 'application/json; charset=utf-8',
            "columns": [
                { "data": "offer_offer_title" },
                { "data": "user_email" },
                { "data": "active" },  
                { "data": "action" }    

            ],
        });
    },
    markactive: function(obj){
        let offer_id = $(obj).attr('data-key');
        $.get($global_endpoint+'bookings/'+offer_id+'/mark-active?status='+$(obj).is(":checked"), function(response, code){


            M.toast({ html: response.message ,classes: 'rounded'});
        })
    },
    deleteRecord: function(control){
        
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this record!",
            icon: 'warning',
            dangerMode: true,
            buttons: {
              cancel: 'No, Please!',
              delete: 'Yes, Delete It'
            }
          }).then(function (willDelete) {
            if (willDelete) {
                var offer_id = $(control).attr('data-key');
                $.get($global_endpoint+'offers/'+offer_id+"/delete",function(response, code){
                    if(response.code==200){
                       swal("Poof! Your record has been deleted!", {
                        icon: "success",
                    }); 
                   }else{
                        swal("The record is not deleted", {
                        icon: "error",
                    }); 
                   }
                    
                    dataTable.clear();
                    dataTable.rows.add(response.data);
                    dataTable.draw();
                })
              
            } else {
              swal("Your record is safe", {
                title: 'Cancelled',
                icon: "error",
              });
            }
          });
        
    },
})

var obj = new Offers()

obj.fetchTable()


$('#search-keyword').on( 'keyup', function () {
	console.log("dfsd")
    dataTable.search( this.value ).draw();
});