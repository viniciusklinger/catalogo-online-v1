const CustomData = {
    number: '5542998663675',
    zapNumber: '5542998663675',
    zapHelpText: 'Olá! Sobre o cardápio online, gostaria de saber se...',
    storeLatLng: { lat: -25.109664656607833, lng: -50.12425511392971, radius: 120 },
    mapsMagLink: 'https://maps.app.goo.gl/mPvKa5kHPQwQCMGJ6',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14452.459292524647!2d-50.1647936!3d-25.0979742!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e81b6fb9b32d23%3A0x9c8c7fb1e16dda09!2sHot%20Rod%20Burguer!5e0!3m2!1spt-BR!2sbr!4v1696199264211!5m2!1spt-BR!2sbr',
    address: ['Rua Siqueira Campos, 1806, Uvaranas', 'Ponta Grossa - PR, 84031-030', ''],
    deliveryFees: {
        6: 1.8,
        10: 1.7,
        15: 1.4,
        999: 1.3,
    },
};

const Depoimentos = [
    {
        name: 'Diego Pereira',
        value: 4.5,
        text: 'Muito bom, recomendo demais! Comida muito bem feita pelo chefe, atendimento dentro dos parâmetros e boa comunicação com o cliente.',
        path: './imgs/diego.webp',
    },
    {
        name: 'Ana Beatriz',
        value: 5,
        text: 'Um jantar perfeito do começo ao fim... foi tão maravilhoso que fomos dois dias seguidos - fato inédito para mim em uma viagem!',
        path: './imgs/ana.webp',
    },
    {
        name: 'João Guilherme',
        value: 4.5,
        text: 'A comida estava excelente e o serviço gentil nos surpreendeu! Dica: reserve umas 3 horas para ter uma experiência incrível.',
        path: './imgs/joao.webp',
    }
];

