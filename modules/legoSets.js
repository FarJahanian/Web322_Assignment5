require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});

const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    num_parts: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    theme_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    img_url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            console.log("Database synchronized");
            resolve();
        }).catch((err) => {
            console.error("Error synchronizing database:", err);
            reject(err);
        });
    });
}

function getAllSets() {
    return Set.findAll({ include: [Theme] });
}

function getSetByNum(setNum) {
    return Set.findOne({ where: { set_num: setNum }, include: [Theme] });
}

function getSetsByTheme(theme) {
    return Set.findAll({
        include: [Theme],
        where: {
            '$Theme.name$': {
                [Sequelize.Op.iLike]: `%${theme}%`
            }
        }
    });
}

module.exports = {
    initialize,
    getAllSets,
    getSetByNum,
    getSetsByTheme
};
