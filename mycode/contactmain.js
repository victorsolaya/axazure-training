function onLoadContact(executionContext) {
    var formContext = executionContext.getFormContext != null ? executionContext.getFormContext() : executionContext;
    // Get first name attribute
    onChangeJobTitle(formContext)
}

function onChangeFirstName(executionContext) {
    var formContext = executionContext.getFormContext != null ? executionContext.getFormContext() : executionContext;
    var firstName = formContext.getAttribute("firstname");
    //Checking if the firstname attribute is in the form.
    if(firstName != null) {
        var firstNameValue = firstName.getValue();
        // The firstname contains something
        if(firstNameValue != null && firstNameValue != "") {
            formContext.getControl("jobtitle").setVisible(true)
        } else {
            formContext.getControl("jobtitle").setVisible(false)
        }
    }
}