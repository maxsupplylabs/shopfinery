// USEFUL, RESUABLE CODE GOES HERE
import { db } from "@/firebase/config";
import { unstable_noStore as noStore } from "next/cache";
import {
  serverTimestamp,
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  where,
  isEqual,
  getDoc,
  addDoc,
  writeBatch,
  commitBatch,
  deleteDoc,
  collectionGroup,
  onSnapshot,
  arrayUnion,
  increment,
  getDocsFromServer,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

/*------------------------------Firebase functions----------------------------*/

// Function to fetch all documents, which represent products: From Firestore collection I've named 'products'

/**This function returns all documents in a specified collection */
export async function fetchAllDocumentsInCollection(collectionName) {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocsFromServer(q);
    const collectionData = [];

    querySnapshot.forEach((doc) => {
      collectionData.push({ id: doc.id, ...doc.data() });
    });

    return collectionData; // Array of collection documents
  } catch (error) {
    console.error("Error fetching subcollection data:", error);
    return null; // Error occurred
  }
}

export async function convertPriceFieldsToNumber(collectionName) {
  try {
    // Get all documents in the collection
    const querySnapshot = await getDocs(collection(db, collectionName));

    // Iterate through the documents and update "price" field
    querySnapshot.forEach(async (docSnapshot) => {
      const priceValue = docSnapshot.data().price;

      // Check if "price" is a string and can be converted to a number
      if (typeof priceValue === "string" && !isNaN(Number(priceValue))) {
        const numericPrice = Number(priceValue);

        // Update the document with the numeric "price" field
        await updateDoc(doc(db, collectionName, docSnapshot.id), {
          price: numericPrice,
        });
        console.log(
          `Updated document ${docSnapshot.id} with numeric price: ${numericPrice}`
        );
      }
    });

    console.log("Conversion completed.");
  } catch (error) {
    console.error("Error converting price fields to number:", error);
  }
}

// Function to check if userId exists
function userIdExists(userId) {
  return (
    userId === "345ea810-5575-4959-add4-9e18ec2529f4" ||
    userId === "196829f6-0d7f-41e5-84ba-b88cc0b068f5" ||
    userId === "7c806f4d-051a-4865-8952-d33618b96295" ||
    userId === "7dbc4f8c-3027-4430-a1ab-6116ca4eca0d"
  );
}

export async function updateBrowserHistory(
  id,
  name,
  images,
  variations,
  description,
  price,
  views
) {
  try {
    const userId = localStorage.getItem("userId");
    if (userIdExists(userId)) {
      console.log("userId already exists. Skipping increment.");
      return;
    }
    const visitorRef = doc(db, "visitors", userId);
    const visitorDoc = await getDoc(visitorRef);

    if (visitorDoc.exists()) {
      const history = visitorDoc.data().history || [];
      const existingProductIndex = history.findIndex(
        (entry) => entry.product.id === id
      );

      if (existingProductIndex !== -1) {
        // Product exists, update views
        const updatedHistory = [...history];
        updatedHistory[existingProductIndex].views += 1;

        await updateDoc(visitorRef, { history: updatedHistory });
      } else {
        // Product doesn't exist, add it to history with views initialized
        const newEntry = {
          product: {
            id,
            name,
            images,
            variations,
            description,
            price,
            views,
          },
          views: 0,
        };

        const updatedHistory = [...history, newEntry];

        await updateDoc(visitorRef, { history: updatedHistory });
      }
    } else {
      // Document doesn't exist, create it with the "history" field and new product information
      await setDoc(visitorRef, {
        history: [
          {
            product: {
              id,
              name,
              images,
              variations,
              description,
              price,
              views,
            },
            views: 0,
          },
        ],
      });
    }

    console.log("Browser history updated successfully.");
  } catch (error) {
    console.error("Error updating browser history:", error);
  }
}

export async function fetchDocumentsWithMaxPrice(collectionName, maxPrice) {
  try {
    const q = query(
      collection(db, collectionName),
      where("price", "<=", maxPrice)
    );
    const querySnapshot = await getDocs(q);
    const collectionData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert 'price' to a number if it's stored as a string
      if (data.price) {
        data.price = Number(data.price);
      }
      collectionData.push({ id: doc.id, ...data });
    });

    return collectionData; // Array of collection documents
  } catch (error) {
    console.error("Error fetching filtered collection data:", error);
    return null; // Error occurred
  }
}

