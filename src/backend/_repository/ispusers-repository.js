export default class ISPUsers {
  constructor(db) {
    this.db = db;
  }

  async getISPUsers({ date, page, pageSize }) {
    //force get bill for current month
    let paramDate = params.date || new Date();

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
      // {
      //   $limit: limitPerPage,
      // },
    ]);
    const offset = page * pageSize,
      paged = users.slice(offset, offset + pageSize),
      totalPages = Math.floor(users.length / pageSize),
      result = {
        items: paged,
        currentPage: page,
        numberOfPages: totalPages,
        totalNumberOfItems: users.length,
      };
    return users.map((x) => {
      console.log(x);
      return this.normalizeAccountDetails(x, true);
    });
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
