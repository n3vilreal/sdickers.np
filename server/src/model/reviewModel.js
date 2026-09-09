const knex = require("../database/knex");

const all = () =>
  knex("reviews")
    .join("users", "reviews.user_id", "users.id")
    .select(
      "reviews.id",
      "reviews.stars",
      "reviews.review_text",
      "reviews.created_at",
      "users.user_name",
      "users.id as user_id"
    )
    .orderBy("reviews.created_at", "desc");

const create = (data) => knex("reviews").insert(data).returning("*");

const findByUser = (userId) =>
  knex("reviews").where({ user_id: userId }).orderBy("created_at", "desc");

const averageStars = async () => {
  const [row] = await knex("reviews").avg({ avg: "stars" }).count({ count: "*" });
  return {
    average: Number(row?.avg || 0),
    total: Number(row?.count || 0),
  };
};

module.exports = { all, create, findByUser, averageStars };
