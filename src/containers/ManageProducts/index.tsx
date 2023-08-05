import React, { useEffect, useState } from "react";
import { Space, Text } from "@mantine/core";
import { Plus, Upload } from "tabler-icons-react";
import { openConfirmModal } from "@mantine/modals";

import APIRequest from "./../../helper/api";
import AddOrEditProductForm from "../../forms/ManageProducts";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import SheetUpload from "../../components/SheetUpload/SheetUpload";
import { getChangedPropertiesFromObject } from "../../helper/helper";


const columns = [
  {
    label: "Code",
    key: "HSNCode",
  },
  {
    label: "Variant",
    key: "variantName",
    sortable: true,
  },
  {
    label: "Category",
    key: "categoryName",
    sortable: true,
  },
  {
    label: "Source",
    key: "sourceName",
    sortable: true,
  },
  {
    label: "Price",
    key: "price",
  },
  {
    label: "Unit",
    key: "unit",
  },
  {
    label: "Action",
    key: "action",
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

  let regionCostingList: any = [];

  if (modalType === "upload") {
    return (
      <SheetUpload />
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
      regionCostingList={regionCostingList}
      variantsData={variantsData}
      updateFormData={updateFormData}
      modalType={modalType}
      modalOpen={modalOpen}
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

  const handleSaveCallback = (payload: any) => {
    setModalOpen(false);
    handleSave(payload);
  };

  useEffect(() => {
    handleGetProductData();
  }, []);

  const handleSave = async (payload: any) => {
    let variantPayload = { ...payload, _productId: productId };
    let params = "";
    let changedProperties = {};

    if (modalType === "update") {
      changedProperties = getChangedPropertiesFromObject(
        tableRowData[selectedTableRowIndex],
        variantPayload.sourceRates[0]
      );

      variantPayload = {
        ...changedProperties,
        _variantId: payload?.sourceRates[0]._variantId,
        _sourceRateId: payload?.sourceRates[0]._id,
      };

      params = `/${variantPayload._variantId}/${variantPayload._sourceRateId}`;
    }

    let endpoint = "variant";

    if (params) {
      endpoint = "variant" + params;
    }

    const addVariantResponse = await APIRequest(
      endpoint,
      modalType === "add" ? "POST" : "PATCH",
      modalType === "add" ? variantPayload : changedProperties
    );

    if (addVariantResponse) {
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
          Are you sure you want to delete the variant record for{" "}
          {rowData.variantName || null} from {rowData._sourceId || null}? This
          action is destructive and you will have to contact support to restore
          your data.
        </Text>
      ),
      labels: { confirm: "Delete variant", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteVariant(rowData),
    });

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

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
          modalType === "add"
            ? "Add Product Variant"
            : modalType === "upload"
            ? "Upload Data from Excel Sheet"
            : "Update Variant Price and Source Location"
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
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
          />
        );
      }}
      modalSize="50%"
    >
      <Space h="sm" />
      <DataTable
        data={tableRowData}
        columns={columns}
        actionItems={[

          {
            label: "Upload",
            icon: Upload,
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalType("upload");
              setModalOpen(true);    
            },
          },
          {
            label: "Add",
            icon: Plus,
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalType("add");
              setModalOpen(true);
            },
          },
        ]}
        handleRowEdit={(row: any, index: number) => {
          let obj = { ...row };
          
          setSelectedTableRowIndex(index);

          const formObj = {
            _categoryId: obj._categoryId,
            variantName: obj.variantName,
            HSNCode: obj.HSNCode,
            brokenPercentage: obj.brokenPercentage,
            sourceRates: [{ ...obj }],
          };

          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        handleRowDelete={(row: any) => {
          openDeleteModal(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManageProductsContainer;
