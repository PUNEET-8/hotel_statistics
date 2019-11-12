
String.prototype.format = String.prototype.create = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var Category = function(selector) {
	console.log(selector)
    this.selector = selector;
    
}
Category.Constructor = function(param, attrs) {
    var el = new Category(param);
    return el.init(attrs);
};

Category.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        Category.prototype[m] = methods[m]
    })
}

let dataTable ;

Category.extend({

    fetchTable: function(){
        dataTable =  $('#data-table-category').DataTable({
        	'searching': true,
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: false,
            dom: 'Bfrtip',
            "ajax": {
                "url": $global_endpoint+"categories/list-api"
            },
            "type": "GET",
            "dataType": 'json',
            "contentType": 'application/json; charset=utf-8',
            "columns": [
                { "data": "name" },
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
                var category_id = $(control).attr('data-key');
                $.get($global_endpoint+'categories/'+category_id+"/delete",function(response, code){
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

var obj = new Category()

obj.fetchTable()


$('#search-keyword').on( 'keyup', function () {
    dataTable.search( this.value ).draw();
});