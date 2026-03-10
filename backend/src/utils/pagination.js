/**
 * Parse pagination params from query string.
 * @param {object} query - req.query
 * @param {number} defaultLimit - default items per page (default 20, max 100)
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query, defaultLimit = 20) => {
    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = defaultLimit;
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

module.exports = { parsePagination };
