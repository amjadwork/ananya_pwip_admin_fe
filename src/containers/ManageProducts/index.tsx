import React, { useEffect, useState } from "react";
import {
  SimpleGrid,
  Box,
  Group,
  Popover,
  Space,
  Title,
  Badge,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Plus, Check } from "tabler-icons-react";
import {
  Card as SectionCard,
  Button,
  Select,
  Text,
  ActionIcon,
} from "../../components/index";

import APIRequest from "./../../helper/api";
import AddOrEditProductForm from "../../forms/ManageProducts/index";
// import EditProductsContainer from "./EditProducts/EditProducts";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

const RenderPageHeader = () => {
  return (
    <Group>
      <PageHeader
        breadcrumbs={[
          { title: "Products", href: "/admin/dashboard/products" },
          { title: "Manage", href: "#" },
        ]}
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
    <ActionIcon
      variant="filled"
      color="gray"
      sx={{
        "&[data-disabled]": { opacity: 0.4 },
      }}
      onClick={() => handleEditAction(true)}
    >
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
  const [productData, setProductData] = useState<any>("");
  const [categoryData, setCategoryData] = useState<any>([]);
  const [variantsData, setVariantsData] = useState<any>([]);
  const [sourceList, setSourceList] = useState<any>([]);
  const [sourceSelectOptions, setSourceSelectOptions] = React.useState<any>([]);

  const [updateModalOpen, setUpdateModalOpen] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<any>(productData.status || "");
  const [selectedVariantData, setSelectedVariantData] =
    React.useState<any>(null);

  useEffect(() => {
    handleGetProductData();
    handleGetSource();
  }, []);

  const handleSave = async (bool: boolean) => {
    const payload = {
      name: productData.name,
      image: productData.image,
      status: status,
    };

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

  const handleGetSource = async () => {
    const sourceResponse = await APIRequest(
      "location?filterType=source",
      "GET"
    );
    console.log("sourceResponse", sourceResponse[0]);
    setSourceList(sourceResponse[0].source);

    if (sourceResponse) {
      const sourceOptions = sourceResponse[0].source.map((d: any) => {
        return {
          label: d.region,
          value: d._id,
        };
      });
      setSourceSelectOptions(() => [...sourceOptions]);
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

  if (editModeActive) {
    return (
      <AddOrEditProductForm
        editModeActive={editModeActive}
        handleEditAction={(bool: boolean) => setEditModeActive(() => bool)}
        modalType={modalType}
        modalOpen={modalOpen}
        handleEditToUpdateAction={handleEditToUpdateAction}
        productData={productData || null}
        categoryData={categoryData}
        handleRefreshCalls={handleRefreshCalls}
        handleSaveCallback={handleGetProductData}
        variantsData={variantsData}
      />
    );
  }

  return (
    <PageWrapper
      PageHeader={() => <RenderPageHeader />}
      PageAction={() => (
        <RenderPageAction
          handleActionClick={() => setModalOpen(true)}
          handleEditAction={handleSave}
          editModeActive={editModeActive}
          handleSaveAction={handleSave}
        />
      )}
      modalOpen={modalOpen || updateModalOpen}
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
            />
          );
        }

        if (updateModalOpen && selectedVariantData) {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setUpdateModalOpen(bool)}
              categoryData={categoryData}
              variantsData={selectedVariantData}
            />
          );
        }
      }}
      modalSize="70%"
    >
      <Box
        sx={(theme: any) => ({
          display: "block",
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.dark[7],
          textAlign: "center",
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          cursor: "default",
        })}
      >
        <Group position="apart">
          <Title order={1}>{productData?.name || ""}</Title>
          <Badge size="lg" color="green" variant="light">
            {productData?.status || ""}
          </Badge>
          {editModeActive && (
            <Group spacing="md">
              <Select
                placeholder="Status"
                data={[
                  { value: "live", label: "Live" },
                  { value: "pending", label: "Pending" },
                  { value: "disabled", label: "Disabled" },
                  { value: "review", label: "Review" },
                ]}
                defaultValue={productData?.status || "Select status"}
                onChange={(value: any) => {
                  setStatus(value);
                }}
              />
              <Button
                type="submit"
                leftIcon={<Plus size={14} />}
                onClick={() => setModalOpen(true)}
              >
                Add Variant
              </Button>
            </Group>
          )}
        </Group>
      </Box>

      <Space h="lg" />

      <SimpleGrid cols={2}>
        {categoryData?.map((cat: any, index: number) => {
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}>{cat.name}</Title>
              <Space h="xl" />
              <ScrollArea
                scrollbarSize={2}
                style={{ maxHeight: 380, height: 360 }}
              >
                <List type="ordered" spacing="lg">
                  {variantsData.map((d: any, i: number) => {
                    if (d._categoryId === cat._id) {
                      return (
                        <Box
                          key={i}
                          sx={(theme: any) => ({
                            display: "block",
                            backgroundColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : "#fff",
                            color:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[4]
                                : theme.colors.dark[7],
                            textAlign: "left",
                            padding: theme.spacing.md,
                            borderRadius: theme.radius.md,
                            cursor: "default",

                            "&:hover": {
                              backgroundColor:
                                theme.colorScheme === "dark"
                                  ? theme.colors.dark[5]
                                  : theme.colors.gray[1],
                            },
                          })}
                        >
                          <List.Item>
                            {d.name}{" "}
                            <Text
                              size="sm"
                              sx={(theme: any) => ({
                                color: theme.colors.dark[1],
                              })}
                            >
                              available at {d.costing.length} region
                            </Text>
                          </List.Item>
                        </Box>
                      );
                    }
                  })}
                </List>
              </ScrollArea>
            </SectionCard>
          );
        })}
      </SimpleGrid>
    </PageWrapper>
  );
}

export default ManageProductsContainer;
