/**
 * Paginate a model
 * @param {*} model model to add pagination to
 * @returns {function(*=, *=, *=)} json object response
 */
const paginate = (model) => async (page, limit, options = {}) => {
  limit = parseInt(limit, 10) || 10;
  const p = parseInt(page, 10) || 1;
  const offset = (p - 1) * limit;
  let result = await model.findAndCountAll({
    ...options,
    offset,
    limit,
  });
  const numberOfPages = Math.ceil(result.count / limit) || 1;
  result = {
    results: result.rows,
    item_count: result.rows.length,
    page: p,
    limit,
    total: result.count,
    number_of_pages: numberOfPages,
  };
  if (p > 1) {
    result.previous_page = p <= numberOfPages ? p - 1 : numberOfPages;
  }
  if (p < numberOfPages) result.next_page = p + 1;
  return result;
};

export default {
  paginate,
};
