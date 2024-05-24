import { Sequelize as _Sequelize, DataTypes } from 'sequelize';

export default class Sequelize {
    constructor(dbConnectionString) {
        // I always disable logging here since it's a ton of clutter
        this.sequelize = new _Sequelize(dbConnectionString, { logging: false }); 

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

        // Sequelize will include this regardless of whether or not we invoke it later here
        const Person = this.sequelize.define('Person', {
            id: { // MariaDB's needs its own auto-incrementing ID for indexing. There's a way to remove it but it's not recommended.
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            person_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            timestamp: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            timestamps: false,
            indexes: [
                {   //... So instead, we manually index by person_id
                    unique: true,
                    fields: ['person_id']
                }
            ]
        });

        // ADDING FOR V2 (copy-pasted)
        const Action = this.sequelize.define('Action', {
            id: { // MariaDB's needs its own auto-incrementing ID for indexing. There's a way to remove it but it's not recommended.
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            person_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            timestamp: {
                type: DataTypes.STRING,
                allowNull: false
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            timestamps: false,
            indexes: [
                {   //... So instead, we manually index by person_id
                    unique: true,
                    fields: ['person_id', 'timestamp']
                }
            ]
        });

        // Sync the database with the models
        this.sequelize.sync({ alter: true }).then((res, err) => {
            if (!err) console.log('MariaDB schema updated successfully.')
            else console.log(err)
        });
    }
}