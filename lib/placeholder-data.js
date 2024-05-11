const collections = [
  {
    id: "valentine",
    title: "Valentine's Collections",
    image: {
      src: "/v-day-love.jpeg",
      alt: "",
    },
    description: "Hey there, lovebirds! 💕 February is just around the corner, so don't wait too long to surprise your partners.",
    component: "",
  },
  {
    id: 'current-batch',
    title: "Current Batch",
    image: {
      src: "/generic-placeholder-image.jpeg",
      alt: "A mix of books and tech gadgets.",
    },
    description:
      "",
    component: "",
  },
  {
    id: "valentine",
    title: "Valentine's Collections",
    image: {
      src: "/v-day-love.jpeg",
      alt: "",
    },
    description: "Hey there, lovebirds! 💕 February is just around the corner, so don't wait too long to surprise your partners.",
    component: "",
  },
];

const products = [
  {
    id: 'original-airpod-2nd-gen',
    collection_id: collections[1].id,
    name: "Original Airpod 2nd Gen",
    price: 50,
    moq: 12,
    confirmed_orders: 9,
    images: [
      {
        id: 1,
        src: "/original_airpod.jpg",
        alt: "",
      },
      {
        id: 2,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brow fox...",
    discount: "",
    variations: [
      
    ],
  },
  {
    id: 'portable-blender-for-persoanl-use',
    collection_id: collections[1].id,
    name: "Portable blender for Personal use",
    price: 90,
    moq: 12,
    confirmed_orders: 2,
    images: [
      {
        id: 1,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
      {
        id: 2,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
    ],
    description:
      "Juice crusher for personal use...",
    discount: "",
    variations: [
      { type: "color", values: ["White", "Pink"] },
    ],
  },
  {
    id: 7,
    collection_id: collections[0].id,
    name: "The big brown fox",
    price: "700",
    images: [
      {
        id: 1,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
      {
        id: 2,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown fox jumps over the lazy dog.",
    discount: "",
    confirmed_orders: '',
    variations: [
      
    ],
  },
  {
    id: 'Ori-Kettle',
    collection_id: collections[0].id,
    name: "Kettel",
    price: "200",
    images: [
      {
        id: 1,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
      {
        id: 2,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown dog jumps over the lazy dog.",
    discount: "",
    confirmed_orders: '',
    variations: [
      
    ],
  },
  {
    id: 9,
    collection_id: collections[0].id,
    name: "The big brown deer",
    price: "99",
    images: [
      {
        id: 1,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
      {
        id: 2,
        src: "/generic-placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer jumps over the lazy dog",
    discount: "",
    confirmed_orders: '',
    variations: [
      
    ],
  },
  {
    id: 10,
    collection_id: collections[1].id,
    name: "Insulated Drinking Bottle",
    price: "100",
    images: [
      {
        id: 1,
        src: "/portable-water-bottle.JPG",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      
    ],
  },
  {
    id: 11,
    collection_id: collections[1].id,
    name: "Wireless Earbuds",
    price: "150",
    images: [
      {
        id: 1,
        src: "/wireless-earbuds.jpg",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      
    ],
  },
  {
    id: 'Smart-Watch',
    collection_id: collections[1].id,
    name: "Smart Watch",
    price: "250.00",
    images: [
      {
        id: 1,
        src: "/smart-watch.jpg",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      
    ],
  },
  {
    id: 'Women-Sachel-Handbag', // Product Id is generated with code as the item is being uploaded. Mostly first name is the identity of the store or brand uploading it. eg. TAAAG-Women-slippers-Black
    collection_id: collections[1].id,
    name: "Women Sachel Handbag for wedding occasions",
    price: "40.00",
    images: [
      {
        id: '',
        src: "",
        alt: "",
      },
      {
        id: '',
        src: "",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      { type: "color", values: ["Red", "Blue", "Green"] },
      { type: "size", values: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: 'Women-Sachel-Handbag', // Product Id is generated with code as the item is being uploaded. Mostly first name is the identity of the store or brand uploading it. eg. TAAAG-Women-slippers-Black
    collection_id: collections[1].id,
    name: "Women Sachel Handbag for wedding occasions",
    price: "40.00",
    images: [
      {
        id: 1,
        src: "/women-handbag.JPG",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      { type: "color", values: ["Red", "Blue", "Green"] },
      { type: "size", values: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: 'Women-Sachel-Handbag', // Product Id is generated with code as the item is being uploaded. Mostly first name is the identity of the store or brand uploading it. eg. TAAAG-Women-slippers-Black
    collection_id: collections[1].id,
    name: "Women Sachel Handbag for wedding occasions",
    price: "40.00",
    images: [
      {
        id: 1,
        src: "/women-handbag.JPG",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      { type: "color", values: ["Red", "Blue", "Green"] },
      { type: "size", values: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: 'Women-Sachel-Handbag', // Product Id is generated with code as the item is being uploaded. Mostly first name is the identity of the store or brand uploading it. eg. TAAAG-Women-slippers-Black
    collection_id: collections[1].id,
    name: "Women Sachel Handbag for wedding occasions",
    price: "40.00",
    images: [
      {
        id: 1,
        src: "/women-handbag.JPG",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      { type: "color", values: ["Red", "Blue", "Green"] },
      { type: "size", values: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: 'Women-Sachel-Handbag', // Product Id is generated with code as the item is being uploaded. Mostly first name is the identity of the store or brand uploading it. eg. TAAAG-Women-slippers-Black
    collection_id: collections[1].id,
    name: "Women Sachel Handbag for wedding occasions",
    price: "40.00",
    images: [
      {
        id: 1,
        src: "/women-handbag.JPG",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      { type: "color", values: ["Red", "Blue", "Green"] },
      { type: "size", values: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: 'Women-Sachel-Handbag', // Product Id is generated with code as the item is being uploaded. Mostly first name is the identity of the store or brand uploading it. eg. TAAAG-Women-slippers-Black
    collection_id: collections[1].id,
    name: "Women Sachel Handbag for wedding occasions",
    price: "40.00",
    images: [
      {
        id: 1,
        src: "/women-handbag.JPG",
        alt: "",
      },
      {
        id: 2,
        src: "/placeholder-image.jpeg",
        alt: "",
      },
    ],
    description: "The big brown deer...",
    discount: "",
    confirmed_orders: '',
    variations: [
      { type: "color", values: ["Red", "Blue", "Green"] },
      { type: "size", values: ["Small", "Medium", "Large"] },
    ],
  },
];

const orders = [
  {
    productId: "",
    orderedBy: [
      {
        uniqueId: "1",
        name: "Quam",
        phone: "",
        location: "",
        orderedAt: "21st Jan, 2024, 12:22PM",
        quantity: 4,
        variations: [],
        paid: false
      },
      {
        uniqueId: "3",
        name: "Lyla",
        phone: "",
        location: "",
        orderedAt: "5th Feb, 2024, 10:42AM",
        quantity: 1,
        variations: [],
        paid: false
      },
    ]
  },
  {
    productId: "",
    orderedBy: [
      {
        uniqueId: "2",
        name: "Bassi",
        phone: "",
        location: "",
        orderedAt: "7th Feb, 2024, 12:24AM",
        quantity: 2,
        variations: [],
        paid: false
      },
      {
        uniqueId: "1",
        name: "Quam",
        phone: "",
        location: "",
        orderedAt: "25th Feb, 2024, 09:42AM",
        quantity: 3,
        variations: [],
        paid: false
      },
    ]
  }
]

module.exports = {
  products,
  collections,
  orders,
};