/**This script fetches all documents in the specified collection, then updates each document by adding a new field with a default value. */
export async function addFieldToDocuments(collectionName, fieldName) {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    const updates = querySnapshot.docs.map((docSnapshot) => {
      const docRef = doc(collectionRef, docSnapshot.id);
      return updateDoc(docRef, {
        [fieldName]: false, // specify the new field and its default value
      });
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    console.log("Field added to all documents successfully.");
  } catch (error) {
    console.error("Error adding field to documents:", error);
  }
}

function generateUniqueUserId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const aboutPageContentRating = async (value) => {
  const userId = localStorage.getItem("userId");

  const visitorRef = doc(collection(db, "visitors"), userId);
  await setDoc(visitorRef, { aboutPageRating: value }, { merge: true });
  console.log("Rating submitted:", value);
};
export const aboutPageContentFeedback = async (feedback) => {
  const userId = localStorage.getItem("userId");

  const visitorRef = doc(collection(db, "visitors"), userId);
  await setDoc(visitorRef, { aboutPageFeedback: feedback }, { merge: true });
  console.log("Rating submitted:", feedback);
};

export const updateUserInFirestore = async (pageName) => {
  try {
    const userId = localStorage.getItem("userId");
    if (userIdExists(userId)) {
      console.log("userId already exists. Skipping increment.");
      return;
    }
    // If an identifier already exists, check if a document exists with the same ID in Firestore
    const userDocRef = doc(db, "visitors", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userDocData = userDocSnap.data();
      const currentPageData = userDocData[pageName] || {
        count: 0,
        lastVisit: null,
      };
      const newPageVisits = currentPageData.count + 1;

      await updateDoc(userDocRef, {
        [pageName]: {
          count: newPageVisits,
          lastVisit: serverTimestamp(),
        },
      });

      console.log(
        "Returning user with ID:",
        userId,
        "Page Visits:",
        newPageVisits
      );
    } else {
      // If the document does not exist, create a new one
      await setDoc(userDocRef, {
        name: [],
        location: [],
        phone: [],
        [pageName]: {
          count: 1,
          lastVisit: serverTimestamp(),
        },
        firstVisitOn: serverTimestamp(),
      });

      console.log("New user with ID (no document found):", userId);
    }
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
  }
};

// Function to initialize a user and store in Firestore
export const initializeUserInFirestore = async (pageName) => {
  try {
    // Generate a new unique identifier
    const newUserId = generateUniqueUserId();

    // Store the new identifier in localStorage
    localStorage.setItem("userId", newUserId);

    // Log the new user identifier
    console.log("New user with ID:", newUserId);

    // Create a document in Firestore using the new identifier
    const userDocRef = doc(db, "visitors", newUserId);

    // Initialize the "order" subcollection
    const ordersCollectionRef = collection(userDocRef, "orders");

    // Set document data for the user
    await setDoc(userDocRef, {
      name: [],
      location: [],
      phone: [],
      [pageName]: {
        count: 1,
        lastVisit: serverTimestamp(),
      },
      firstVisitOn: serverTimestamp(),
    });

    console.log("Firestore document created for the new user.");

    // Create the "orders" subcollection without an initial document
    // You can omit this step if you want to add documents later using addOrdersToFirestore
    console.log("Firestore subcollection 'orders' created for the new user.");
  } catch (error) {
    console.error("Error initializing user in Firestore:", error);
  }
};
// Function to add orders to Firestore
export const addOrdersToFirestore = async (products) => {
  try {
    // Get the current user's unique ID from localStorage
    const userId = localStorage.getItem("userId");

    // If the user has a valid ID, proceed to add orders
    if (userId) {
      // Reference to the orders subcollection for the current user
      const ordersCollectionRef = collection(db, "visitors", userId, "orders");

      // Create a new Firestore batch
      const batch = writeBatch(db);

      // For each product in the bag, add a document to the orders subcollection
      products.forEach((product) => {
        const orderDocRef = doc(ordersCollectionRef);

        // Include document ID in the order data
        const orderData = {
          id: orderDocRef.id,
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          variations: product.variations,
          image: product.images,
          isFreeShipping: product.isFreeShipping,
          // Add other product details as needed
          // ...
          timestamp: serverTimestamp(),
        };

        // Add the set operation to the batch
        batch.set(orderDocRef, orderData);
      });

      // Commit the batch
      await batch.commit();

      console.log("Orders added to Firestore successfully!");
    } else {
      console.error("User ID not found. Unable to add orders to Firestore.");
    }
  } catch (error) {
    console.error("Error adding orders to Firestore:", error);
  }
};

export const addBuyerPersonalInfo = async (buyerInfo) => {
  try {
    //Get the current user's unique Id from localStorage
    const userId = localStorage.getItem("userId");

    // If the user has a valid ID, proceed to add orders
    if (userId) {
      // Reference to the visitor's document
      const visitorsDocRef = doc(db, "visitors", userId);

      // Update the Firestore document with buyer's personal information
      await updateDoc(visitorsDocRef, {
        name: buyerInfo.name,
        location: buyerInfo.location,
        phone: buyerInfo.phone,
      });

      console.log(
        "Buyer's personal information added to Firestore successfully!"
      );
    } else {
      console.error(
        "User ID not found. Unable to add buyer's information to Firestore."
      );
    }
  } catch (error) {
    console.error("Error adding buyer's information to Firestore:", error);
  }
};

export async function placeOrder(buyerInfo, bagItems) {
  const batch = writeBatch(db);

  try {
    // Iterate through each bag item
    for (const bagItem of bagItems) {
      const orderData = {
        productId: bagItem.productId,
        name: bagItem.name,
        price: bagItem.price,
        quantity: bagItem.quantity,
        variations: bagItem.variations,
        image: bagItem.images,
        isFreeShipping: bagItem.isFreeShipping,
        timestamp: serverTimestamp(),
        paid: false,
        moq: bagItem.moq, 
        buyerName: buyerInfo.name,
        buyerLocation: buyerInfo.location,
        buyerPhone: buyerInfo.phone,
      };

      // Add a new document to the "orders" collection
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      batch.set(orderRef, orderData); // Add order data to batch
    }

    // Commit the batch operation
    await batch.commit();
    console.log("Orders placed successfully!");
  } catch (error) {
    console.error("Error placing orders:", error);
    // Handle error gracefully, e.g., show error message to user
  }
}


export const trackVisit = async (pageName) => {
  try {
    const visitorsDocRef = doc(db, "analytics", "visitors");
    const visitorsDocSnap = await getDoc(visitorsDocRef);

    if (visitorsDocSnap.exists()) {
      const pageCountField = `${pageName}Count`;
      const currentCount = visitorsDocSnap.data()[pageCountField] || 0;
      const newCount = currentCount + 1;

      // Update the count field for the specific page
      await updateDoc(visitorsDocRef, {
        [pageCountField]: newCount,
      });

      console.log(`Visit tracked for ${pageName} successfully!`);
    } else {
      console.error("Visitors document does not exist.");
    }
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};

export const trackVisitd = async (pageName) => {
  try {
    const visitorsDocRef = doc(db, "analytics", "visitors");
    const visitorsDocSnap = await getDoc(visitorsDocRef);

    if (visitorsDocSnap.exists()) {
      // Update the count field for the specific page
      await updateDoc(visitorsDocRef, {
        [pageName]: increment(1),
      });

      console.log(`Visit tracked for ${pageName} successfully!`);
    } else {
      console.error("Visitors document does not exist.");
    }
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};

export async function getAvailableInGhanaProducts() {
  try {
    const q = query(collection(db, "products"), where("isAvailableInGhana", "==", true));

    const querySnapshot = await getDocs(q);
    const visitorsWithOrders = [];

    querySnapshot.forEach((doc) => {
      visitorsWithOrders.push({ id: doc.id, ...doc.data() });
    });

    return visitorsWithOrders;
  } catch (error) {
    console.error("Error fetching visitors with orders:", error);
    return null;
  }
}

/**function to increment the views field in Firestore. */
export async function incrementProductViews(collectionName, productId) {
  try {
    // Check if userId is present in localStorage
    const userId = localStorage.getItem("userId");
    if (userIdExists(userId)) {
      console.log("userId already exists. Skipping increment.");
      return;
    }
    // Get a reference to the product document
    const productDocRef = doc(db, collectionName, productId);

    // Get the current document data
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      // Get the current views value
      const currentViews = productDoc.data().views || 0;

      // Increment the views by 1
      const updatedViews = currentViews + 1;

      // Update the document with the new views value
      await updateDoc(productDocRef, {
        views: updatedViews,
      });

      console.log("Incremented successfully.");
    } else {
      console.error("Product document not found.");
    }
  } catch (error) {
    console.error("Error incrementing product views:", error);
  }
}

export async function getVisitorsWithOrders() {
  try {
    const q = query(collection(db, "visitors"), where("name", "!=", null));

    const querySnapshot = await getDocs(q);
    const visitorsWithOrders = [];

    querySnapshot.forEach((doc) => {
      visitorsWithOrders.push({ id: doc.id, ...doc.data() });
    });

    return visitorsWithOrders;
  } catch (error) {
    console.error("Error fetching visitors with orders:", error);
    return null;
  }
}

export async function getVisitorsWithBrowserHistory() {
  try {
    const q = query(collection(db, "visitors"), where("history", "!=", null));
    console.log(q)

    const querySnapshot = await getDocs(q);
    const visitorsWithOrders = [];

    querySnapshot.forEach((doc) => {
      visitorsWithOrders.push({ id: doc.id, ...doc.data() });
    });

    return visitorsWithOrders;
  } catch (error) {
    console.error("Error fetching visitors with orders:", error);
    return null;
  }
}

// Function to update Firestore field
export async function updateFirestoreField(documentId, field, value) {
  try {
    const docRef = doc(db, "visitors", documentId);
    await updateDoc(docRef, { [field]: value });
    console.log(`${field} updated successfully`);
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
  }
}

export async function incrementEnquiryNumber() {
  try {
    const userId = localStorage.getItem("userId");
    if (userIdExists(userId)) {
      console.log("userId already exists. Skipping increment.");
      return;
    }
    // Get a reference to the product document
    const docRef = doc(db, "analytics", "visitors");

    // Get the current document data
    const docField = await getDoc(docRef);

    if (docField.exists()) {
      // Get the current enquiries value
      const currentEnquiries = docField.data().enquiries || 0;

      // Increment the enquiries by 1
      const updatedEnquiries = currentEnquiries + 1;

      // Update the document with the new enquiries value
      await updateDoc(docRef, {
        enquiries: updatedEnquiries,
      });

      console.log("Incremented successfully.");
    } else {
      console.error("Product document not found.");
    }
  } catch (error) {
    console.error("Error incrementing product enquiries:", error);
  }
}

export async function incremenHomePageBannersViews() {
  try {
    // Check if userId is present in localStorage
    const userId = localStorage.getItem("userId");
    if (userIdExists(userId)) {
      return;
    }
    // Get a reference to the product document
    const docRef = doc(db, "analytics", "visitors");

    // Get the current document data
    const docField = await getDoc(docRef);

    if (docField.exists()) {
      // Get the current enquiries value
      const currentDontBreakTheBagViews =
        docField.data().dontBreakTheBagViews || 0;

      // Increment the enquiries by 1
      const updatedDontBreakTheBagViews = currentDontBreakTheBagViews + 1;

      // Update the document with the new enquiries value
      await updateDoc(docRef, {
        dontBreakTheBagViews: updatedDontBreakTheBagViews,
      });
    } else {
      console.error("Product document not found.");
    }
  } catch (error) {
    console.error("Error incrementing product enquiries:", error);
  }
}

export async function incrementProductEnquiryNumber(productId) {
  try {
    // Check if userId is present in localStorage
    const userId = localStorage.getItem("userId");
    if (userIdExists(userId)) {
      console.log("userId already exists. Skipping increment.");
      return;
    }
    // Get a reference to the product document
    const docRef = doc(db, "products", productId);

    // Get the current document data
    const docField = await getDoc(docRef);

    if (docField.exists()) {
      // Get the current enquiries value
      const currentEnquiries = docField.data().enquiries || 0;

      // Increment the enquiries by 1
      const updatedEnquiries = currentEnquiries + 1;

      // Update the document with the new enquiries value
      await updateDoc(docRef, {
        enquiries: updatedEnquiries,
      });

      console.log("Incremented successfully.");
    } else {
      console.error("Product document not found.");
    }
  } catch (error) {
    console.error("Error incrementing product enquiries:", error);
  }
}

/** RECOMMENDATION SYSTEM FUNCTIONS*/

/**This function fetches the collection ID for a given product ID by querying the "products" collection in Firestore. */
export const fetchCollectionId = async (productId) => {
  try {
    const productDocRef = doc(db, "products", productId);
    const productDocSnap = await getDoc(productDocRef);

    if (productDocSnap.exists()) {
      const collections = productDocSnap.data().collections || [];

      // You may need to implement logic to choose the correct collection ID from the array
      // In this example, I'm using the first element of the 'collection' array
      return collections.length > 0 ? collections[0] : null;
    } else {
      // Handle case where the product document does not exist
      console.error("Product document not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching collection ID:", error);
    return null;
  }
};

/**This function fetches the department ID for a given collection ID by querying the "collections" collection in Firestore. */
export const fetchDepartmentId = async (collectionId) => {
  try {
    const collectionDocRef = doc(db, "collections", collectionId);
    const collectionDocSnap = await getDoc(collectionDocRef);

    if (collectionDocSnap.exists()) {
      const department = collectionDocSnap.data().department;

      // You may need to implement logic to choose the correct collection ID from the array
      // In this example, I'm using the first element of the 'collection' array
      return department;
    } else {
      // Handle case where the product document does not exist
      console.error("collection document not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching collection ID:", error);
    return null;
  }
};

/**This function fetches similar products based on the provided collection ID, excluding the product with the specified ID. It sorts the results by the number of views and limits the result set to the top 5 products. */
export async function fetchSimilarProducts(collectionId, productId) {
  try {
    const q = query(
      collection(db, "products"),
      where("collections", "array-contains", collectionId),
      where("id", "!=", productId), // Exclude the current product
      orderBy("id"), // 'id' as the first orderBy field
      orderBy("views", "desc"), // Order by views in descending order
      limit(7) // Limit the result set to 5 products
    );

    const querySnapshot = await getDocs(q);
    const similarProducts = [];

    querySnapshot.forEach((doc) => {
      similarProducts.push({ id: doc.id, ...doc.data() });
    });
    console.log(similarProducts);
    return similarProducts;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

/**This function returns a specified number of documents in a specified collection */
export async function fetchTop4CollectionsByViews(collectionName, limitNumber) {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy("views", "desc"), // Order by views in descending order
      limit(limitNumber) // Limit the result to the top 3
    );

    const querySnapshot = await getDocs(q);
    const topCollections = [];

    querySnapshot.forEach((doc) => {
      topCollections.push({ id: doc.id, ...doc.data() });
    });

    return topCollections; // Array of top 3 collections by views
  } catch (error) {
    console.error("Error fetching top collections by views:", error);
    return null; // Error occurred
  }
}

/**Function to fetch products in a specified collection using the  */
export function fetchProductsInCollection(products, collectionId) {
  return products.filter(
    (product) =>
      product.collections && product.collections.includes(collectionId)
  );
}

export function fetchProductsInCollectionWithSpecifiedPricePoint(
  products,
  collectionId,
  maxPrice
) {
  return products.filter(
    (product) =>
      product.collections &&
      product.collections.includes(collectionId) &&
      (!maxPrice || product.price <= maxPrice)
  );
}

export function fetchProductsInDepartments(products, departmentIds) {
  return products.filter(
    (product) =>
      product.departments &&
      departmentIds.some((departmentId) =>
        product.departments.includes(departmentId)
      )
  );
}

/**Given an array of collectionIds, this function fetches 10 products (randomly) from them. */
export function fetchProductsInCollections(products, collectionIds) {
  //
}

/** Function to fetch all collections of a specified department */
export async function fetchCollectionsByDepartment(department) {
  const collectionsRef = collection(db, "collections");
  const q = query(collectionsRef, where("department", "==", department));

  try {
    const querySnapshot = await getDocs(q);
    const collections = [];

    querySnapshot.forEach((doc) => {
      collections.push({ id: doc.id, ...doc.data() });
    });

    return collections;
  } catch (error) {
    console.error("Error fetching collections by department:", error);
    throw error;
  }
}

/** Function to fetch the ids of 5 collections with the most views under the department, excluding the collection with id collectionId. */
export async function fetchTopCollections(departmentId, collectionId) {
  const collectionsRef = collection(db, "collections");
  const q = query(
    collectionsRef,
    where("department", "==", departmentId),
    where("id", "!=", collectionId), // Exclude the specified collectionId
    orderBy("id"), // 'id' as the first orderBy field
    orderBy("views", "desc"), // Order by views in descending order
    limit(5) // Limit the result set to 5 collections
  );

  try {
    const querySnapshot = await getDocs(q);
    const topCollections = [];

    querySnapshot.forEach((doc) => {
      topCollections.push({ id: doc.id, ...doc.data() });
    });

    return topCollections;
  } catch (error) {
    console.error("Error fetching top collections by department:", error);
    throw error;
  }
}

/** Function to fetch all documents with a specified field and value */
export async function fetchDocumentsWithFieldValue(
  collectionName,
  field,
  value
) {
  const collectionsRef = collection(db, collectionName);
  const q = query(collectionsRef, where(field, "==", value));

  try {
    const querySnapshot = await getDocs(q);
    const collections = [];

    querySnapshot.forEach((doc) => {
      collections.push({ id: doc.id, ...doc.data() });
    });

    return collections;
  } catch (error) {
    console.error("Error fetching collections by department:", error);
    throw error;
  }
}
/** Function to fetch the number of products in a specified collection */
export function countProductsInCollection(products, collectionId) {
  return products.filter(
    (product) =>
      product.collections && product.collections.includes(collectionId)
  ).length;
}

/** Function to fetch the number of documents in a specified collection */
export const getDocumentCountInCollection = (collectionPath, callback) => {
  const collectionRef = collection(db, collectionPath);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const count = snapshot.size;
    callback(count);
  });

  return unsubscribe;
};

// Function to get documents in a specified collection in real-time
export const getDocumentsInCollectionRealTime = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);

  // Subscribe to real-time changes in the collection
  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Invoke the callback function with the updated documents
    callback(documents);
  });

  // Return the unsubscribe function
  return unsubscribe;
};

