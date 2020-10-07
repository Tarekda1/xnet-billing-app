const userAccParser = (userAccsArray) => {
  if (
    !userAccsArray ||
    typeof userAccsArray !== "object" ||
    !(userAccsArray instanceof Array)
  ) {
    throw new Error("Invalid data type, expected an array");
  }

  const parsedObjArray = [];
  userAccsArray.forEach((element) => {
    let userAcc = {
      userName: element[0],
      firstName: element[1],
      lastName: element[2],
      email: element[3],
      password: element[4].toString(),
      package: element[5],
      address: element[6],
      phoneNumber: element[7].toString(),
    };
    parsedObjArray.push(userAcc);
  });
  return parsedObjArray;
};

export { userAccParser };
