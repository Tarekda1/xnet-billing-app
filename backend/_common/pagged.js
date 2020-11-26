module.exports = class pagged {
  constructor(
    items,
    page,
    totalpagesCount,
    totalItemsCount,
    originalItemCount
  ) {
    this.items = items;
    this.page = page;
    this.totalpagesCount = totalpagesCount;
    this.totalItemsCount = totalItemsCount;
    this.originalItemCount = originalItemCount || 0;
  }
};
