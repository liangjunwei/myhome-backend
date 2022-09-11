const admins = [
    {
        username: 'admin1',
        password: 'adminpassword1',
        isAdmin: true
    },
    {
        username: 'admin2',
        password: 'adminpassword2',
        isAdmin: true
    },
    {
        username: 'admin3',
        password: 'adminpassword3',
        isAdmin: true
    }
];

const users = [
    {
        username: 'user1',
        password: 'userpassword1'
    },
    {
        username: 'user2',
        password: 'userpassword2'
    },
    {
        username: 'user3',
        password: 'userpassword3'
    }
];

const types = ['Apartment', 'Single House', 'Town House'];

const listings = [
    {
        address: '1622 Armbrester Drive, Burbank, CA 91505',
        typeId: 1,
        price: 1500,
        bedrooms: 2,
        bathrooms: 1,
        size: 1000,
        parking: 0,
        pets: false,
        userId: 5
    },
    {
        address: '201 Elmwood Avenue, Superstition, AZ 85220',
        typeId: 3,
        price: 2000,
        bedrooms: 2,
        bathrooms: 1,
        size: 1200,
        parking: 2,
        pets: true,
        userId: 4
    },
    {
        address: '1475 Deans Lane, Pleasantville, NY 10570',
        typeId: 2,
        price: 3000,
        bedrooms: 3,
        bathrooms: 2,
        size: 2500,
        parking: 1,
        pets: false,
        userId: 5
    },
    {
        address: '3888 Delaware Avenue, San Francisco, CA 94108',
        typeId: 1,
        price: 1000,
        bedrooms: 1,
        bathrooms: 1,
        size: 900,
        parking: 1,
        pets: true,
        userId: 6
    }
]

export {
    admins,
    users,
    types,
    listings
}