import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./config";

export const replaceImageAndReturnURL = async (
  storagePath,
  previousPath,
  imageFile
) => {
  try {
    // Initialize Firebase Storage
    const storage = getStorage(app);

    // Create references to the previous and new storage paths
    const previousImageRef = ref(storage, previousPath);
    const newImageRef = ref(storage, storagePath);

    // Delete the previous image if it exists
    try {
      await deleteObject(previousImageRef);
    } catch (e) {
      console.log(e);
    }
    // Upload the new image
    const snapshot = await uploadBytes(newImageRef, imageFile);

    // Get the download URL for the new image
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(storagePath, downloadURL);
    return { path: storagePath, url: downloadURL }; // Return path and URL of the new image
  } catch (error) {
    console.error("Error replacing image:", error);
    throw error; // Handle or propagate the error as needed
  }
};
