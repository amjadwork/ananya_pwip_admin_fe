import React, { useEffect, useState } from "react";
import { Space, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import APIRequest from "./../../helper/api";
import AddOrEditProductForm from "../../forms/ManageProducts";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import ReactTable from "../../components/ReactTable/ReactTable";
import SheetUpload from "../../components/SheetUpload/SheetUpload";
import RiceProfilePage from "../../components/RiceProfilePage/RiceProfilePage";
import { getChangedPropertiesFromObject, hasEditPermission, hasAddNewPermission, hasDeletePermission } from "../../helper/helper";
import { getSpecificVariantProfileData } from "../../services/rice-price/variant-profile";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "50px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "HSN Code",
    accessor: "HSNCode",
    width: "200px",
    sortable: true,
    fixed: false,
    disableFilters: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Variant Name",
    accessor: "variantName",
    width: "300px",
    sortable: true,
    fixed: false,
    disableFilters: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Category",
    accessor: "categoryName",
    width: "200px",
    sortable: true,
    fixed: false,
    disableFilters: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Source Location",
    accessor: "sourceName",
    width: "200px",
    sortable: true,
    fixed: false,
    disableFilters: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Price(per kg)",
    accessor: "price",
    width: "200px",
    sortable: true,
    fixed: false,
    disableFilters: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "110px",
    sortable: false,
    fixed: true,
    disableFilters: true,
    filterable: false,
    showCheckbox: false,
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const categoryData = props.categoryData;
  const handleSaveCallback = props.handleSaveCallback;
  const variantsData = props.variantsData;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType;
  const modalOpen = props.modalOpen;
  const containerType = props.containerType;
  const handlePictureChange = props.handlePictureChange;
  const handleRiceProfilePatch = props.handleRiceProfilePatch;
  const handleRiceProfilePost = props.handleRiceProfilePost;
  const variantProperties = props.variantProperties;
  console.log(variantProperties, "inside render");

  let regionCostingList: any = [];

  if (modalType === "upload") {
    return <SheetUpload containerType={containerType} />;
  }

  if (modalType === "rice-profile-page") {
    return (
      <RiceProfilePage
        variantsData={variantsData}
        variantProperties={variantProperties}
      />
    );
  }

  if (variantsData) {
    regionCostingList = [...variantsData.costing];
  }

  return (
    <AddOrEditProductForm
      handleCloseModal={handleCloseModal}
      categoryData={categoryData}
      handleSaveCallback={handleSaveCallback}
      handleRiceProfilePatch={handleRiceProfilePatch}
      handleRiceProfilePost={handleRiceProfilePost}
      regionCostingList={regionCostingList}
      variantsData={variantsData}
      updateFormData={updateFormData}
      modalType={modalType}
      modalOpen={modalOpen}
      handlePictureChange={handlePictureChange}
    />
  );
};

