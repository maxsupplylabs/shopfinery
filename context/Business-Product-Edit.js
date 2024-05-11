"use client";
import {
  addProductToStore,
  addDataToCollection,
  generateUniqueId,
  uploadProductImagesToFirebase,
  uploadCollectionImagesToFirebase
} from "@/utils/functions";
import { createContext, useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Context = createContext();

export const BizProductContextProvider = ({ children }) => {
  const [saving, setSaving] = useState(false); // to check saving progress
  const [hasChanged, setHasChanged] = useState(0); // to check if any changes
  const [department, setDepartment] = useState('');

  const router = useRouter();

  const pathname = usePathname();
  const bizIDFromPath = pathname.split("/")[2];

  // Add collection data
  const [collectionView, setCollectionView] = useState(0)
  const [collectionData, setCollectionData] = useState({
    title: "",
    description: "",
  });
  const [collectionFiles, setCollectionFiles] = useState([]);
  const [collectionImageSrc, setCollectionImageSrc] = useState([]);

  const [filters, setFilters] = useState([]);
  const [productCategory, setProductCategory] = useState('')
  const [gender, setGender] = useState('')

//   const [productCategory, setProductCategory] = useState('');
// const [filters, setFilters] = useState([]);


  // Handle collection save
  const handleCollectionSave = async () => {
    try {
      setSaving(true);
      console.log("uploading image");
      const collectionID = generateUniqueId(collectionData.title);
      const imgurls = await uploadCollectionImagesToFirebase(
        collectionFiles,
        bizIDFromPath,
        collectionID
      );
      console.log("done uploading images and returning urls", imgurls);
      console.log(bizIDFromPath);
      await addDataToCollection(
        {
          ...collectionData,
          views: collectionView,
          id: collectionID,
          images: imgurls,
          department: department,
          // productCategory,
          // departments,
          // gender,
        },
        collectionID
      );
      toast.success(`Collection added succesfully.`);
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };


  // Add products data
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [isAvailableInGhana, setIsAvailableInGhana] = useState(false);
  const [variations, setVariations] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    confirmed_orders: 0,
    confirmed_sales: 0,
    market_price: 0,
    moq: 0,
    price: 0,
    variations: [],
  });
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState([]);

  const [collections, setCollections] = useState([]);
  const [departments, setDepartments] = useState([]);


  // Handle product save
  const handleProductSave = async () => {
    try {
      setSaving(true);
      console.log("uploading image");
      const productID = generateUniqueId(productData.name);
      const imgurls = await uploadProductImagesToFirebase(
        files,
        bizIDFromPath,
        productID
      );
      console.log("done uploading images and returning urls", imgurls);
    // Convert price and market_price to numbers. 
    const numericPrice = parseFloat(productData.price);
    const numericMarketPrice = parseFloat(productData.market_price);

    await addProductToStore(
      {
        ...productData,
        // colors,
        // sizes,
        isFreeShipping,
        isAvailableInGhana,
        id: productID,
        variations,
        collections,
        departments,
        images: imgurls,
        price: numericPrice,  // Convert to number
        market_price: numericMarketPrice,  // Convert to number
      },
        productID
      );
      toast.success(`Product saved succesfully.`);
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };


  const addToFilter = (filterId) => {
    setFilters((prevFilters) => [...prevFilters, filterId]);
  };
  
  const removeFromFilter = (filterId) => {
    setFilters((prevFilters) =>
      prevFilters.filter((id) => id !== filterId)
    );
  };



const addDepartment = (departmentId) => {
  setDepartments((prevDepartment) => [...prevDepartment, departmentId]);
};

const removeDepartment = (departmentId) => {
  setDepartments((prevDepartment) =>
    prevDepartment.filter((id) => id !== departmentId)
  );
};


const addCollection = (collectionId) => {
  setCollections((prevCollections) => [...prevCollections, collectionId]);
};

const removeCollection = (collectionId) => {
  setCollections((prevCollections) =>
    prevCollections.filter((id) => id !== collectionId)
  );
};

    // Functions to handle variations
    const addVariation = () => {
      const newVariation = { type: "", values: [] };
      setVariations([...variations, newVariation]);
    };
  
    const updateVariationType = (index, value) => {
      const updatedVariations = [...variations];
      updatedVariations[index].type = value;
      setVariations(updatedVariations);
    };
  
    const addVariationValue = (index, value) => {
      const updatedVariations = [...variations];
      updatedVariations[index].values.push(value);
      setVariations(updatedVariations);
    };
  
    const removeVariationValue = (index, valueIndex) => {
      const updatedVariations = [...variations];
      updatedVariations[index].values.splice(valueIndex, 1);
      setVariations(updatedVariations);
    };
  
    const removeVariation = (index) => {
      const updatedVariations = [...variations];
      updatedVariations.splice(index, 1);
      setVariations(updatedVariations);
    };
    const updateVariationValues = (index, values) => {
      const updatedVariations = [...variations];
      updatedVariations[index].values = values;
      setVariations(updatedVariations);
    };

  return (
    <Context.Provider
      value={{
        department,
        setDepartment,
        departments,
        setDepartments,
        addDepartment,
        removeDepartment,
        productCategory,
        setProductCategory,
        gender,
        setGender,
        addToFilter,
        removeFromFilter,
        filters,
        setFilters,
        collectionData,
        setCollectionData,
        isFreeShipping,
        setIsFreeShipping,
        isAvailableInGhana,
        setIsAvailableInGhana,
        collections,
        addCollection,
        removeCollection,
        handleProductSave,
        handleCollectionSave,
        saving,
        setSaving,
        hasChanged,
        setHasChanged,
        colors,
        setColors,
        sizes,
        setSizes,
        variations,
        setVariations,
        productData,
        setProductData,
        collectionFiles,
        setCollectionFiles,
        collectionImageSrc,
        setCollectionImageSrc,
        files,
        setFiles,
        imageSrc,
        setImageSrc,
        addVariation,
        updateVariationType,
        addVariationValue,
        removeVariationValue,
        removeVariation,
        updateVariationValues
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useBizProductContext = () => {
  return useContext(Context);
};