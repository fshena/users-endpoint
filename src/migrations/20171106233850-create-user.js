module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        uid: {
            allowNull: false,
            type: Sequelize.STRING(100),
            unique: true
        },
        username: {
            type: Sequelize.STRING(100),
            allowNull: true,
            unique: true,
            defaultValue: null
        },
        birthday: {
            type: Sequelize.DATEONLY,
            allowNull: true,
            defaultValue: null,
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        last_name: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        avatar: {
            type: Sequelize.STRING(500),
            allowNull: true,
            defaultValue: null,
        },
        role_id: {
            type: Sequelize.INTEGER(5),
            allowNull: false,
            defaultValue: 0,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),
    down: queryInterface => queryInterface.dropTable('users'),
};
