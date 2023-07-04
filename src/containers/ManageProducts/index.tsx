import React, { useEffect, useState } from "react";
import { Space, Text } from "@mantine/core";
import { Plus, Trash } from "tabler-icons-react";
import { openConfirmModal } from "@mantine/modals";

import APIRequest from "./../../helper/api";
import AddOrEditProductForm from "../../forms/ManageProducts";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";

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
    label: "Price",
    key: "exMill",
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
  const [updateModalOpen, setUpdateModalOpen] = React.useState<boolean>(false);
  const [productData, setProductData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [variantsData, setVariantsData] = useState<any>([]);
  const [tableRowData, setTableRowData] = React.useState<any>([]);
  const [updateFormData, setUpdateFormData] = React.useState<any>(null);

  const [selectedVariantData, setSelectedVariantData] =
    React.useState<any>(null);

  const handleSaveCallback = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    handleGetProductData();
  }, []);

  const handleSave = async (bool: boolean) => {
    const payload = {
      name: productData.name,
      image: productData.image,
      // status: status,
    };

    const updateStatusResponse = await APIRequest(
      `product/${productData._id}`,
      "PUT",
      payload
    );

    if (updateStatusResponse) {
      handleRefreshCalls();
    }
  };

  const handleGetProductData = async () => {
    const productId = window.location.pathname.split("products/")[1];

    const productDetailResponse: any = await APIRequest(
      `product/${productId}`,
      "GET"
    );
    if (productDetailResponse) {
      setProductData(productDetailResponse);
      handleGetCategoryData(productDetailResponse._id);
    }
  };

  const handleGetCategoryData = async (id: string) => {
    const productId = id;

    const categoryDetailResponse: any = await APIRequest(
      `category?_productId=${productId}`,
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
      onConfirm: () => console.log("Confirmed"),
    });

  React.useEffect(() => {
    if (variantsData.length) {
      let tableData: any = [];

      [...variantsData].map((d: any) => {
        d.costing.forEach((l: any) => {
          const obj = {
            ...l,
            variantName: d.name,
            _categoryId: d._categoryId,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [variantsData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        !updateModalOpen ? "Add Product Variant" : "Update Product Variant"
      }
      onModalClose={() => {
        setModalOpen(false);
        setUpdateModalOpen(false);
        setSelectedVariantData(null);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setUpdateModalOpen(bool)}
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

          console.log(formObj);

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