/** Function to get the number of documents in a specified collection */
export async function getDocumentCount() {
  try {
    const querySnapshot = await getDocs(collection(db, 'visitors'));
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching document count:", error);
    return -1; // Return -1 or any other default value in case of error
  }
}

/** Function to get all products documents */
export async function getAllProduts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({id: doc.id, ...doc.data()})
    })
    return documents;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};


/** Function to get all visitors documents */
export async function getAllVisitors() {
  try {
    const querySnapshot = await getDocs(collection(db, 'visitors'));
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({id: doc.id, ...doc.data()})
    })
    return documents;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}

/** Function to get a specific field value from a document in a specified collection */
export const getDocumentField = (
  subcollectionName,
  documentId,
  fieldName,
  callback
) => {
  const documentRef = doc(db, subcollectionName, documentId);

  const unsubscribe = onSnapshot(documentRef, (snapshot) => {
    const field = snapshot.data()?.[fieldName];
    callback(field);
  });

  return unsubscribe;
};

/** Function to get a specific field value from a document in a collection || get the number of enquiries*/
export async function getNumberOfEnquiries() {
  try {
    const docRef = doc(db, "analytics", "visitors");
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const fieldValue = docSnapshot.data()["enquiries"];
      return fieldValue;
    } else {
      console.error(`Document 'visitors' does not exist in collection 'analytics'.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching field value:", error);
    return null; // Return null or any other default value in case of error
  }
}
/** Function to get a specific field value from a document in a collection || get the number of enquiries*/
export async function getNumberOfDBTBVisitors() {
  try {
    const docRef = doc(db, "analytics", "visitors");
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const fieldValue = docSnapshot.data()["dontBreakTheBagViews"];
      return fieldValue;
    } else {
      console.error(`Document 'visitors' does not exist in collection 'analytics'.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching field value:", error);
    return null; // Return null or any other default value in case of error
  }
}

/** Function to get all orders documents*/
export const getAllOrders = async () => {
  try {
    const collectionGroupRef = collectionGroup(db, "orders");
    const querySnapshot = await getDocs(collectionGroupRef);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error(`Error fetching documents from subcollection, orders:`, error);
    return null;
  }
}


export const getSubcollectionDocuments = (subcollectionName, callback) => {
  const collectionGroupRef = collectionGroup(db, subcollectionName);
  const queryRef = query(collectionGroupRef, where("name", "!=", ""));

  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    const documents = [];

    snapshot.forEach((doc) => {
      // doc.id will give you the document ID
      // doc.data() will give you the document data
      documents.push({ id: doc.id, ...doc.data() });
    });

    callback(documents);
  });

  return unsubscribe;
};

