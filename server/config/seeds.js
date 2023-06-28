const db = require('./connection');
const { faker } = require('@faker-js/faker');

const { User, Service, Category, Listing, Purchase } = require('../models');

db.once('open', async () => {
  await Category.deleteMany();
  await Service.deleteMany();
  await User.deleteMany();
  await Purchase.deleteMany();

  const categories = await Category.insertMany([
    { name: 'Dog Care' },
    { name: 'Landscaping' },
    { name: 'House Cleaning' },
    { name: 'Renovations' },
    { name: 'Web Development' },
    { name: 'Appliance Repair' },
    { name: 'Physical Therapy' },
    { name: 'Photography' }
  ]);

  console.log('Categories seeded');

  const users = [
    {
      username: 'Pamela',
      email: 'pamela@testmail.com',
      password: 'password12345',
    },
    {
      username: 'Elijah',
      email: 'eholt@testmail.com',
      password: 'password12345',
    },
  ];

  const createdUsers = await User.insertMany(users);

  console.log('Users seeded');

  const services = [];

  for (let i = 0; i < 20; i++) {
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomCategoryIndex];
    const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
    const randomUser = createdUsers[randomUserIndex];

    const service = {
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      category: randomCategory._id,
      user: randomUser._id,
      options: [
        {
          title: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price(0.99, 100)
        },
        {
          title: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price(0.99, 100)
        }
      ],
      images: [
        { url: faker.image.imageUrl() },
        { url: faker.image.imageUrl() }
      ],
      location: {
        address: faker.address.streetAddress(), // Add the address field with a valid value
        type: 'Point',
        coordinates: [faker.address.longitude(), faker.address.latitude()]
      }
    };

    services.push(service);
  }

  const createdServices = await Service.insertMany(services);

  console.log(`${createdServices.length} services seeded`);  

 

const purchases = [];

for (let user of createdUsers) {
  for (let service of createdServices) {
    const randomOptionIndex = Math.floor(Math.random() * service.options.length);
    const randomOption = service.options[randomOptionIndex];
    const randomQuantity = faker.datatype.number({ min: 1, max: 5 });
    const randomTotal = randomQuantity * randomOption.price;
    const randomDate = faker.date.future();
    const purchaseStatus = 'completed';

    const option = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 10, max: 100 })
    };

    const purchase = {
      service: service._id,
      user: user._id,
      option: option,
      quantity: randomQuantity,
      total: randomTotal,
      date: randomDate,
      status: purchaseStatus,
    };

    purchases.push(purchase);
  }
}

const createdPurchases = await Purchase.insertMany(purchases);

console.log(`${createdPurchases.length} purchases seeded`);

process.exit();
});