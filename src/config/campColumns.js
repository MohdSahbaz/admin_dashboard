// All columns in your table (keep this list in same order as DB)
// MASTER DOCTOR COLUMNS (common for both DBs)
const masterCampColumns = [
  // "id",
  "dr_code",
  "plandate",
  "plantime",
  "location",
  "state",
  "city",
  "plantype",
  "statuscode",
  "assignto",
  "remark",
  "approveby",
  "approvon",
  "createdby",
  "createdon",
  "modifyby",
  "modifyon",
  "isactive",
  "longitude",
  "latitude",
  "hq",
  "attendedby",
  "epochdate",
  "planwith",
  "exit_approveby",
  "exit_approvon",
  "strips_used",
];

// SELECTED DOCTOR COLUMNS FOR D2C DB
const selectedCampD2CDbColumns = [...masterCampColumns];

// SELECTED DOCTOR COLUMNS FOR LLOYD DB
const selectedCampLloydDbColumns = [...masterCampColumns];

export {
  masterCampColumns,
  selectedCampD2CDbColumns,
  selectedCampLloydDbColumns,
};
