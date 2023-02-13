import React, { useEffect, useState } from "react";
import {
  SimpleGrid,
  Box,
  ActionIcon,
  Group,
  Popover,
  Text,
  Button,
  Space,
  Title,
  Badge,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check } from "tabler-icons-react";
import APIRequest from "./../../helper/api";

import EditProductsContainer from "./EditProducts/EditProducts";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

const RenderPageHeader = () => {
  return (
    <Group>
      <PageHeader
        title="Manage Products"
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
            sx={(theme) => ({
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
            })}
          >
            <Text size="sm">Are you sure you want to save the changes</Text>
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

function ManageProductsContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("edit");
  const [productData, setProductData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [variantsData, setVariantsData] = useState<any>([]);

  useEffect(() => {
    handleGetProductData();
  }, []);

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

  if (editModeActive) {
    return (
      <EditProductsContainer
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
          handleEditAction={handleEditAction}
          editModeActive={editModeActive}
        />
      )}
    >
      <Box
        sx={(theme) => ({
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
                          sx={(theme) => ({
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
                              sx={(theme) => ({
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
