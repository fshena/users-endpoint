

const faker = require('faker');

module.exports = {
    up: (queryInterface) => {
        const players = [];
        for (let i = 1; i < 100; i++) {
            players.push({
                user_id: i,
                height: faker.random.number({ min: 150, max: 190 }),
                weight: faker.random.number({ min: 50, max: 100 }),
                created_at: faker.date.past(),
                updated_at: faker.date.past(),
            });
        }
        return queryInterface.bulkInsert('player', players, {});
    },
    down: queryInterface => queryInterface.bulkDelete('player', null, {}),
};
