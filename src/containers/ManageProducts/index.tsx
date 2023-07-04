import React, { useEffect, useState } from "react";
import {
  Group,
  Popover,
  Space,
} from "@mantine/core";
import { Pencil, X, Plus, Check } from "tabler-icons-react";
import {
  Button,
  Text,
  ActionIcon,
} from "../../components/index";
import APIRequest from "./../../helper/api";
import AddOrEditProductForm from "../../forms/ManageProducts";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";
import DataTable from "../../components/DataTable/DataTable";



const columns = [
  {
    label: "Variant",
    key: "_destinationPortId",
    sortable: true,
  },
  {
    label: "Category",
    key: "_categoryId",
    sortable: true,
  },
  {
    label: "Price",
    key: "chaCharge",
  },
  {
    label: "Action",
    key: "action",
  },
  
];
const RenderPageHeader = (props: any) => {
  return (
    <Group>
      <PageHeader
      // breadcrumbs={[
      //   { title: "Products", href: "/admin/dashboard/products" },
      //   { title: "Manage", href: "#" },
      // ]}
      />
    </Group>
  );
};

const RenderPageAction = (props: any) => {
  const handleSaveAction = props.handleSaveAction;
  const handleEditAction = props.handleEditAction;
  const editModeActive = props.editModeActive;

  if (editModeActive) {
    return (
      <Group position="right" spacing="md">
        <ActionIcon
          variant="filled"
          color="gray"
          sx={{
            "&[data-disabled]": { opacity: 0.4 },
          }}
          onClick={() => handleEditAction(false)}
        >
          <X size={16} />
        </ActionIcon>

        <Popover
          width={250}
          trapFocus
          position="bottom-end"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <ActionIcon
              variant="filled"
              color="blue"
              sx={{
                "&[data-disabled]": { opacity: 0.4 },
              }}
            >
              <Check size={16} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown
            sx={(theme: any) => ({
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
            })}
          >
            <Text size="sm">Are you sure you want to save the changes?</Text>
            <Space h="sm" />
            <Group position="right" spacing="md">
              <Button
                size="xs"
                color="gray"
                onClick={() => {
                  handleEditAction(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                color="blue"
                onClick={() => {
                  if (handleSaveAction) {
                    handleSaveAction();
                  }
                  handleEditAction(false);
                }}
              >
                Save
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Group>
    );
  }

  return (
    <ActionIcon >
      <Pencil size={16} />
    </ActionIcon>
  );
};

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const categoryData = props.categoryData;
  const handleSaveCallback = props.handleSaveCallback;
  const variantsData = props.variantsData;

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
    />
  );
};

function ManageProductsContainer(props: any) {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("edit");
  const [updateModalOpen, setUpdateModalOpen] = React.useState<boolean>(false);
  const [productData, setProductData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [variantsData, setVariantsData] = useState<any>([]);
  const [sourceList, setSourceList] = useState<any>([]);
  const [sourceSelectOptions, setSourceSelectOptions] = React.useState<any>([]);
  const [tableRowData, setTableRowData] = React.useState<any>([]);

  const [status, setStatus] = React.useState<any>(productData?.status || "");
  const [selectedVariantData, setSelectedVariantData] =
    React.useState<any>(null);

  const handleSaveCallback = props.handleSaveCallback;

  useEffect(() => {
    handleGetProductData();
  }, []);

  const handleSave = async (bool: boolean) => {
    const payload = {
      name: productData.name,
      image: productData.image,
      // status: status,
    };
    console.log("here",payload)

    const updateStatusResponse = await APIRequest(
      `product/${productData._id}`,
      "PUT",
      payload
    );

    if (updateStatusResponse) {
      handleRefreshCalls();
      handleEditAction(bool);
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
      handleEditAction(false);
    }
  };

  const handleEditAction = (bool: boolean) => {
    setEditModeActive(() => bool);
    setModalType("edit");
  };

  const handleEditToUpdateAction = () => {
    setModalType("update");
    setModalOpen(true);
  };

  const handleRefreshCalls = () => {
    handleGetProductData();
  };

  console.log("category", categoryData)
  console.log("variant", variantsData)

  React.useEffect(() => {
    if (variantsData.length) {
      let tableData: any = [];

      [...variantsData].map((d: any) => {
        d.costing.forEach((l: any) => {
          const obj = {
            ...l,
            originPort: d.name,
            _originPortId: d._originId,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [variantsData]);

  return (
    // <PageWrapper
    //   PageHeader={() => null}
    //   PageAction={() => null}
    //   modalOpen={modalOpen}
    //   modalTitle={
    //     modalType === "add" ? "Add Product" : "Update Product"
    //   }
    //   modalSize="60%"
    //   onModalClose={() => {
    //     setModalOpen(false);
    //     setUpdateModalOpen(false);
    //     setSelectedVariantData(null);
    //   }}
    //   ModalContent={() => {
    //       return (
    //         <RenderModalContent
    //           handleCloseModal={(bool: boolean) => setModalOpen(bool)}
    //           categoryData={categoryData}
    //           handleSaveCallback={handleSaveCallback}
    //         />
    //       );
    //     }}
    //     >
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
    }}
    ModalContent={() => {
      if (modalType === "edit" && !updateModalOpen) {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            categoryData={categoryData}
            handleSaveCallback={handleSaveCallback}
          />
        );
      }

      if (updateModalOpen && selectedVariantData) {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setUpdateModalOpen(bool)}
            categoryData={categoryData}
            handleSaveCallback={handleSaveCallback}
            variantsData={selectedVariantData}
          />
        );
      }
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
        // handleRowEdit={(row: any, rowIndex: number) => {
        //   let obj = { ...row };
        //   delete obj["updatedAt"];
        //   delete obj["_id"];
        //   delete obj["_originPortId"];
        //   delete obj["createdAt"];
        //   delete obj["originPort"];

        //   const formObj = {
        //     _originPortId: row._originPortId,
        //     destinations: [obj],
        //   };

        //   setUpdateFormData(formObj);
        //   setModalType("update");
        //   setModalOpen(true);
        // }}
        // handleRowDelete={(row: any, rowIndex: number) => {
        //   openDeleteModal(row);
        // }}
      />


    </PageWrapper>
  );
}

export default ManageProductsContainer;
