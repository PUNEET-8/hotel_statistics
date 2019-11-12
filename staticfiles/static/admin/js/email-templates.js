
String.prototype.format = String.prototype.create = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var EmailTemplates = function(selector) {
	console.log(selector)
    this.selector = selector;
    
}
EmailTemplates.Constructor = function(param, attrs) {
    var el = new EmailTemplates(param);
    return el.init(attrs);
};

EmailTemplates.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        EmailTemplates.prototype[m] = methods[m]
    })
}

let dataTable ;

EmailTemplates.extend({

    fetchTable: function(){
        dataTable =  $('#data-table-email-templates').DataTable({
        	'searching': true,
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: false,
            dom: 'Bfrtip',
            "ajax": {
                "url": $global_endpoint+"settings/email-templates/list-api"
            },
            "type": "GET",
            "dataType": 'json',
            "contentType": 'application/json; charset=utf-8',
            "columns": [
                { "data": "template_name" },
                { "data": "updated_at" },
                { "data": "action" }               
            ],
        });
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
                 var email_template_id = $(control).attr('data-key');
                $.get($global_endpoint+'settings/email-templates/'+email_template_id+"/delete",function(response){
    
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

var obj = new EmailTemplates()

obj.fetchTable()


$('#search-keyword').on( 'keyup', function () {
	
    dataTable.search( this.value ).draw();
});