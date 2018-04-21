
module.exports = (sequelize, DataTypes) => {
    const player = sequelize.define('Player', {
        user_id: {
            allowNull: false,
            unique: true,
            type: DataTypes.INTEGER(15),
            validate: {
                isNumeric: true,
            },
        },
        height: {
            type: DataTypes.INTEGER(3),
            allowNull: true,
            defaultValue: null,
            validate: {
                isInt: true,
                max: 300,
            },
        },
        weight: {
            type: DataTypes.INTEGER(3),
            allowNull: true,
            defaultValue: null,
            validate: {
                isInt: true,
                max: 300,
            },
        },
    }, {
        freezeTableName: true,
        tableName: 'player',
        underscored: true,
    });

    player.associate = (models) => {
        player.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return player;
};