function ManageProductsContainer(props: any) {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [modalType, setModalType] = React.useState<string>("add"); //add or update
  const [categoryData, setCategoryData] = useState<any>([]);
  const [variantsData, setVariantsData] = useState<any>([]);
  const [tableRowData, setTableRowData] = React.useState<any>([]);
  const [updateFormData, setUpdateFormData] = React.useState<any>(null);
  const [productId, setProductId] = React.useState<any>(null);
  const [selectedTableRowIndex, setSelectedTableRowIndex] =
    React.useState<any>(null);
  const [selectedVariantData, setSelectedVariantData] =
    React.useState<any>(null);
  const [selectedVariantProperties, setSelectedVariantProperties] =
    React.useState<any>(null);
  const containerType: any = "variant";

  const handleSaveCallback = (payload: any) => {
    setModalOpen(false);
    handleSave(payload);
  };

  useEffect(() => {
    handleGetProductData();
  }, []);

  const handleGetVariantProfileData = async (id: any) => {
    const response = await getSpecificVariantProfileData(id);
    if (response) {
      setSelectedVariantProperties(response[0]);
    }
    setModalType("rice-profile-page");
    setModalOpen(true);
  };

  const handleSave = async (payload: any) => {
    let variantPayload = { ...payload, _productId: productId };
    let params = "";
    let changedProperties = {};

    if (modalType === "update") {
      changedProperties = getChangedPropertiesFromObject(
        updateFormData,
        variantPayload
      );
      variantPayload = {
        ...changedProperties,
        images: variantPayload.images,
      };
      params = `/${payload._variantId}`;
    }
    let endpoint = "variant";

    if (params) {
      endpoint = "variant" + params;
    }

    const addVariantResponse = await APIRequest(
      endpoint,
      modalType === "add" ? "POST" : "PATCH",
      modalType === "add" ? variantPayload : variantPayload
    );

    if (addVariantResponse) {
      if (modalType === "add") {
        for (const key in addVariantResponse) {
          delete payload[key];
        }
        const postRiceProfilePayload = {
          ...payload,
          brokenPercentage: {
            rangeFrom: 0,
            rangeTo: addVariantResponse?.brokenPercentage || 0,
            note: "",
            unit: "%",
          },
          variantId: addVariantResponse._id,
        };
        handleRiceProfilePost(postRiceProfilePayload);
      }
      handleRefreshCalls();
    }
  };

  const handleRiceProfilePatch = async (payload: any) => {
    let params = "";
    params = `/${payload._id}`;
    let endpoint = "service/rice-price/variant-profiles";

    if (params) {
      endpoint = "service/rice-price/variant-profiles" + params;
    }

    const addVariantResponse = await APIRequest(endpoint, "PATCH", payload);

    if (addVariantResponse) {
      handleRefreshCalls();
    }
  };

  const handleRiceProfilePost = async (payload: any) => {
    let endpoint = "service/rice-price/variant-profiles";

    const postRiceProfileResponse = await APIRequest(endpoint, "POST", payload);

    if (postRiceProfileResponse) {
      handleRefreshCalls();
    }
  };

  const handleDeleteVariant = async (data: any) => {
    const deleteVariantResponse = await APIRequest(
      "variant" + "/" + data._variantId + "/" + data._id,
      "DELETE"
    );

    if (deleteVariantResponse) {
      handleRefreshCalls();
    }
  };

  const handleGetProductData = async () => {
    const selectedProductId = window.location.pathname.split("products/")[1];

    if (selectedProductId) {
      setProductId(selectedProductId);
      handleGetCategoryData(selectedProductId);
    } else {
      setProductId(null);
    }
  };

  const handleGetCategoryData = async (id: string) => {
    const selectedProductId = id;

    const categoryDetailResponse: any = await APIRequest(
      `category?_productId=${selectedProductId}`,
      "GET"
    );
    if (categoryDetailResponse) {
      setCategoryData(categoryDetailResponse[0].category || []);
      const categoryIdArr = categoryDetailResponse[0].category.map(
        (cat: any) => cat._id
      );
      handleGetVariantData(categoryIdArr);
    }
  };

  const handleGetVariantData = async (ids: Array<[]>) => {
    const categoryIds = ids;

    const variantResponse: any = await APIRequest(
      `variant?_categoryId=${categoryIds}`,
      "GET"
    );
    if (variantResponse) {
      setVariantsData(variantResponse);
    }
  };

  const handleRefreshCalls = () => {
    handleGetProductData();
  };

  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the variant",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the variant record{" "}
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            {rowData.variantName || null}
          </span>{" "}
          ?
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "red",
              marginTop: "10px",
            }}
          >
            This action is destructive and you will have to contact support to
            restore your data.
          </div>
        </Text>
      ),
      labels: { confirm: "Delete variant", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteVariant(rowData),
    });

  const handleGenerateSignedUrl = (
    e: any,
    fileName: any,
    ext: any,
    variantName: any,
    categoryName: any
  ) => {
    fileName = fileName.replace(/\s/g, "_");
    const directory = `product/${categoryName}/${variantName}/`; // Constructing the directory parameter

    const c = APIRequest(
      `generate-signed-url?fileName=${fileName}&extension=${ext}&mediaType=image&directory=${directory}`,
      "GET"
    )
      .then((res: any) => {
        if (res) {
          const uri = res.url;
          const path = res.key;
          const fileSrc = e;
          const imageObject = {
            uri,
            fileSrc,
            path,
          };
          return imageObject;
        }
      })
      .catch((error: any) => {
        console.error("Error fetching signed URL:", error);
        // Handle the error as needed
      });
    return c;
  };

  const handlePictureChange = async (
    e: any,
    variantName: any,
    categoryName: any
  ) => {
    const file = e;

    const extString = file.type;
    const extStringArr = extString.split("/");
    const ext = extStringArr[1];
    const name = `${Math.floor(Date.now() / 1000)}`;
    const result = await handleGenerateSignedUrl(
      e,
      name,
      ext,
      variantName,
      categoryName
    );
    return result;
  };

  React.useEffect(() => {
    if (variantsData.length && categoryData.length) {
      let tableData: any = [];

      [...variantsData].forEach((d: any) => {
        d?.sourceRates?.forEach((l: any) => {
          const obj = {
            ...l,
            priceWithUnit: `${l.price} per ${l.unit || "Kgs"}`,
            variantName: d.variantName,
            HSNCode: d.HSNCode,
            _categoryId: d._categoryId,
            brokenPercentage: d.brokenPercentage,
            tags: d.tags,
            images: d.images,
            categoryName: categoryData.find(
              (cat: any) => cat._id === d._categoryId
            )?.name,
            _variantId: d._id,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [variantsData, categoryData]);

  const actionButtons = [
    {
      label: "Upload Excel Sheet",
      color: "gray",
      type: "button",
      onClickAction: () => {
        setModalType("upload");
        setModalOpen(true);
      },
    },
    {
      label: "Add New",
      color: "gray",
      type: "button",
      onClickAction: () => {
        setModalOpen(true);
        setModalType("add");
      },
    },
  ];
  
  const conditionalActionButtons = hasAddNewPermission()
    ? actionButtons
    : actionButtons.slice(0, 1);
  

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? (
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Add New Variant Details
          </span>
        ) : modalType === "upload" ? (
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Update Or Add Data by Excel Sheet
          </span>
        ) : modalType === "rice-profile-page" ? (
          ""
        ) : (
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Update Variant Details
          </span>
        )
      }
      onModalClose={() => {
        setModalOpen(false);
        setSelectedVariantData(null);
        setUpdateFormData(null);
        setSelectedTableRowIndex(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            categoryData={categoryData}
            handleSaveCallback={handleSaveCallback}
            variantsData={selectedVariantData}
            variantProperties={selectedVariantProperties}
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
            containerType={containerType}
            handlePictureChange={handlePictureChange}
            handleRiceProfilePatch={handleRiceProfilePatch}
            handleRiceProfilePost={handleRiceProfilePost}
          />
        );
      }}
      modalSize="70%"
      isVariantProfile={modalType === "rice-profile-page" ? true : false}
    >
      <Space h="sm" />
      <ReactTable
        data={tableRowData}
        columns={columns}
        actionButtons={conditionalActionButtons}
        onEditRow={(row: any, index: any) => {
          if (hasEditPermission()) {
            let obj = { ...row };

            setSelectedTableRowIndex(index);
            const formObj = {
              _categoryId: obj._categoryId,
              _variantId: obj._variantId,
              variantName: obj.variantName,
              brokenPercentage: obj.brokenPercentage,
              HSNCode: obj.HSNCode,
              tags: obj.tags,
              images: obj.images,
              sourceRates: [
                {
                  _id: obj._id,
                  price: obj.price,
                  _sourceId: obj._sourceId,
                },
              ],
            };
            setUpdateFormData(formObj);
            setModalType("update");
            setModalOpen(true);
          }
        }}
        onDeleteRow={
          hasDeletePermission()
            ? (rowData: any) => {
                openDeleteModal(rowData);
              }
            : undefined
        }
        handleRiceProfile={(row: any) => {
          handleGetVariantProfileData(row._variantId);
          setSelectedVariantData(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManageProductsContainer;
