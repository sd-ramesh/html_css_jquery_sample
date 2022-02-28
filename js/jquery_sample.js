function fetchApi(url, data){
    return new Promise(async (resolve, reject) => {
        fetch(url, data)
        .then(async (resp) => {
            if(resp.status >= 400 && resp.status < 600 ) throw new Error(JSON.stringify(await resp.json()))
            return resp.json()
        })
        .then(resps => {
            resolve(resps)
        })
        .catch((err) => {
            err = JSON.parse(err.message)
            document.getElementById("page-top").classList.remove("loading");
            swal({
                title: "Error!",
                text: err.message,
                icon: "error",
            })
        })
    })
}
async function getProductDetails(event) {

    var product = event.value;
    const url = baseurl + '/list/' +product;
    if(product){
        jQuery.get(url, function(data) { 
            var product = data.data
            document.getElementById("details").value = product.features
        });
    }
    else{
        document.getElementById("details").value = product.features
    }
}
async function getPackageDetailsForTextarea(event) {

    var serverId = document.getElementById("server_name").value;
    var package = event.value;
    const url = baseurl + '/detail/' + serverId+'/'+package;
    if(serverId && package){
        document.getElementById("page-top").classList.add("loading");
        let resps = await fetchApi(url, {
            method: "GET",
            headers : {
                'Content-Type': 'application/json'
            }
        })
        var packages = resps.serverPackageDetail 
        var option="";
        for (const property in packages) {
            option += property+':'+packages[property]+'\n';
        }  
        document.getElementById("features").value = option;
        document.getElementById("page-top").classList.remove("loading")
    }
}
async function getPackageDetails(event) {

    var serverId = document.getElementById("server_name").value;
    var package = event.value;
    const url = baseurl + '/detail/' + serverId+'/'+package;
    if(serverId && package){
        document.getElementById("page-top").classList.add("loading");
        let resps = await fetchApi(url, {
            method: "GET",
            headers : {
                'Content-Type': 'application/json'
            }
        })
        var packages = resps.serverPackageDetail
        var packageDetail = document.getElementById("package-info")
        packageDetail.innerHTML = ''
        for (const property in packages) {
            var option = '<p class="mb-0"><strong>'+property+'</strong>: '+packages[property]+'</p>';
            packageDetail.innerHTML += option;
        }
        document.getElementById("page-top").classList.remove("loading")
    }
}
async function getServerDetails(event) {
    var serverId = event.value;
    const url = baseurl + '/list/' + serverId;
    var packageList = document.getElementById("package")
    packageList.innerHTML = '';
    
    var option = document.createElement("option");
    option.value = '';
    option.text = 'Select Package';
    packageList.appendChild(option);
    var productList = document.getElementById("product")
    productList.innerHTML = '';
    
    var option = document.createElement("option");
    option.value = '';
    option.text = 'Select Product';
    productList.appendChild(option);
    if(serverId){
        document.getElementById("page-top").classList.add("loading");
        let resps = await fetchApi(url, {
            method: "GET",
            headers : {
                'Content-Type': 'application/json'
            }
        })
        if(resps.products.length){
            
            for(let product of resps.products){
                var option = document.createElement("option");
                option.value = product.id;
                option.text = product.name;
                productList.appendChild(option);
            }
        }
        var packages = resps.serverPackageList
        for (const property in packages) {
            var option = document.createElement("option");
            option.value = property;
            option.text = packages[property];
            option.onchange = (e) => getPackageDetails(serverId, property)
            packageList.appendChild(option);
        }
        document.getElementById("page-top").classList.remove("loading")
    }
}
// Get server and package detail for product
async function getServerDetailsForProduct(event) {
    var serverId = event.value;
    const url = baseurl + '/list/' + serverId;
    var packageList = document.getElementById("package")
    packageList.innerHTML = '';
    
    var option = document.createElement("option");
    option.value = '';
    option.text = 'Select Package';
    packageList.appendChild(option); 
    if(serverId){
        document.getElementById("page-top").classList.add("loading");
        let resps = await fetchApi(url, {
            method: "GET",
            headers : {
                'Content-Type': 'application/json'
            }
        }) 
        var packages = resps.serverPackageList
        for (const property in packages) {
            var option = document.createElement("option");
            option.value = property;
            option.text = packages[property];
            option.onchange = (e) => getPackageDetails(serverId, property)
            packageList.appendChild(option);
        }
        document.getElementById("page-top").classList.remove("loading")
    }
}

jQuery(document).on('click', '.delete-confirmed', function (event) {
    event.preventDefault();
    const url = jQuery(this).attr('href');
    const aTag = jQuery(this);
    swal({
        title: 'Are you sure?',
        text: 'This record will be deleted permanantly',
        icon: 'warning',
        buttons: ["Cancel", "Yes!"],
    }).then(function(value) {
        if (value) {
            
            jQuery.get(url, function(data) {    
                if(data.api_response == 'error')
                {
                    swal({
                        title: "Warning",
                        text: data.message,
                        icon: "warning",
                    });
                }       
                else{     
                    jQuery(aTag).closest('tr').remove();  
                    const tbodyId = jQuery('tbody').attr('id');
                    var rowCount = $('#'+tbodyId+' tr').length;
                    if(rowCount == 0 && tbodyId == 'serverList'){
                        jQuery("#"+tbodyId).append('<tr><td colspan="4" align="center">No Server added!</td></tr>');
                    } else if(tbodyId == 'serverList'){
                        jQuery("#formCancelBtn").hide();
                        jQuery("#formAction").text('Add New');
                        jQuery("form[id='serverForm']").trigger("reset");
                        jQuery("#rowId").val(jQuery('#rowId').attr('data-id'));
                    }
                    if(rowCount == 0 && tbodyId == 'serverLocationList'){
                        jQuery("#"+tbodyId).append('<tr><td colspan="4" align="center">No Server Location added!</td></tr>');
                    } else if(tbodyId == 'serverLocationList'){
                        jQuery("#formCancelBtn").hide();
                        jQuery("#formAction").text('Add New');
                        jQuery("form[id='serverAddressForm']").trigger("reset");
                        jQuery("#rowId").val(jQuery('#rowId').attr('data-id'));
                    }
                    if(rowCount == 0 && tbodyId == 'packageList'){
                        jQuery("#"+tbodyId).append('<tr><td colspan="6" align="center">No Server Package added!</td></tr>');
                    } else if(tbodyId == 'packageList'){
                        jQuery("#formCancelBtn").hide();
                        jQuery("#formAction").text('Add New');
                        jQuery("form[id='serverPackageForm']").trigger("reset");
                        jQuery("#rowId").val(jQuery('#rowId').attr('data-id'));
                    }
                    if(rowCount == 0 && tbodyId == 'productList'){
                        jQuery("#"+tbodyId).append('<tr><td colspan="5" align="center">No Server Product added!</td></tr>');
                    } else if(tbodyId == 'productList'){
                        jQuery("#formCancelBtn").hide();
                        jQuery("#formAction").text('Add New');
                        jQuery('#nodays').prop('disabled', true);
                        jQuery('#noDaysOuter').hide()
                        jQuery("form[id='serverProductForm']").trigger("reset");
                        jQuery("#rowId").val(jQuery('#rowId').attr('data-id'));
                    }
                    swal({
                        title: "Success",
                        text: data.message,
                        icon: "success",
                    });
                }
            });
        }
    });
});
