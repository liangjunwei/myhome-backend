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
];

const images = [
    {
        listingId: 1,
        name: 'bc4c578127d740d10fcd8b5a049bdf506d931552e6dba5ef4820212365283f21'
    },
    {
        listingId: 1,
        name: '37cd2abeedaa66613a11020cc170fd7cbc4095213969c89796b84bf6efbb6091'
    },
    {
        listingId: 1,
        name: '4fb7b7b2d86b89094ee763fa2ce32949147ec0cba223531410796a230b59b1d6'
    },
    {
        listingId: 1,
        name: 'e59b4e2e21606b3e69e9b55a826a73bf33fddc2897a9b703cba2c1bb6322e33e'
    },
    {
        listingId: 1,
        name: 'e63b6a02cefa81f67f65ef140e45197dd275a857da0dc43936fbca1ffdeca2ee'
    },
    {
        listingId: 2,
        name: 'c0db72b1fae814a768945841f1209e33278e1f5584d1a7819f5e353414008b75'
    },
    {
        listingId: 2,
        name: '2c397e476e999b2ae6f191c5e26e283b9a41860d8a60cbc8a9188716493e8441'
    },
    {
        listingId: 2,
        name: '556ec1134cbc376a4c3eb4b43c7f9c65c31bb816dc2dfe104ccbb8b3edc5122f'
    },
    {
        listingId: 2,
        name: '4fdd043b115b7b115f583a2916c4e016b1ed9bd7532375d202b21d7e999d32ae'
    },
    {
        listingId: 2,
        name: '5b9bf8c43619aefe860d641b324123f33138a5a685ae62e088caddfc7144d11b'
    },
    {
        listingId: 3,
        name: '130c694ed45cbfa7d04a8d17cd4902a7c206837dbd139ec060d51ba85871995e'
    },
    {
        listingId: 3,
        name: 'b505ffa370d1af823e005111db5a3bbfb702b62878af9f645ff0ee857f627957'
    },
    {
        listingId: 3,
        name: '51fb5d372cb294219e2355f0c00998104d2a0d52b6ea063ebfb559ca50e9fb6f'
    },
    {
        listingId: 3,
        name: 'c51dd08996890b49d2e7e70b44e1857fd80fcb1469434a42f1f5788bfd1b560d'
    },
    {
        listingId: 3,
        name: 'e1c76fc980625a39c47629ebb7475ef57840807944b603d9f73ea1a90709db7c'
    },
    {
        listingId: 3,
        name: 'ed7d0d1fe754d1fd9e8cb57cdf728530a04b81ef24bc34e63c99c3254f7629b6'
    },
    {
        listingId: 4,
        name: '28cfed8092c3cf5a754d913f6235fcea280ffe9ac63af79d23ca21c99acb8bf1'
    },
    {
        listingId: 4,
        name: '5de29a814840e2d7aacdc663492780c18383e01c060fd46e86a5c443a0c8f876'
    },
    {
        listingId: 4,
        name: '71990da8772ba532f20bfcd591c192d887888b50bfdc28a20b5936248bfa9a8f'
    },
    {
        listingId: 4,
        name: 'ba467dbe0f8bd800f9e6426d3f4563cdf29bf04305b8840023b9f5e1b70196ed'
    },
    {
        listingId: 4,
        name: 'f52e4fb1425dc8dcbc6f76d3c8729d658235abce87b39787cf135f873743e38c'
    }
];

export {
    admins,
    users,
    types,
    listings,
    images
}