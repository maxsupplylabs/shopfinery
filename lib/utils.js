// 'use client'
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/firebase/config";
import {
  doc,
  setDoc,
  query,
  collection,
  getDocs,
  updateDoc,
  where,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


// Function to fetch data from a Firestore collection
async function fetchDataFromFirestore(collectionName) {
  try {

    // Get a reference to the collection
    const collectionRef = db.collection(collectionName);

    // Fetch the documents in the collection
    const snapshot = await collectionRef.get();

    // Process the documents
    const data = [];
    snapshot.forEach((doc) => {
      // Access the document data
      const documentData = doc.data();
      data.push(documentData);
    });

    return data;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    throw error;
  }
}

// Example usage
// const collectionName = 'your-collection-name';
// fetchDataFromFirestore(collectionName)
//   .then((data) => {
//     console.log('Data from Firestore:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });


// module.exports = {
//   cn,
//   fetchDataFromFirestore,
// }