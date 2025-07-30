export var AddStatus;
(function (AddStatus) {
    AddStatus[AddStatus["Full"] = 0] = "Full";
    AddStatus[AddStatus["Add"] = 1] = "Add";
    AddStatus[AddStatus["Wait"] = 2] = "Wait";
})(AddStatus || (AddStatus = {}));
export var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Failure"] = 0] = "Failure";
    ResponseStatus[ResponseStatus["Confirmation"] = 1] = "Confirmation";
    ResponseStatus[ResponseStatus["Accomplishment"] = 2] = "Accomplishment";
    ResponseStatus[ResponseStatus["Neutral"] = 3] = "Neutral";
    ResponseStatus[ResponseStatus["None"] = 4] = "None";
})(ResponseStatus || (ResponseStatus = {}));
export var FlagState;
(function (FlagState) {
    FlagState["PREFILLED"] = "prefilled";
    FlagState["RECHECK"] = "recheck";
})(FlagState || (FlagState = {}));
