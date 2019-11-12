
String.prototype.format = String.prototype.create = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var Pages = function(selector) {
	console.log(selector)
    this.selector = selector;
    
}
Pages.Constructor = function(param, attrs) {
    var el = new Pages(param);
    return el.init(attrs);
};

Pages.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        Pages.prototype[m] = methods[m]
    })
}

let dataTable ;

Pages.extend({

    fetchTable: function(){
        dataTable =  $('#data-table-pages').DataTable({
        	'searching': true,
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: false,
            dom: 'Bfrtip',
            "ajax": {
                "url": $global_endpoint+"settings/static-pages/list-api"
            },
            "type": "GET",
            "dataType": 'json',
            "contentType": 'application/json; charset=utf-8',
            "columns": [
                { "data": "template_name" },
                { "data": "active" },
                { "data": "updated_at" },
                { "data": "action" }               
            ],
        });
    },
    markactive: function(obj){
        let page_id = $(obj).attr('data-key');
        $.get($global_endpoint+'settings/static-pages/'+page_id+'/mark-active?status='+$(obj).is(":checked"), function(response, code){
             $.notify(response.message, {'pos': 'bottom-right', 'status': 'info'})
        })
    },
    deleteRecord: function(control){
        var page_id = $(control).attr('data-key');
        $.LoadingOverlay("show", {
            text: "Deleting..."
        });
        $.get($global_endpoint+'settings/static-pages/'+page_id+"/delete",function(response, code){
            $.LoadingOverlay("text", response.message);
            setTimeout(function(){
                $.LoadingOverlay("hide")
            },500)
            dataTable.clear();
            dataTable.rows.add(response.data);
            dataTable.draw();
        })
    },
})

var obj = new Pages()

obj.fetchTable()


$('#search-keyword').on( 'keyup', function () {
	
    dataTable.search( this.value ).draw();
});




