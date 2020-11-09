const { model } = require("mongoose");
const pagged = require("../_common/pagged");

class ISPUsersRepository {
  constructor(db) {
    this.db = db;
    this.pageSizeGlobal = 3;
  }

  async getISPUsersAccounts({ date, pageParam, pageSizeParam }) {
    let page = pageParam || 0;
    let pageSize = pageSizeParam || this.pageSizeGlobal;
    //force get bill for current month
    let paramDate = date || new Date();
    const users = await this.db.UserAccount.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $project: {
          user: 1,
          paid: 2,
          comment: 3,
          amount: 4,
          userdetails: 5,
          _id: 6,
          month: { $month: "$billDate" },
          year: { $year: "$billDate" },
        },
      },
      {
        $match: {
          month: paramDate.getMonth() + 1,
          year: paramDate.getFullYear(),
        },
      },
    ]);
    const offset = page * pageSize,
      paged = users.slice(offset, offset + pageSize),
      totalPages =
        Math.floor(users.length / pageSize) == 0
          ? 1
          : Math.floor(users.length / pageSize);

    let normalized = paged.map((x) => {
      // console.log(x);
      return this.normalizeAccountDetails(x, true);
    });
    const pageResult = new pagged(normalized, page, totalPages, users.length);
    return pageResult;
  }

  async getISPUsers({ pageParam, pageSizeParam }) {
    let page = pageParam || 0;
    let pageSize = pageSizeParam || this.pageSizeGlobal;
    console.log(`${page}:${pageSize}`);
    //get users from db
    const users = await this.db.User.find({ isDeleted: false }).populate(
      "package"
    );
    //set up offset and total pages
    const offset = page * pageSize,
      paged = users.slice(offset, offset + pageSize),
      totalPages =
        Math.ceil(users.length / pageSize) == 0
          ? 1
          : Math.ceil(users.length / pageSize);

    let normalized = paged.map((x) => {
      return this.normalizeBasicDetails(x, true);
    });
    console.log(users.length);
    console.log(pageSize);
    console.log(Math.ceil(users.length / pageSize));
    const pageResult = new pagged(normalized, page, totalPages, users.length);
    return pageResult;
    //return users.map((x) => basicDetails(x));
  }

  normalizeBasicDetails(user) {
    // console.log(JSON.stringify(user));
    return user;
    // const {
    //   id,
    //   firstName,
    //   lastName,
    //   email,
    //   phoneNumber,
    //   address,
    //   isUserActive,
    //   created,
    //   updated,
    //   package,
    //   userName,
    //   password,
    // } = user;
    // return {
    //   id,
    //   firstName,
    //   lastName,
    //   email,
    //   phoneNumber,
    //   address,
    //   isUserActive,
    //   created,
    //   updated,
    //   package,
    //   userName,
    //   password,
    // };
  }

  normalizeAccountDetails(userAccount, fromAggregate) {
    //console.log(userAccount);
    if (fromAggregate) {
      const {
        userdetails: [{ firstName, lastName, phoneNumber, _id: userId }],
        amount,
        comment,
        paid,
        month,
        year,
        _id: id,
      } = userAccount;
      return {
        firstName,
        lastName,
        phoneNumber,
        amount,
        comment,
        paid,
        billDate: `${year}-${month}-01`,
        userId,
        id,
      };
    } else {
      const {
        user: { firstName, lastName, phoneNumber, id: userId },
        amount,
        comment,
        paid,
        billDate,
        id,
      } = userAccount;
      return {
        firstName,
        lastName,
        phoneNumber,
        amount,
        comment,
        paid,
        billDate,
        userId,
        id,
      };
    }
  }
}

module.exports = ISPUsersRepository;
