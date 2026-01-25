const Sequelize = require("sequelize");
const connection = require("../database/database")

const Article = sequelize.Define(
    'Article',
    {
        title:{
            type: Sequelize.STRING,
            allowNull: false
        },
        slug:{
            type: Sequelize.STRING,
            allowNull: false
        },
        body:{
            type: Sequelize.TEXT,
            allowNull: false
        }
    }
)

module.exports = Article;