// Function to fetch a specific document from a Firestore collection
export async function fetchDocumentFromFirestore(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document from Firestore:", error);
    throw error;
  }
}

// Function to fetch a specific document from a Firestore collection in real-time
export function listenToDocumentFromFirestore(collectionName, documentId, callback) {
  try {
    const docRef = doc(db, collectionName, documentId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        console.log("Document does not exist.");
        callback(null);
      }
    });

    // Return the unsubscribe function to stop listening to changes
    return unsubscribe;
  } catch (error) {
    console.error("Error listening to document from Firestore:", error);
    throw error;
  }
}

export const fetchProductsByFilters = async (selectedFilters) => {
  try {
    const productsRef = collection(db, "products");

    // Build Firestore query based on selected boolean filters
    let firestoreQuery = query(productsRef);
    Object.entries(selectedFilters).forEach(([filterName, filterValue]) => {
      if (filterValue) {
        firestoreQuery = query(
          firestoreQuery,
          where(`filters.${filterName}`, "==", true)
        );
      }
    });

    // Execute the query and get the documents
    const querySnapshot = await getDocs(firestoreQuery);

    // Convert the query snapshot to an array of product data
    const filteredProducts = querySnapshot.docs.map((doc) => doc.data());
    // console.log(filteredProducts);

    return filteredProducts;
  } catch (error) {
    console.error("Error fetching products by filters:", error);
    throw error;
  }
};

