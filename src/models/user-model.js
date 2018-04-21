

/**
 * Id primary key is created automatically
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @return {void|Model|*}
 */
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('User', {
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
            validate: {
                is: ['^[a-zA-Z0-9-_.]+$', 'i'],
                len: [3, 100],
                notEmpty: true,
            },
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: true,
            },
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
            },
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
            validate: {
                is: ['^[a-zA-Z]+$', 'i'],
                maxLength: 100
            },
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
            validate: {
                is: ['^[a-zA-Z]+$', 'i'],
                maxLength: 100
            },
        },
        avatar: {
            type: DataTypes.STRING(500),
            allowNull: true,
            defaultValue: null,
            validate: {
                isUrl: true,
            },
        },
        role_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true,
                notEmpty: true,
            },
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                isBoolean: true,
                notEmpty: true,
            },
        },
    }, {
        freezeTableName: true, // does not use plural table name
        tableName: 'users', // define the table name
        underscored: true, // use underscore for createAt, updatedAt
    });

    user.associate = (models) => {
        user.hasOne(models.Player, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
    };

    return user;
};
