const { model } = require("mongoose");
const pagged = require("../_common/pagged");

class ISPUsersRepository {
  constructor(db) {
    this.db = db;
    this.pageSizeGlobal = 50;
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
    console.log(paged);
    let normalized = paged.map((x) => {
      // console.log(x);
      return this.normalizeAccountDetails(x, true);
    });
    const count = await this.db.User.count();
    const pageResult = new pagged(
      normalized,
      page,
      totalPages,
      users.length,
      count
    );
    return pageResult;
  }

  async getISPUsers({ pageParam, pageSizeParam }) {
    let page = pageParam || 0;
    //get users from db
    const users = await this.db.User.find({ isDeleted: false }).populate(
      "package"
    );
    let pageSize;
    if (users && users.length > 0) {
      pageSize = users.length;
    } else {
      pageSize =
        pageSizeParam || (users && users.length) || this.pageSizeGlobal;
    }

    console.log(`${page}:${pageSize}`);

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
    const count = await this.db.User.count();
    const pageResult = new pagged(
      normalized,
      page,
      totalPages,
      users.length,
      count
    );
    return pageResult;
  }

  async searchRemote(searchTerm) {
    const userAccs = await this.db.UserAccount.aggregate([
      //{ $unwind: '$user' },
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
          userdetails: 5,
          user: 1,
          paid: 2,
          comment: 3,
          amount: 4,
          _id: 6,
          month: { $month: "$billDate" },
          year: { $year: "$billDate" },
        },
      },
      {
        $match: {
          $or: [
            { "userdetails.firstName": new RegExp(`.*${searchTerm}.*`, "i") },
            { "userdetails.lastName": new RegExp(`.*${searchTerm}.*`, "i") },
          ],
        },
      },
    ]);

    console.log(userAccs);
    if (!userAccs) throw "User account not found";
    const normalized = userAccs.map((x) => {
      return this.normalizeAccountDetails(x, true);
    });
    const count = await this.db.UserAccount.count();
    const pageResult = new pagged(
      normalized,
      0,
      userAccs.length,
      normalized.length,
      count
    );
    return pageResult;
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