// Function to fetch products with a specific collection id appearing in their id value
export function filterProductsByCollection(products, collectionId) {
  return products.filter(
    (product) =>
      product.collection_id && product.collection_id.includes(collectionId)
  );
}

// Assuming products is an array of objects with a "price" field
export async function performSorting(products, sortOption) {
  switch (sortOption) {
    case "featured":
      // Your logic for sorting by featured
      // For example, you might have a "featured" flag on products
      return products.sort((a, b) => (a.featured ? -1 : 1));

    case "lowToHigh":
      // Sorting by price low to high
      return products.sort((a, b) => a.price - b.price);

    case "highToLow":
      // Sorting by price high to low
      return products.sort((a, b) => b.price - a.price);

    default:
      // Default case: return the original array
      return products;
  }
}

// Utility function to calculate discounted price
export const calculateDiscountedPrice = (product) => {
  const discountedPrice =
    Number(product.price) -
    (Number(product.discount) / 100) * Number(product.price);
  return `${discountedPrice.toFixed(2)}`;
};

// Helper function to render product variations
export const renderVariations = (
  selectedProduct,
  selectedVariations,
  handleVariationSelect
) => (
  <div>
    {selectedProduct.variations.map((variation) => (
      <div key={variation.type}>
        <strong>{variation.type}:</strong>
        {variation.values.map((value) => (
          <button
            key={value}
            onClick={(event) =>
              handleVariationSelect(variation.type, value, event)
            }
            className={`mr-2 ${
              selectedVariations[variation.type] === value
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    ))}
  </div>
);

// Utility function to get products in a collection
export const getProductsInCollection = (products, collectionId) => {
  return products.filter((product) => product.collection_id === collectionId);
};

// Utility function to get a specific collection by ID
export const getCollectionById = (collections, targetCollectionId) => {
  return collections.find((collection) => collection.id === targetCollectionId);
};

// Utility function to handle adding a product to the bag
export const handleAddToBagClick = (
  addToBag,
  selectedProduct,
  selectedVariations
) => {
  if (selectedProduct) {
    addToBag(selectedProduct.id, selectedProduct, selectedVariations);
  }
};

// Utility function to limit the number of characters in a string and append three dots if needed
export const limitString = (inputString, limit) => {
  if (inputString.length <= limit) {
    return inputString;
  } else {
    return inputString.slice(0, limit) + "...";
  }
};

// Function to check if a document exists in Firestore
export const doesDocumentExist = async (collectionName, documentId) => {
  try {
    // Construct a reference to the document
    const documentRef = doc(db, collectionName, documentId);

    // Try to fetch the document
    const documentSnapshot = await getDoc(documentRef);

    // Check if the document exists
    if (documentSnapshot.exists()) {
      return true; // Document exists
    } else {
      return false; // Document does not exist
    }
  } catch (error) {
    console.error("Error checking document existence:", error);
    throw error; // Handle the error as needed
  }
};

//function to get user data from firestore
export async function getUser(username) {
  const snapshot = await getDoc(doc(db, "users", username));

  const user = snapshot.data();

  if (user) return user;

  return null;
}

// Create or update a subcollection document
export const createOrUpdateSubcollectionDocument = async (
  collectionPath,
  documentId,
  subcollectionName,
  subdocumentId,
  data
) => {
  try {
    const docRef = doc(
      db,
      collectionPath,
      documentId,
      subcollectionName,
      subdocumentId
    );
    await setDoc(docRef, data, { merge: true }); // Use { merge: true } to create or update without overwriting existing data
    return true; // Success
  } catch (error) {
    console.error("Error creating or updating subcollection document:", error);
    return false; // Error occurred
  }
};

// Get all documents from a subcollection
export const getSubcollectionData = async (
  collectionPath,
  documentId,
  subcollectionName
) => {
  try {
    const q = query(
      collection(db, collectionPath, documentId, subcollectionName)
    );
    const querySnapshot = await getDocsFromServer(q);
    const subcollectionData = [];

    querySnapshot.forEach((doc) => {
      subcollectionData.push({ id: doc.id, ...doc.data() });
    });

    return subcollectionData; // Array of subcollection documents
  } catch (error) {
    console.error("Error fetching subcollection data:", error);
    return null; // Error occurred
  }
};

//update a single field in a document
export async function updateFieldInDocument(
  collectionName,
  documentId,
  fieldName,
  newValue
) {
  try {
    const documentRef = doc(db, collectionName, documentId);

    // Use the updateDoc function to update the specified field
    await updateDoc(documentRef, {
      [fieldName]: newValue,
    });

    console.log(`Field "${fieldName}" updated successfully.`);
  } catch (error) {
    console.error("Error updating field:", error);
    throw error; // Handle or propagate the error as needed
  }
}

//update multiple fields in a document
export async function updateFieldsInDocument(
  collectionName,
  documentId,
  fieldsToUpdate
) {
  try {
    const documentRef = doc(db, collectionName, documentId);

    // Use the updateDoc function to update multiple fields
    const res = await updateDoc(documentRef, fieldsToUpdate);
    console.log("Fields updated successfully.");
  } catch (error) {
    console.log("Error updating fields:", error);
    throw new Error(error);
  }
}
//

// // Function to fetch a specific document from a Firestore collection
// export async function fetchDocumentFromFirestore(collectionName, documentId) {
//   try {
//     // Get a reference to the document
//     const documentRef = db.collection(collectionName).doc(documentId);

//     // Fetch the document
//     const doc = await documentRef.get();

//     // Check if the document exists
//     if (doc.exists) {
//       // Access the document data
//       const documentData = doc.data();
//       return documentData;
//     } else {
//       console.log('Document does not exist.');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching document from Firestore:', error);
//     throw error;
//   }
// }

// Function to get all data from a document, including subcollections
export const getAllDataFromDocument = async (
  collectionName,
  documentId,
  subcollectionNames
) => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("Document does not exist.");
    }

    const documentData = documentSnapshot.data();

    // Define an array of subcollections you want to retrieve

    // Fetch data from each subcollection
    const subcollectionsData = {};

    for (const subcollectionName of subcollectionNames) {
      const subcollectionQuery = query(
        collection(documentRef, subcollectionName)
      );
      const subcollectionSnapshot = await getDocs(subcollectionQuery);

      const subcollectionData = subcollectionSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      console.log(subcollectionData);
      subcollectionsData[subcollectionName] = subcollectionData;
    }

    return {
      id: documentSnapshot.id,
      data: documentData,
      subcollections: subcollectionsData,
    };
  } catch (error) {
    console.error("Error getting document data:", error);
    throw error; // Handle or propagate the error as needed
  }
};

// Function to check if a document with a specific field value exists
export const checkIfDocumentExists = async (
  collectionName,
  fieldName,
  fieldValue
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, "==", fieldValue)
    );
    const querySnapshot = await getDocs(q);

    // If any documents match the query, return true
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking document existence:", error);
    return false; // Handle the error and return false
  }
};

export const getDocumentByFieldValue = async (collectionName, field, value) => {
  const q = query(
    collection(db, collectionName), // Replace with your collection name
    where(field, "==", value) // Replace with your field and desired value
  );

  try {
    const querySnapshot = await getDocs(q);
    const documents = [];

    if (!querySnapshot.empty) {
      // Iterate through the matching documents and add their data to the array
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      return documents[0]; // Return the array of document data
    } else {
      // Return an empty array if no documents are found
      return [];
    }
  } catch (error) {
    console.error("Error getting documents:", error);
    // You may want to throw the error or handle it differently based on your use case
    throw error;
  }
};

/**This function returns 10 of documents in a specified collections */
export const getTop10Collections = async () => {
  try {
    const q = query(
      collection(db, 'collections'),
      orderBy("views", "desc"), // Order by views in descending order
      limit(10) // Limit the result to the top collections
    );

    const querySnapshot = await getDocs(q);
    const topCollections = [];

    querySnapshot.forEach((doc) => {
      topCollections.push({ id: doc.id, ...doc.data() });
    });

    return topCollections; // Array of top collections by views
  } catch (error) {
    console.error("Error fetching top collections by views:", error);
    return null; // Error occurred
  }
};

export const createUserDocumentFromAuth = async (userData, username) => {
  const { displayName, email, photoURL, uid } = userData;
  const userDocRef = doc(db, "users", username);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const createdAt = new Date();

    try {
      setDoc(userDocRef, {
        username,
        name: displayName,
        profile_img: {
          url:
            photoURL ||
            "https://firebasestorage.googleapis.com/v0/b/liinkapp-official.appspot.com/o/placholder_images%2Favatar.png?alt=media&token=e616003b-e351-4931-8a3f-bfe91310dd51",
          path: "",
        },
        bio: "",
        phone: "",
        email,

        social_profiles: [],
        uid,
        createdAt,
      });
      return username;
    } catch (error) {
      console.log("Error creating user document", error);
    }
  }
};

export const doesUsernameExist = async (username) => {
  if (!username) return false;
  const documentRef = doc(db, "users", username);

  try {
    const documentSnapshot = await getDoc(documentRef);
    // console.log(documentSnapshot.exists())
    return documentSnapshot.exists();
  } catch (error) {
    console.error("Error checking document existence:", error);
    return false; // Handle the error as needed
  }
};

export const getUsernameByEmail = async (typedEmail) => {
  try {
    // Query Firestore to find a document where 'email' field matches the typed email
    const usersCollection = collection(db, "users"); // Use collection() from Firestore library
    /* WIERD ERROR: TypeError: Cannot read properties of undefined (reading '_ "freezeSettings" ') Fix: https://stackoverflow.com/questions/74747434/unhandled-promise-rejection-typeerror-t-freezesettings-is-not-a-function-i
     */
    const q = query(usersCollection, where("email", "==", typedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If a document with the matching email is found, get its data
      const userData = querySnapshot.docs[0].data();
      const username = userData.username;
      return username;
    } else {
      // If no document matches the email, return null (or handle as needed)
      return null;
    }
  } catch (error) {
    // Handle any errors (e.g., Firestore query errors)
    console.error("Error fetching username by email:", error);
    throw error; // You can choose to throw the error or handle it differently
  }
};

/*










*/
/*------------------------------Other functions----------------------------*/
export const removeProtocolFromUrl = (url) => {
  // Use a regular expression to match and remove "http://" or "https://"
  return url.replace(/^(https?:\/\/)?/, "");
};

export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters from the input
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Check if the number starts with the country code (+233)
  if (cleanedNumber.startsWith("233")) {
    // Format as: +233 24 123 4567
    return `+${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(
      3,
      5
    )} ${cleanedNumber.substring(5, 8)} ${cleanedNumber.substring(8)}`;
  } else if (cleanedNumber.startsWith("0")) {
    // Format as: 024 123 4567
    return `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(
      3,
      6
    )} ${cleanedNumber.substring(6)}`;
  } else {
    // Invalid number, return as is
    return phoneNumber;
  }
};

export const isKeyEmptyInAllObjects = (arr, key) => {
  return arr?.every((obj) => {
    const value = obj[key];
    return value === undefined || value === null || value === 0 || value === "";
  });
};

export const getSocialMediaLink = (type, username) => {
  const lowercasedType = type.toLowerCase();
  if (lowercasedType === "mail") return `mailto:${username}`;

  if (validator.isURL(username, { require_protocol: false })) {
    const hasProtocol = /^https?:\/\//.test(username);

    if (!hasProtocol) {
      return "https://" + username;
    }

    return username;
  }

  switch (lowercasedType) {
    case "facebook":
      return `https://www.facebook.com/${username}`;
    case "twitter":
      return `https://twitter.com/${username}`;
    case "instagram":
      return `https://www.instagram.com/${username}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${username}`;
    case "youtube":
      return `https://www.youtube.com/${username}`;
    case "whatsapp":
      return `https://wa.me/233${username}`;
    case "github":
      return `https://github.com/${username}`;
    case "tiktok":
      return `https://tiktok.com/${username}`;
    case "pinterest":
      return `https://www.pinterest.com/${username}`;
    case "tumblr":
      return `https://${username}.tumblr.com`;
    case "snapchat":
      return `https://www.snapchat.com/add/${username}`;
    case "reddit":
      return `https://www.reddit.com/user/${username}`;
    case "spotify":
      return username;
    case "telegram":
      return `https://t.me/${username}`;

    // Add more cases for other social media platforms

    default:
      return "Invalid social media type";
  }
};

/**A function to upload and store collection images to Firesbase storage */
export const uploadCollectionImagesToFirebase = async (
  imageFiles,
  username,
  collectionID
) => {
  const storage = getStorage();
  const downloadUrls = [];
  const imageObjects = [];
  const filenames = ["image-a", "image-b", "image-c"];

  try {
    // Iterate through each image file
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      // Create a reference to the storage location
      const storageRef = ref(
        storage,
        `collections/${collectionID}/${filenames[i]}`
      );

      // Upload the image file to Firebase Storage
      await uploadBytes(storageRef, imageFile);

      // Get the download URL for the uploaded file
      const imageUrl = await getDownloadURL(storageRef);

      // Add the image object to the array
      const imageObject = {
        id: i + 1, // You can use a unique identifier here if needed
        src: imageUrl,
        alt: `Image ${i + 1}`,
      };
      imageObjects.push(imageObject);
    }

    // Return the array of image objects
    return imageObjects;
  } catch (error) {
    console.error("Error uploading images to Firebase:", error);
    throw error;
  }
};

/**A function to upload and store product images to Firebase storage */
export const uploadProductImagesToFirebase = async (
  imageFiles,
  username,
  productID
) => {
  const storage = getStorage();
  const downloadUrls = [];
  const imageObjects = [];
  const filenames = [
    "image-a",
    "image-b",
    "image-c",
    "image-d",
    "image-e",
    "image-f",
    "image-g",
    "image-h",
    "image-i",
    "image-j",
  ];

  try {
    // Iterate through each image file
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      // Create a reference to the storage location
      const storageRef = ref(storage, `products/${productID}/${filenames[i]}`);

      // Upload the image file to Firebase Storage
      await uploadBytes(storageRef, imageFile);

      // Get the download URL for the uploaded file
      const imageUrl = await getDownloadURL(storageRef);

      // Add the image object to the array
      const imageObject = {
        id: i + 1, // You can use a unique identifier here if needed
        src: imageUrl,
        alt: `Image ${i + 1}`,
      };
      imageObjects.push(imageObject);
    }

    // Return the array of image objects
    return imageObjects;
  } catch (error) {
    console.error("Error uploading images to Firebase:", error);
    throw error;
  }
};

export const uploadImagesByURl = async (imguls, username, productID) => {
  const storage = getStorage();
  const downloadUrls = [];
  let count = 0;
  const filenames = ["image-a", "image-b", "image-c"];

  try {
    // Iterate through each image file
    for (const imgul of imguls) {
      const response = await fetch(imgul);

      if (!response.ok) {
        throw new Error(
          `Failed to download image (HTTP status ${response.status})`
        );
      }
      const imageArrayBuffer = await response.arrayBuffer();

      // Create a reference to the storage location

      const storageRef = ref(
        storage,
        `business/${username}/products/${productID}/${filenames[count]}`
      );

      // Upload the image file to Firebase Storage
      await uploadBytes(
        storageRef,
        Buffer.from(imageArrayBuffer).toString("base64"),
        "data_url"
      );

      // Get the download URL for the uploaded file
      const imageUrl = await getDownloadURL(storageRef);

      // Add the download URL to the array
      downloadUrls.push(imageUrl);
      count++;
    }

    // Return the array of download URLs
    return downloadUrls;
  } catch (error) {
    console.error("Error uploading images to Firebase:", error);
    throw error;
  }
};

// Function to fetch all collections from Firestore
export const getAllCollections = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'collections'));
    const collections = [];

    querySnapshot.forEach((doc) => {
      collections.push({ id: doc.id, ...doc.data() });
    });

    return collections;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

export const addDataToCollection = async (data, collectionId) => {
  try {
    // Add a new document to the products collection
    const collectionRef = collection(db, "collections");
    const collectionDocRef = doc(collectionRef, collectionId);

    // Include a server-generated timestamp
    const timestamp = serverTimestamp();

    await setDoc(collectionDocRef, {
      ...data,
      createdAt: timestamp,
    });

    console.log("Document written with ID:", collectionId);
    return collectionId;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const addProductToStore = async (data, productId) => {
  try {
    // Add a new document to the products collection
    const productsCollectionRef = collection(db, "products");
    const productDocRef = doc(productsCollectionRef, productId);

    // Include a server-generated timestamp
    const timestamp = serverTimestamp();

    await setDoc(productDocRef, {
      ...data,
      createdAt: timestamp,
    });

    console.log("Document written with ID:", productId);
    return productId;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const editProductInStore = async (data, productId) => {
  try {
    const productsCollectionRef = collection(db, "products");
    const productDocRef = doc(productsCollectionRef, productId);

    // Check if the product already exists
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      // Update existing product
      await updateDoc(productDocRef, data);
      console.log("Document updated with ID:", productId);
    } else {
      // Add a new document if the product doesn't exist
      await setDoc(productDocRef, data);
      console.log("Document written with ID:", productId);
    }

    return productId;
  } catch (error) {
    console.error("Error creating/updating document:", error);
    throw error;
  }
};

/**Function to edit a specified document in Firestore */
export const editDocumentInStore = async (data, collectionName, documentId) => {
  try {
    const documentCollectionRef = collection(db, collectionName);
    const docRef = doc(documentCollectionRef, documentId);

    // Check if the document already exists
    const collectionDoc = await getDoc(docRef);

    if (collectionDoc.exists()) {
      // Update existing document
      await updateDoc(docRef, data);
      console.log("Document updated with ID:", documentId);
    } else {
      // Add a new document if the document doesn't exist
      await setDoc(docRef, data);
      console.log("Document written with ID:", documentId);
    }

    return documentId;
  } catch (error) {
    console.error("Error creating/updating document:", error);
    throw error;
  }
};

export const addProductToBusiness = async (bizId, data, productId) => {
  try {
    // Check if the parent document exists
    const parentDocRef = doc(db, "business", bizId);
    const parentDocSnapshot = await getDoc(parentDocRef);

    if (!parentDocSnapshot.exists()) {
      // If the parent document doesn't exist, create it
      throw Error("Business ID does not exist");
      // await setDoc(parentDocRef, {});
    }

    // Add a new document to the specified subcollection
    const subcollectionRef = collection(parentDocRef, "products");
    const productDocRef = doc(subcollectionRef, productId);
    await setDoc(productDocRef, data);

    console.log("Document written with ID:", productId);
    return productId;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const getSubcollectionProducts = async (parentId) => {
  try {
    // Create a query to get documents from the subcollection
    const q = query(collection(db, "business", parentId, "products"));

    // Get the documents
    const querySnapshot = await getDocs(q);

    // Extract data from documents
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error("Error getting subcollection products:", error);
    throw error;
  }
};

// Function to delete a product from Firestore
export const deleteProduct = async (productId) => {
  const productRef = doc(db, "products", productId);

  try {
    await deleteDoc(productRef);
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**Function to delete document from Firestore */
export const deleteDocument = async (collectionName, documentId) => {
  const docRef = doc(db, collectionName, documentId);
  try {
    await deleteDoc(docRef);
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Error deleting:", error);
    throw error;
  }
};

export const deleteProductFromSubcollection = async (
  documentId,
  subdocumentId
) => {
  console.log("deleting");
  console.log(documentId, subdocumentId);
  try {
    // Reference to the document in the main collection
    const mainDocumentRef = doc(db, "business", documentId);

    // Reference to the subcollection document
    const subcollectionDocumentRef = doc(
      mainDocumentRef,
      "products",
      subdocumentId
    );

    // Delete the subcollection document
    await deleteDoc(subcollectionDocumentRef);

    console.log(`Document ${subdocumentId} deleted from products`);
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};

export const getDocumentInSubcollection = async (
  collectionPath,
  docId,
  subcollectionPath,
  subDocId
) => {
  try {
    // Reference to the main document
    const mainDocRef = doc(db, collectionPath, docId);

    // Reference to the subcollection
    const subcollectionRef = collection(mainDocRef, subcollectionPath);

    // Reference to the specific document in the subcollection
    const subDocRef = doc(subcollectionRef, subDocId);

    // Get the document data
    const subDocSnapshot = await getDoc(subDocRef);

    if (subDocSnapshot.exists()) {
      // Document exists, you can access its data
      const subDocData = subDocSnapshot.data();
      return subDocData;
    } else {
      // Document doesn't exist
      console.log("Document not found in subcollection");
      return null;
    }
  } catch (error) {
    console.error("Error getting document in subcollection:", error);
    throw error;
  }
};

export function generateUniqueId(bizName) {
  // Remove spaces and special characters from the business name
  const sanitizedBizName = bizName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Generate a random number (between 1000 and 9999, for example)
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  // Combine the sanitized business name with the random number
  const uniqueId = `${sanitizedBizName}_${randomNumber}`;

  return uniqueId;
}

export const createBizUserDocumentFromAuth = async (
  bizOwnerData,
  bizInfoData,
  userData
) => {
  const { businessName } = bizInfoData;
  const { email, uid } = userData;
  console.log("uid", uid, "email", email);
  const bizID = generateUniqueId(businessName);
  const userDocRef = doc(db, "business", bizID);
  console.log("userDocRef", userDocRef);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const createdAt = new Date();
    const bizData = {
      bizID,
      owner: bizOwnerData,
      business: bizInfoData,
      google_email: email,
      uid: uid,
      createdAt,
    };

    try {
      setDoc(userDocRef, bizData);
      console.log("biz account created sucessfully");
      return { bizID, name: businessName };
    } catch (error) {
      console.log("Error creating user document", error);
    }
  }
};
