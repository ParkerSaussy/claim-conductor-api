import { Sequelize as _Sequelize, DataTypes } from 'sequelize';

export default class Sequelize {
    constructor(dbConnectionString) {
        this.sequelize = new _Sequelize(dbConnectionString, { logging: false }); // Disabling logging since it's a ton of clutter

        // Test the connection - this statement is superfluous otherwise
        this.sequelize.authenticate().then(() => {
            console.log('Connection to MariaDB been established successfully.');
            console.log('\n'); // Newline for readability in console 
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });

        /* 
        ////////////////////////////////////////////////////////
        ////////////////////  DEFINE TABLES ////////////////////
        ////////////////////////////////////////////////////////
        */

        const Person = this.sequelize.define('Person', {
            person_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            timestamps: false,
        });

        // Sync the database with the models
        this.sequelize.sync({ alter: true }).then((res, err) => {
            if (!err) console.log('MariaDB schema updated successfully.')
            else console.log(err)
        });
    }
}