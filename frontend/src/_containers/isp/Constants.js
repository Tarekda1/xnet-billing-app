export const Options = [
  { key: "edit", icon: "edit", text: "Edit User", value: "edit" },
  { key: "delete", icon: "delete", text: "Remove User", value: "delete" },
];

export const HeaderListTemplate = [
  "Username",
  "First Name",
  "Last Name",
  "Email",
  "Password",
  "Address",
  "Phone Number",
];

export const searchKey = {
  user: { search: "user", fetch: "userFetch" },
  userAcc: { search: "userAcc", fetch: "userAccFetch" },
};
