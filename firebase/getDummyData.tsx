// In your getData.ts file

// ...

// Dummy data for testing (replace this with your actual data structure)
const contactsData = [
    {
      id: "1",
      name: "John Doe",
      email: "johndoe@example.com",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "janesmith@example.com",
    },
    // Add more dummy data items as needed
  ];
const shopData = [
    {
      id: "1",
      name: "Gucci Mane",
      email: "shopallyouneed@example.com",
    },
    // Add more dummy data items as needed
  ];
const promoData = [
    {
      id: "1",
      name: "Promo Doug",
      email: "promotion!!!@example.com",
    },
    // Add more dummy data items as needed
  ];
const discoverData = [
    {
      id: "1",
      name: "Mat Einstein",
      email: "mateinstein@example.com",
    },
    // Add more dummy data items as needed
  ];
  
  // Function to fetch dummy data for the "Contacts" tab (for testing)
  export const getContactsData = async () => {
    // Simulate an asynchronous operation (e.g., fetching from a database)
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(contactsData);
      }, 1000); // Simulate a delay of 1 second
    });
  };
  
  // Function to fetch dummy data for the "Shop" tab (for testing)
  export const getShopData = async () => {
    // Simulate an asynchronous operation (e.g., fetching from a database)
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(shopData);
      }, 1000); // Simulate a delay of 1 second
    });
  };
  
  // Function to fetch dummy data for the "Promo" tab (for testing)
  export const getPromoData = async () => {
    // Simulate an asynchronous operation (e.g., fetching from a database)
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(promoData);
      }, 1000); // Simulate a delay of 1 second
    });
  };
  
  // Function to fetch dummy data for the "Discover" tab (for testing)
  export const getDiscoverData = async () => {
    // Simulate an asynchronous operation (e.g., fetching from a database)
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(discoverData);
      }, 1000); // Simulate a delay of 1 second
    });
  };
  
  // ...
  