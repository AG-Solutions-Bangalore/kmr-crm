import { ArrowBack } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "../../../components/common/ButtonCss";
import { decryptId } from "../../../components/common/EncryptionDecryption";
import {
  EditLoaderComponent,
  ImageLoaderComponent,
} from "../../../components/common/LoaderComponent";
import Layout from "../../../components/Layout";
import { Image_Url, No_Image_Url } from "../../../config/BaseUrl";
import { FETCH_CATEGORY_BY_ID, UPDATE_CATEGORY } from "../../api/UseApi";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [category, setCategory] = useState({
    category_name: "",
    category_status: "",
    categories_images: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageloading, setImageLoading] = useState(true);
  const [loadingdata, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoadingData(true);
      try {
        const response = await FETCH_CATEGORY_BY_ID(decryptedId);
        setCategory(response.data.category);
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to fetch category data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchCategory();
  }, [decryptedId]);

  // Handle input change
  const onInputChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", category.category_name);
    formData.append("category_status", category.category_status);
    if (selectedFile) {
      formData.append("categories_images", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await UPDATE_CATEGORY(decryptedId, formData);
      if (response.data.code == 200) {
        navigate("/master/category");
        toast.success(response.data.msg || "Data updated successfully");
      } else {
        toast.error(response.data.msg || "Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/master/category")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBack />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Edit Category
          </h1>
        </div>
        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="space-y-6 lg:space-y-0 flex  flex-col  lg:flex-row gap-0 lg:gap-2">
                <div className="relative w-48 h-54 flex justify-center items-center">
                  {imageloading && <ImageLoaderComponent />}

                  <img
                    src={
                      category.categories_images === null ||
                      category.categories_images === ""
                        ? `${No_Image_Url}`
                        : `${Image_Url}/categories_images/${category.categories_images}`
                    }
                    alt="Category"
                    className={`w-48 h-54 object-cover rounded-lg transition-opacity duration-300 ${
                      imageloading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
                <div className="flex-1  ">
                  {/* Category Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="category_name"
                      value={category.category_name}
                      onChange={onInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Category Name"
                      required
                      disabled
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      name="categories_images"
                      onChange={onFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      accept=".jpg, .png"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="category_status"
                      value={category.category_status}
                      onChange={onInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/master/category")}
                  className={ButtonCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={ButtonCss}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditCategory;
