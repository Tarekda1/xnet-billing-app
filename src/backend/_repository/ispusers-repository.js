const { model } = require('mongoose');
const pagged = require('../_common/pagged');

class ISPUsersRepository {
	constructor(db) {
		this.db = db;
	}

	async getISPUsers({ date, pageParam, pageSizeParam }) {
		let page = pageParam || 0;
		let pageSize = pageSizeParam || 2;
		//force get bill for current month
		let paramDate = date || new Date();
		// console.log(this.db);
		// console.log(paramDate);

		const users = await this.db.UserAccount.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'userdetails'
				}
			},
			{
				$project: {
					user: 1,
					paid: 2,
					comment: 3,
					amount: 4,
					userdetails: 5,
					_id: 6,
					month: { $month: '$billDate' },
					year: { $year: '$billDate' }
				}
			},
			{
				$match: {
					month: paramDate.getMonth() + 1,
					year: paramDate.getFullYear()
				}
			}
			// {
			//   $limit: limitPerPage,
			// },
		]);
		//console.log(users);
		const offset = page * pageSize,
			paged = users.slice(offset, offset + pageSize),
			totalPages = Math.floor(users.length / pageSize) == 0 ? 1 : Math.floor(users.length / pageSize);

		let normalized = paged.map((x) => {
			// console.log(x);
			return this.normalizeAccountDetails(x, true);
		});
		const pageResult = new pagged(normalized, page, totalPages, users.length);
		return pageResult;
	}

	normalizeAccountDetails(userAccount, fromAggregate) {
		//console.log(userAccount);
		if (fromAggregate) {
			const {
				userdetails: [ { firstName, lastName, phoneNumber, _id: userId } ],
				amount,
				comment,
				paid,
				month,
				year,
				_id: id
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
				id
			};
		} else {
			const {
				user: { firstName, lastName, phoneNumber, id: userId },
				amount,
				comment,
				paid,
				billDate,
				id
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
				id
			};
		}
	}
}

module.exports = ISPUsersRepository;