const MenuLoja = {
    "churrasco": [
        {
            "id": "ribs-brisket-and-burnt-ends",
            "img": "./imgs/cardapio/churrasco/joes-kc-ribs-brisket-and-burnt-ends.6710e994980e485e6441b794717ad6fb.jpg",
            "name": "Joe's KC BBQ",
            "dsc": "Joe's KC Ribs, Brisket and Burnt Ends",
            "price": 110.99,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "005-kings-carolina-oink-sampler",
            "img": "./imgs/cardapio/churrasco/carolina-bbq-oink-sampler.1340b5a10cedc238cb2280306dd1d5a5.jpg",
            "name": "Kings BBQ",
            "dsc": "Carolina BBQ Oink Sampler",
            "price": 89,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "texas-monthlys-1-bbq-brisket",
            "img": "./imgs/cardapio/churrasco/texas-monthlys-1-bbq-brisket.1006a061be7acae03992e420fbca995a.jpg",
            "name": "Snow's BBQ",
            "dsc": "Texas Monthly's #1 BBQ Brisket",
            "price": 199,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "whole-brisket-texas-bbq-sauce",
            "img": "./imgs/cardapio/churrasco/whole-brisket-texas-barbecue-bbq-sauce.e07ee4818b20ed43d217bf67fedd41ce.jpg",
            "name": "Franklin Barbecue",
            "dsc": "Whole Brisket + Texas Barbecue BBQ Sauce",
            "price": 249,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "whole-texas-smoked-brisket",
            "img": "./imgs/cardapio/churrasco/whole-texas-smoked-brisket.a5558a25381e271408e197936e7985d8.jpg",
            "name": "Terry Black's Barbecue",
            "dsc": "Whole Texas Smoked Brisket",
            "price": 189,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "mini-trinity-bbq-combo-brisket-ribs-and-links",
            "img": "./imgs/cardapio/churrasco/mini-trinity-bbq-combo-brisket-ribs-and-links.245582f593bf64b23b57dfca2be18cfd.jpg",
            "name": "Bludso's BBQ",
            "dsc": "Mini Trinity BBQ Combo - Brisket, Ribs and Links",
            "price": 139,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "235203-blue-smoke-baby-back-ribs-backyard-barbecue-chicken-combo",
            "img": "./imgs/cardapio/churrasco/blue-smoke-baby-back-ribs-backyard-barbecue-chicken-combo.a95a3e632ae324f719738a2a5c1dff6e.jpg",
            "name": "Blue Smoke",
            "dsc": "Blue Smoke Baby Back Ribs + Backyard Barbecue Chicken Combo",
            "price": 129,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "006-kings-meat-lovers-special",
            "img": "./imgs/cardapio/churrasco/bbq-meat-lovers-special-for-10.36ca670fda4bfa783c2ea9165e068d26.jpg",
            "name": "Kings BBQ",
            "dsc": "BBQ Meat Lovers Special for 10",
            "price": 139,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "the-big-ugly-bbq-dinner-for-6",
            "img": "./imgs/cardapio/churrasco/the-big-ugly-bbq-dinner-for-6.2dfae7818811adddce85cc1a910881a0.jpg",
            "name": "Ugly Drum",
            "dsc": "The Big Ugly BBQ Dinner for 6",
            "price": 229,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "17796-mighty-quinns-bbq-sampler-pack",
            "img": "./imgs/cardapio/churrasco/mighty-quinns-bbq-sampler-pack.1bfe4a0665edc565756f5241bf25840e.jpg",
            "name": "Mighty Quinn's BBQ",
            "dsc": "Mighty Quinn's BBQ Sampler Pack",
            "price": 169,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "post-oak-smoked-half-brisket",
            "img": "./imgs/cardapio/churrasco/post-oak-smoked-usda-prime-half-brisket.6f17178dde7d806670bcc73ff11762b3.jpg",
            "name": "Southside Market and Barbeque",
            "dsc": "Post Oak Smoked USDA Prime Half Brisket",
            "price": 109,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        },
        {
            "id": "best-of-texas-bbq-combo-serves-14",
            "img": "./imgs/cardapio/churrasco/best-of-texas-bbq-combo-serves-14.7ae90266335e539c67e77fed14b43029.jpg",
            "name": "Snow's BBQ",
            "dsc": "Best of Texas BBQ Combo - Serves 14",
            "price": 269,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"]
        }
    ],
    "burgers": [
        {
            "id": "the-gramercy-tavern-burger-4-pack",
            "img": "./imgs/cardapio/burguers/Gramercy-Tavern-Burger-and-Kielbasa-Kit-6.4.21-72ppi-1x1-15.jpg",
            "name": "Gramercy Tavern 1",
            "dsc": "The Gramercy Tavern Burger - 4 Pack",
            "price": 20,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz"],
        },
        {
            "id": "shake-shack-shackburger-8-pack",
            "img": "./imgs/cardapio/burguers/shake-shack-shackburger-8-pack.973a5e26836ea86d7e86a327becea2b0.jpg",
            "name": "Shake Shack 2",
            "dsc": "Shake Shack ShackBurger® - 8 Pack",
            "price": 22,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Queijo cheddar", "Ingrediente super secreto e super longo", "Alface", "Tomate",],
        },
        {
            "id": "gotts-cheeseburger-kit-for-4",
            "img": "./imgs/cardapio/burguers/gotts-complete-cheeseburger-kit-for-4.7bdc74104b193427b3fe6eae39e05b5e.jpg",
            "name": "Gott's Roadside 3",
            "dsc": "Gott's Complete Cheeseburger Kit for 4",
            "price": 18,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Cheddar", "Ovos", "Cebola roxa", "Orégano", "Alface", "Tomate", "ing", "ing", "ing"],
        },
        {
            "id": "le-big-matt-kit-for-6",
            "img": "./imgs/cardapio/burguers/le-big-matt-kit-for-6.1ddae6e382bb3218eeb0fd5247de115a.jpg",
            "name": "Emmy Squared 4",
            "dsc": "Le Big Matt Burger Kit for 6",
            "price": 24,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "shake-shack-shackburger-16-pack",
            "img": "./imgs/cardapio/burguers/shake-shack-shackburger-16-pack.316f8b09144db65931ea29e34869287a.jpg",
            "name": "Shake Shack 5",
            "dsc": "Shake Shack Shackburger® - 16 Pack",
            "price": 22.9,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "21-usda-prime-burgers-pack-of-18-8oz-each",
            "img": "./imgs/cardapio/burguers/usda-prime-burgers-pack-of-18-8oz-each.274c67f15aa1c0b210dbf51801706670.jpg",
            "name": "Peter Luger Steak House 6",
            "dsc": "USDA Prime Burgers - Pack of 18 (8oz each)",
            "price": 28,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "double-stack-burger-kit-for-4",
            "img": "./imgs/cardapio/burguers/handf-double-stack-burger-kit-for-4.4ee9f54b1d6087e9996335f07c13e5cd.jpg",
            "name": "Holeman and Finch 7",
            "dsc": "Double Stack Burger Kit for 4",
            "price": 32.5,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "goldbelly-burger-bash-pack",
            "img": "./imgs/cardapio/burguers/the-burger-bash-package.bd9d12d031865940bbe5faf15f1a62f8.jpg",
            "name": "Pat LaFrieda Meats 8",
            "dsc": "Goldbelly \"Burger Bash\" Pack",
            "price": 20,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "burger-au-poivre-kit-4-pack",
            "img": "./imgs/cardapio/burguers/burger-au-poivre-kit-4-pack.3ca0e39b02db753304cd185638dad518.jpg",
            "name": "Raoul's 9",
            "dsc": "Burger Au Poivre Kit - 4 Pack",
            "price": 20,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "goldbelly-burger-blend-4-lbs",
            "img": "./imgs/cardapio/burguers/goldbelly-burger-blend-1-lb.13a21b66edf7173a59c75c3a6d2f981b.jpg",
            "name": "Flannery Beef 10",
            "dsc": "Goldbelly Burger Blend - 4 lbs.",
            "price": 20,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "gotts-complete-cheeseburger-kit-for-8",
            "img": "./imgs/cardapio/burguers/gotts-complete-cheeseburger-kit-for-8.092aa049d00286fa1733d720decc782e.jpg",
            "name": "Gott's Roadside 11",
            "dsc": "Gott's Complete Cheeseburger Kit for 8",
            "price": 20,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "gramercy-tavern-burger-kielbasa-combo",
            "img": "./imgs/cardapio/burguers/Gramercy-Tavern-Burger-and-Kielbasa-Kit-6.4.21-72ppi-1x1-47.jpg",
            "name": "Gramercy Tavern 12",
            "dsc": "Gramercy Tavern Burger + Kielbasa Combo",
            "price": 22.99,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "gramercy-tavern-burger-kielbasa-combo",
            "img": "./imgs/cardapio/burguers/Gramercy-Tavern-Burger-and-Kielbasa-Kit-6.4.21-72ppi-1x1-47.jpg",
            "name": "Gramercy Tavern 13",
            "dsc": "Gramercy Tavern Burger + Kielbasa Combo",
            "price": 36.99,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "gramercy-tavern-burger-kielbasa-combo",
            "img": "./imgs/cardapio/burguers/Gramercy-Tavern-Burger-and-Kielbasa-Kit-6.4.21-72ppi-1x1-47.jpg",
            "name": "Gramercy Tavern 14",
            "dsc": "Gramercy Tavern Burger + Kielbasa Combo",
            "price": 41,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        },
        {
            "id": "gramercy-tavern-burger-kielbasa-combo",
            "img": "./imgs/cardapio/burguers/Gramercy-Tavern-Burger-and-Kielbasa-Kit-6.4.21-72ppi-1x1-47.jpg",
            "name": "Gramercy Tavern 15",
            "dsc": "Gramercy Tavern Burger + Kielbasa Combo",
            "price": 20,
            "ings": ["Pão de gergilim", "Burguer 250g", "Molho especial", "Ketchup Heinz", "Alface", "Tomate"],
        }
    ],
    "sobremesas": [
        {
            "id": "15259-german-chocolate-killer-brownie-tin-pack",
            "img": "./imgs/cardapio/sobremesas/german-chocolate-killer-brownie-tin-pack.5ebc34160f28767a9d94c4da2e04c4b9.jpg",
            "name": "Killer Brownie®",
            "dsc": "German Chocolate Killer Brownie®",
            "price": 39.99
        },
        {
            "id": "jacques-world-famous-chocolate-chip-cookies",
            "img": "./imgs/cardapio/sobremesas/jacques-world-famous-chocolate-chip-cookies-6-pack.2217a14c443602493bba88aa9335319a.jpg",
            "name": "Jacques Torres Chocolate",
            "dsc": "Jacques' World Famous Chocolate Chip Cookies - 6 Pack",
            "price": 39.95
        },
        {
            "id": "luigis-original-cannoli-pie",
            "img": "./imgs/cardapio/sobremesas/original-cannoli-pie.4cb5b9ba82f57b69b90765fd9f07aa1a.jpg",
            "name": "The Cannoli Pie Company",
            "dsc": "Original Cannoli Pie",
            "price": 69
        },
        {
            "id": "sea-salted-caramel-swirl-cheesecake",
            "img": "./imgs/cardapio/sobremesas/sea-salted-caramel-swirl-cheesecake.e2825335433fb7a272a5d77649a6849e.jpg",
            "name": "Cotton Blues Cheesecake Company",
            "dsc": "Sea-Salted Caramel Swirl Cheesecake",
            "price": 65
        },
        {
            "id": "brooklyn-blackout-cookie-brownie-combo-pack-2-tins",
            "img": "./imgs/cardapio/sobremesas/brooklyn-blackout-cookie-brownie-combo-pack-2-tins.d8805325baf6b23b4f01d119dc4531a7.jpg",
            "name": "Brooklyn Blackout Company",
            "dsc": "Brooklyn Blackout Cookie + Brownie Combo Pack - 2 Tins",
            "price": 89
        },
        {
            "id": "best-seller-cupcake-dozen",
            "img": "./imgs/cardapio/sobremesas/best-seller-cupcake-dozen.f93b21993f6a2da11c975d45b9b0d08f.jpg",
            "name": "Crave Cupcakes",
            "dsc": "Best Seller Cupcake Dozen",
            "price": 89
        },
        {
            "id": "choose-your-own-ice-cream-donuts-6-pack",
            "img": "./imgs/cardapio/sobremesas/choose-your-own-ice-cream-donuts-6-pack.24d0b44765a7c54237fcd7ea9d9d8093.jpg",
            "name": "Elegant Desserts",
            "dsc": "Choose Your Own Ice Cream Donuts - 6 Pack",
            "price": 69
        },
        {
            "id": "17481-jewish-dessert-3-pack",
            "img": "./imgs/cardapio/sobremesas/jewish-classics-dessert-pack.7d4b76630f2fe75dcb7bbcf2501b7390.jpg",
            "name": "Ess-a-Bagel",
            "dsc": "Jewish Classics Dessert Pack",
            "price": 89.95
        },
        {
            "id": "dessert-bar-care-package",
            "img": "./imgs/cardapio/sobremesas/dessert-bar-care-package.324aa28fe98c9dc67b75aac43376902e.jpg",
            "name": "Bread and Roses Bakery",
            "dsc": "Dessert Bar Care Package",
            "price": 65
        },
        {
            "id": "donut-cookies-12-pack",
            "img": "./imgs/cardapio/sobremesas/donut-cookies-12-pack.46f42c61c4a79fd2051a99b2f23e890e.jpg",
            "name": "Stan's Donuts",
            "dsc": "Donut Cookies - 12 Pack",
            "price": 49
        },
        {
            "id": "gulab-jamun-ice-cream-cakes-2-pack",
            "img": "./imgs/cardapio/sobremesas/gulab-jamun-ice-cream-cakes-2-pack.c45b4d0750ad22d741f84dc1f26d20e7.jpg",
            "name": "Malai Ice Cream",
            "dsc": "Gulab Jamun Ice Cream Cakes - 2 Pack",
            "price": 79
        },
        {
            "id": "jacques-world-famous-chocolate-chip-cookies-12-pack",
            "img": "./imgs/cardapio/sobremesas/jacques-world-famous-chocolate-chip-cookies-12-pack.3b373bdd67cd25084182c21499f675d1.jpg",
            "name": "Jacques Torres Chocolate",
            "dsc": "Jacques' World Famous Chocolate Chip Cookies - 12 Pack",
            "price": 69.95
        }
    ],
    "bebidas": [
        {
            "id": "hong-kong-boba-tea-kit-for-6",
            "img": "./imgs/cardapio/bebidas/hong-kong-boba-tea-kit-for-6.63841de36d8e5edfafa13023fc303285.jpg",
            "name": "New Territories",
            "dsc": "Hong Kong Boba Tea Kit for 6",
            "price": 59
        },
        {
            "id": "guys-caliente-margaritas-for-12",
            "img": "./imgs/cardapio/bebidas/guys-caliente-margaritas-for-12.ca8c6bc06b8f1039549385ffcebc749d.jpg",
            "name": "Guy Fieri",
            "dsc": "Guy's Caliente Margaritas for 12",
            "price": 69
        },
        {
            "id": "woodford-reserve-mint-julep-syrup",
            "img": "./imgs/cardapio/bebidas/woodford-reserve-mint-julep-syrup.ef523ac7cbae5f4aba6b058207f490d2.jpg",
            "name": "Woodford Reserve",
            "dsc": "Woodford Reserve Mint Julep Syrup",
            "price": 39
        },
        {
            "id": "new-orleans-hurricane-mix",
            "img": "./imgs/cardapio/bebidas/new-orleans-hurricane-mix.4613584fc65cb0787024dd24d2a8f4b3.jpg",
            "name": "Franco's Hurricane Mix",
            "dsc": "New Orleans Hurricane Mix",
            "price": 39
        },
        {
            "id": "margarita-mix",
            "img": "./imgs/cardapio/bebidas/margarita-mix.bd48a000d589d3147b14790af3c33fcd.jpg",
            "name": "Johnny Sanchez",
            "dsc": "Margarita Mix",
            "price": 59
        },
        {
            "id": "woodford-reserve-mint-julep-syrup-2-pack",
            "img": "./imgs/cardapio/bebidas/woodford-reserve-mint-julep-syrup-2-pack.0ac76063f151988113cbaabd0eaa829f.jpg",
            "name": "Woodford Reserve",
            "dsc": "Woodford Reserve Mint Julep Syrup - 2 Pack",
            "price": 59
        },
        {
            "id": "unicorn-parade-milkshake-kit-for-8",
            "img": "./imgs/cardapio/bebidas/unicorn-parade-milkshake-kit-for-2.9052d04c1cf25b29442048bd3e535f21.jpg",
            "name": "New Territories",
            "dsc": "Unicorn Parade Milkshake Kit for 8",
            "price": 109
        },
        {
            "id": "chickpea-chiller-kit-for-6",
            "img": "./imgs/cardapio/bebidas/chickpea-chiller-kit-for-6.4310765c71ba524b5462ea9330d32446.jpg",
            "name": "The Hummus and Pita Co.",
            "dsc": "Chickpea Chiller Kit for 6",
            "price": 89
        },
        {
            "id": "15194-old-honey-barn-mint-julep-mixer-200ml",
            "img": "./imgs/cardapio/bebidas/old-honey-barn-mint-julep-mixer-200ml.e0b131d6d9b69963706b43fd4334ab74.jpg",
            "name": "Old Honey Barn Mint Julep",
            "dsc": "Old Honey Barn Mint Julep Mixer - 200ml Flask",
            "price": 25
        },
        {
            "id": "kentucky-derby-mint-julep-gift-set",
            "img": "./imgs/cardapio/bebidas/kentucky-derby-mint-julep-gift-set.79720eda4e9c8e3fcf9ecb5c79827f2c.jpg",
            "name": "Woodford Reserve",
            "dsc": "Kentucky Derby Mint Julep Gift Set",
            "price": 59.95
        },
        {
            "id": "002-charleston-bloody-mary-mix-weekender-bold-and-spicy",
            "img": "./imgs/cardapio/bebidas/weekender-charleston-bloody-mary-mix-bold-and-spicy.c372868c9937e407a299a22001e210e2.jpg",
            "name": "Charleston Beverage Company",
            "dsc": "Weekender | Charleston Bloody Mary Mix Bold and Spicy",
            "price": 39.95
        },
        {
            "id": "nola-cold-brew-concentrate-bag-in-box",
            "img": "./imgs/cardapio/bebidas/nola-cold-brew-concentrate-bag-in-box.3df6fde8bd83f29235565984ae8ed22b.jpg",
            "name": "Grady's Cold Brew",
            "dsc": "NOLA Cold Brew Concentrate Bag-in-Box",
            "price": 40
        }
    ],
    "pizzas": [
        {
            "id": "2-lou-malnatis-deep-dish-pizzas",
            "img": "./imgs/cardapio/pizzas/2-lou-malnatis-deep-dish-pizzas.bf0fe065d251a9cca3925b269d443a27.jpg",
            "name": "Lou Malnati's Pizza",
            "dsc": "2 Lou Malnati's Deep Dish Pizzas",
            "price": 67.99
        },
        {
            "id": "23699-choose-your-own-thin-crust-pizza-4-pack",
            "img": "./imgs/cardapio/pizzas/choose-your-own-thin-crust-pizza-4-pack.b928a2008eab50c65dc87e59b5952190.jpg",
            "name": "Bartolini's",
            "dsc": "Choose Your Own Thin Crust Pizza - 4 Pack",
            "price": 139
        },
        {
            "id": "choose-your-own-new-haven-style-pizza-6-pack",
            "img": "./imgs/cardapio/pizzas/choose-your-own-new-haven-style-pizza-6-pack.ab82828afc6172cdd4017556c15e36dd.jpg",
            "name": "Zuppardi's Apizza",
            "dsc": "New Haven-Style Pizza - 6 Pack (Choose Your Own)",
            "price": 79
        },
        {
            "id": "6-lou-malnatis-deep-dish-pizzas",
            "img": "./imgs/cardapio/pizzas/6-lou-malnatis-deep-dish-pizzas.f59993181da5d295668c8a6fb856055e.jpg",
            "name": "Lou Malnati's Pizza",
            "dsc": "6 Lou Malnati's Deep Dish Pizzas",
            "price": 116.99
        },
        {
            "id": "wood-fired-pizzas-best-seller-4-pack",
            "img": "./imgs/cardapio/pizzas/wood-fired-pizzas-best-seller-4-pack.1653bb05922ba153ac178f8365d27f6d.jpg",
            "name": "Pizzeria Bianco",
            "dsc": "Wood Fired Pizzas Best Seller - 4 Pack",
            "price": 129
        },
        {
            "id": "236991-choose-your-own-deep-dish-pizza-3-pack",
            "img": "./imgs/cardapio/pizzas/choose-your-own-deep-dish-pizza-3-pack.4111791511244a4946bb5c9ad2c17da9.jpg",
            "name": "Bartolini's",
            "dsc": "Choose Your Own Deep Dish Pizza - 3 Pack",
            "price": 139
        },
        {
            "id": "choose-your-own-detroit-style-pizza-3-pack",
            "img": "./imgs/cardapio/pizzas/detroit-style-pizza-choose-your-own-3-pack.6b6f4909ffd4066d5471e70eac5c3d89.jpg",
            "name": "Emmy Squared",
            "dsc": "Detroit-Style Pizza - Choose Your Own 3 Pack",
            "price": 89
        },
        {
            "id": "brooklyn-pizza-choose-your-own-5-pack",
            "img": "./imgs/cardapio/pizzas/brooklyn-pizza-choose-your-own-5-pack.edc4f476a75207d0af840ce6f225f2b3.jpg",
            "name": "Paesan's Pizza",
            "dsc": "Brooklyn Pizza - Choose Your Own 5 Pack",
            "price": 69
        },
        {
            "id": "choose-your-own-chicago-deep-dish-pizza-4-pack",
            "img": "./imgs/cardapio/pizzas/chicago-deep-dish-pizza-4-pack.49927daafa8c147fe9bb2a113e56668e.jpg",
            "name": "My Pi Pizza",
            "dsc": "Chicago Deep Dish Pizza - 4 Pack",
            "price": 129
        },
        {
            "id": "4-lou-malnatis-deep-dish-pizzas",
            "img": "./imgs/cardapio/pizzas/4-lou-malnatis-deep-dish-pizzas.8c79eb7506b5752ab3387d8174246b17.jpg",
            "name": "Lou Malnati's Pizza",
            "dsc": "4 Lou Malnati's Deep Dish Pizzas",
            "price": 96.99
        },
        {
            "id": "tonys-custom-pizza-3-pack",
            "img": "./imgs/cardapio/pizzas/choose-your-own-pizza-3-pack.fcf7a43e38593007ef2857fe16d6dd26.jpg",
            "name": "Tony's Pizza Napoletana",
            "dsc": "Choose Your Own Pizza - 3 Pack",
            "price": 99
        },
        {
            "id": "plain-thin-crust-pizza-4-pack",
            "img": "./imgs/cardapio/pizzas/plain-thin-crust-pizza-4-pack.5540e9d166db2f0853643c6517e4a225.jpg",
            "name": "The Columbia Inn",
            "dsc": "Plain Thin Crust Pizza - 4 Pack",
            "price": 79
        }
    ],
    "steaks": [
        {
            "id": "california-reserve-filet-mignon-steaks-gift-box",
            "img": "./imgs/cardapio/steaks/california-reserve-filet-mignon-steaks-gift-box.bf226e317aad85f47897ae7e325f790d.jpg",
            "name": "Flannery Beef",
            "dsc": "California Reserve Filet Mignon Steaks Gift Box",
            "price": 129
        },
        {
            "id": "steaks-and-cakes-date-night-dinner-for-2",
            "img": "./imgs/cardapio/steaks/valentines-steaks-and-cakes-dinner-for-2.0c63dab635eed46209455dc33cd25ea8.jpg",
            "name": "Chesapeake Bay Gourmet",
            "dsc": "Steaks and Cakes Date Night Dinner for 2",
            "price": 129
        },
        {
            "id": "Prime-holiday-steak-sampler-for-10-12",
            "img": "./imgs/cardapio/steaks/holiday-sampler-9-pack.2de75ca80282ffe9d064eb757ff7a5a1.jpg",
            "name": "Saltbrick Prime",
            "dsc": "Chef Matt's Steak Sampler for 10-12",
            "price": 179
        },
        {
            "id": "bone-in-rib-steak",
            "img": "./imgs/cardapio/steaks/bone-in-rib-steak.b13d9d4233035767605f0de9acdce1ab.jpg",
            "name": "Old Homestead Steakhouse",
            "dsc": "Bone-in Rib Steak",
            "price": 159
        },
        {
            "id": "american-wagyu-gold-grade-top-sirloins",
            "img": "./imgs/cardapio/steaks/american-wagyu-gold-grade-sirloins.040dbeb8f8e615b91fa7e513e3dc089c.jpg",
            "name": "Snake River Farms",
            "dsc": "American Wagyu Gold Grade Top Sirloins",
            "price": 119
        },
        {
            "id": "2-peter-luger-steak-pack-b",
            "img": "./imgs/cardapio/steaks/peter-luger-steak-pack-b.9feb0300e6be2dfecfa314f2006a2183.jpg",
            "name": "Peter Luger Steak House",
            "dsc": "Peter Luger Porterhouse Steaks",
            "price": 215.95
        },
        {
            "id": "ribeye-prime-steak-gift-box",
            "img": "./imgs/cardapio/steaks/ribeye-prime-steak-gift-box.e74cb016baabbb2df73861de8150f29c.jpg",
            "name": "Churchill's Steakhouse",
            "dsc": "Ribeye Prime Steak Gift Box",
            "price": 229
        },
        {
            "id": "dry-aged-usda-prime-black-angus-porterhouse-steak-2-pack",
            "img": "./imgs/cardapio/steaks/usda-prime-black-angus-filet-mignon-barrel-cut.6ee213799e7d1848763d12edca18e3b1.jpg",
            "name": "Pat LaFrieda Meats",
            "dsc": "Dry-Aged USDA Prime Black Angus Porterhouse Steak - 2 Pack",
            "price": 96.7
        },
        {
            "id": "california-reserve-ribeye-steak",
            "img": "./imgs/cardapio/steaks/california-reserve-ribeye-steak-12-oz.d367c5ae72dd9f89e170662104bef4fc.jpg",
            "name": "Flannery Beef",
            "dsc": "California Reserve Ribeye Steak - 12 oz",
            "price": 32
        },
        {
            "id": "dry-aged-boneless-ribeye-steak-dinner-kit-for-4",
            "img": "./imgs/cardapio/steaks/dry-aged-boneless-ribeye-steak-dinner-for-4.81c3bdc05fe6bdb2c2214709863120e0.jpg",
            "name": "Chef Francis Mallmann",
            "dsc": "Dry-Aged Boneless Ribeye Steak Dinner Kit for 4",
            "price": 225
        },
        {
            "id": "california-reserve-filet-mignon-steak",
            "img": "./imgs/cardapio/steaks/california-reserve-filet-mignon-steak.ff15071964ec8141d30c2ba05fb117e0.jpg",
            "name": "Flannery Beef",
            "dsc": "California Reserve Filet Mignon Steak",
            "price": 22
        },
        {
            "id": "mesquite-smoked-peppered-beef-tenderloin",
            "img": "./imgs/cardapio/steaks/mesquite-smoked-peppered-beef-tenderloin.5c314418a1f75c7057eed686e2fad46f.jpg",
            "name": "Perini Ranch Steakhouse",
            "dsc": "Mesquite Smoked Peppered Beef Tenderloin",
            "price": 165
        }
    ]
};