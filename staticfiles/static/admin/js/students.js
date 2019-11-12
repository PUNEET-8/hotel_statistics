
String.prototype.format = String.prototype.create = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var Students = function(selector) {
	console.log(selector)
    this.selector = selector;
    
}
Students.Constructor = function(param, attrs) {
    var el = new Students(param);
    return el.init(attrs);
};

Students.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        Students.prototype[m] = methods[m]
    })
}

let dataTable ;

Students.extend({

    fetchTable: function(){
        dataTable =  $('#data-table-students').DataTable({
        	'searching': true,
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: false,
            dom: 'Bfrtip',
            "ajax": {
                "url": $global_endpoint+"students/list-api"
            },
            "type": "GET",
            "dataType": 'json',
            "contentType": 'application/json; charset=utf-8',
            "columns": [
                { "data": "select" },
                { "data": "username" },
                { "data": "avatar" },
                { "data": "email" },
                { "data": "mobile" },
                { "data": "active" },
                { "data": "action" }               
            ],
        });
      
    },
    markactive: function(obj){
        let user_id = $(obj).attr('data-key');
        $.get($global_endpoint+'students/'+user_id+'/mark-active?status='+$(obj).is(":checked"), function(response, code){
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
                var user_id = $(control).attr('data-key');
                $.get($global_endpoint+'students/'+user_id+"/delete",function(response, code){
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
    deleteRecords: function(vals){
        let action = $(vals).val()
        let ids=""
        $('.action_checkbox').each(function(){ 
            if($(this).is(':checked')){
                ids = ids+","+$(this).attr('data-customer')
            }
        })
        console.log("Ids", ids)
        $.post("/master-admin/students/list-action", {ids: ids, action: action}, function(response, code){
            console.log(response, code)
            if(response.code == 200){
                $.get($global_endpoint+"students/list-api", function(response, code){
                    dataTable.clear();
                    dataTable.rows.add(response.data);
                    dataTable.draw();  
                })
            }
            else{
                swal(response.message)
            }
        })
    }
})


var obj = new Students()

obj.fetchTable()


$('#search-keyword').on( 'keyup', function () {
    dataTable.search( this.value ).draw();
});

function toggle(source) {
   checkboxes = document.getElementsByName("student_id");
   for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = source.checked;
   }
}