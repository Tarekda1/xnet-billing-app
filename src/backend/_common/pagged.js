module.exports = class pagged {
	constructor(items, page, totalpagesCount, totalItemsCount) {
		this.items = items;
		this.page = page;
		this.totalpagesCount = totalpagesCount;
		this.totalItemsCount = totalItemsCount;
	}
};
