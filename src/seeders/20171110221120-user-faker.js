const faker = require('faker');

module.exports = {
    up: (queryInterface) => {
        const users = [];
        for (let i = 0; i < 100; i++) {
            users.push({
                uid: faker.random.uuid(),
                username: faker.internet.userName(),
                birthday: faker.date.past(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
                avatar: faker.image.avatar(),
                role_id: faker.random.number({ min: 1, max: 3 }),
                is_active: faker.random.boolean(),
                created_at: faker.date.past(),
                updated_at: faker.date.past(),
            });
        }
        return queryInterface.bulkInsert('users', users, {});
    },
    down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
