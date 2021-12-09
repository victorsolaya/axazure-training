function handleOnLoad(executionContext) {
    console.log('on load - permit form');
}

function handleOnChangePermitType(executionContext) {
    var formContext = executionContext.getFormContext();
    var jobTitleValue = formContext.getAttribute("jobtitle").getValue();
    if (jobTitleValue == null) {
        formContext.ui.tabs.get("DETAILS_TAB").setVisible(false);
        //HIDE DETAILS TAB
    } else {
        formContext.ui.tabs.get("DETAILS_TAB").setVisible(true);
        // SHOW DETAILS TAB
    }
}

function onChangeAccountName(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountName = formContext.getAttribute("parentcustomerid").getValue();
    //If the accountname is null then we are not continuing with the process.
    if (accountName == null) { return; }
    // Getting the id from the Lookup field
    var accountId = accountName[0].id;
    var accountType = accountName[0].entityType;
    var telephoneField = "telephone1";

    Xrm.WebApi.online.retrieveRecord(accountType, accountId, "?$select=" + telephoneField)
        .then(function (result) {
            var telephone = result[telephoneField];
            formContext.getAttribute(telephoneField).setValue(telephone);
        })
}