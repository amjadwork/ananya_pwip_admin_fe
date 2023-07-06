import React, { useEffect, useState } from "react";
import { Space, Text } from "@mantine/core";
import { Plus, Trash } from "tabler-icons-react";
import { openConfirmModal } from "@mantine/modals";

import AddOrEditProductForm from "../../forms/ManageProducts";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import {
  getSpecificProductData,
  getSpecificCategoryData,
  getSpecificVariantData,
  deleteSpecificVariantData,
} from "../../services/export-costing/Products"
import APIRequest from "../../helper/api";
import { riceData } from "../../constants/riceData.constants";


// const columns = [
//   {
//     label: "Variant",
//     key: "variantName",
//     sortable: true,
//   },
//   {
//     label: "Category",
//     key: "_categoryId",
//     sortable: true,
//   },
//   {
//     label: "Price",
//     key: "exMill",
//   },
//   {
//     label: "Action",
//     key: "action",
//   },
// ];

const columns = [
    {
      label: "Variant",
      key: "variantName",
      sortable: true,
    },
    {
      label: "Category",
      key: "_categoryId",
      sortable: true,
    },
    {
      label:"Source",
      key:"sourceName"
 
     },
    {
      label: "Price",
      key: "price",
    },
    {
      label: "Action",
      key: "action",
    },
  ];

  console.log("riceDataDummy", riceData);
 

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const categoryData = props.categoryData;
  const handleSaveCallback = props.handleSaveCallback;
  const variantsData = props.variantsData;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType;

  let regionCostingList: any = [];

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

  const [selectedVariantData, setSelectedVariantData] =
    React.useState<any>(null);

  const handleSaveCallback = (payload: any) => {
    setModalOpen(false);
    handleSave(payload);
  };
  const handleSave = async (payload: any) => {
    let variantPayload = { ...payload };

    const addVariantResponse = await APIRequest(
      "variant",
      modalType === "add" ? "POST" : "PATCH",
      variantPayload
    );

    if (addVariantResponse) {
      handleRefreshCalls();
    }
  };

  // const handleDeleteVariant = async (data: any) => {
  //   const deleteVariantResponse = await APIRequest(
  //     "variant" + "/" + data._id,
  //     "DELETE"
  //   );

  const handleDeleteVariant = async (data: any) => {
    // const response = await deleteSpecificVariantData(data);
    console.log(data)

    // if (response) {
    //   handleRefreshCalls();
    // }
  };

  const handleGetProductData = async () => {
    const productId = window.location.pathname.split("products/")[1];
    const response: any = await getSpecificProductData(productId);

    const productDetailResponse: any = await APIRequest(
      `product/${productId}`,
      "GET"
    );
    if (productDetailResponse) {
      handleGetCategoryData(productDetailResponse._id);
    }
  };

  const handleGetCategoryData = async (id: string) => {
    const productId = id;
    const response: any = await getSpecificCategoryData(productId);

    if (response) {
      setCategoryData(response[0].category || []);
      const categoryIdArr = response[0].category.map(
        (cat: any) => cat._id
      );
      handleGetVariantData(categoryIdArr);
    }
  };

  const handleGetVariantData = async (id: Array<[]>) => {
    const categoryIds = id;
    const response: any = await getSpecificVariantData(categoryIds);

    if (response) {
      setVariantsData(response);
    }
  };

  const handleRefreshCalls = () => {
    handleGetProductData();
  };

  const openDeleteModal = (data: any) =>
    openConfirmModal({
      title: "Delete the variant",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the variant record for{" "}
          {data._originPortId || null} to {data._destinationPortId || null}?
          This action is destructive and you will have to contact support to
          restore your data.
        </Text>
      ),
      labels: { confirm: "Delete variant", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteVariant(data),
    });

  React.useEffect(() => {
    if (riceData.length) {
      let tableData: any = [];

      [...riceData].map((d: any) => {
        d.sourceRates.forEach((l: any) => {
          const obj = {
            ...l,
            variantName: d.variantName,
            _categoryId: d._categoryId,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [riceData]);

  // React.useEffect(() => {
  //   if (riceData.length && categoryData.length) {
  //     let tableData: any = [];
  
  //     riceData.forEach((d: any) => {
  //       d.sourceRates.forEach((l: any) => {
  //         const category = categoryData.find(
  //           (category:any) => category._id === d._categoryId
  //         );
  //         const categoryName = category ? category.name : "";
  
  //         const obj = {
  //           ...l,
  //           variantName: d.variantName,
  //           categoryName: categoryName,
  //         };
  //         tableData.push(obj);
  //       });
  //     });
  
  //     setTableRowData(tableData);
  //   }
  // }, [riceData, categoryData]);
  
  console.log("categoryData", categoryData)
  console.log("table", tableRowData)
  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add Product Variant" : "Update Product Variant"
      }
      onModalClose={() => {
        setModalOpen(false);
        setSelectedVariantData(null);
        setUpdateFormData(null);
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
          />
        );
      }}
      modalSize="70%"
    >
      <Space h="sm" />
      <DataTable
        data={tableRowData}
        columns={columns}
        actionItems={[
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
        handleRowEdit={(row: any, rowIndex: number) => {
          let obj = { ...row };

          const formObj = {
            _categoryId: obj._categoryId,
            name: obj.variantName,
            region: [obj],
          };

          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        handleRowDelete={(row: any, rowIndex: number) => {
          openDeleteModal(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManageProductsContainer;
