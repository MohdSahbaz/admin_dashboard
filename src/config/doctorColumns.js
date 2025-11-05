// All columns in your table (keep this list in same order as DB)
// MASTER DOCTOR COLUMNS (common for both DBs)
const masterDocColumns = [
  "division",
  "dr_code",
  "dr_name",
  "category",
  "speciality",
  "qualification",
  "dr_city_clinic",
  "state",
  "sms_code",
  "bh_code",
  "bh_name",
  "email_id",
  "pan_no",
  "dob",
  "doa",
  "no_patients",
  "clinic_add_1",
  "clinic_add_2",
  "clinic_add_3",
  "clinic_state",
  "clinic_pin_code",
  "clinic_ph_no",
  "mobile_no",
  "resi_add_1",
  "resi_add_2",
  "resi_add_3",
  "resi_state",
  "resi_city",
  "resi_pin_code",
  "resi_ph_no",
  "category_1",
  "category_2",
  "category_3",
  "city_type",
  "created_date",
  "created_by",
  "status",
  "valid_upto",
  "registration_no",
  "dr_add_date",
  "div_additional_category_1",
  "div_additional_category_2",
  "div_additional_category_3",
  "div_addition_cat_1",
  "div_addition_cat_2",
  "div_addition_cat_3",
];

// SELECTED DOCTOR COLUMNS FOR D2C DB
const selectedDocD2CDbColumns = ["doctor_code", "division"];

// SELECTED DOCTOR COLUMNS FOR LLOYD DB
const selectedDocLloydDbColumns = ["doctor_code", "division", "dr_type"];

export { masterDocColumns, selectedDocD2CDbColumns, selectedDocLloydDbColumns };
