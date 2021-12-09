function onLoadHandlerAccounts(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountid = formContext.data.entity.getId();

    if (accountid == null) { return;}
    SetCities(formContext, accountid);
   
}

async function onSaveHandler(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountid = formContext.data.entity.getId();

    if (accountid == null) { return;}
    executionContext.getEventArgs().preventDefaultOnError();
    await SetCities(formContext, accountid)
 
}

async function SetCities(formContext, accountid) {
    return new Promise((resolve, reject) => {
        Xrm.WebApi.online.retrieveMultipleRecords("contact", "?$select=address1_city&$filter=_parentcustomerid_value eq '"+ accountid +"'")
        .then(function(results) {
            if(results != null && results.entities != null && results.entities.length != 0) {
                var addressCities = [];
                for(var i = 0; i < results.entities.length; i++) {
                    var contact = results.entities[i];
                    var address = contact.address1_city;
                    if(address != null) {
                        addressCities.push(address)
                    }
                }
                var addressAll = addressCities.join(" - ");
                if(addressAll.toLowerCase().includes('b')) {
                    alert("It contains a B!!!!!!")
                    reject("Error")
                } else {
                    formContext.getAttribute("vso_citiesfromcontacts").setValue(addressAll);
                    resolve()
                }
            }
        })
    })

}