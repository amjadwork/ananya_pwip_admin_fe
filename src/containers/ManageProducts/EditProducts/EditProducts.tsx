import React from "react";
import {
  SimpleGrid,
  Box,
  Group,
  Popover,
  Space,
  Title,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";
import { Card as SectionCard, Select, Button, Text, ActionIcon} from "../../../components/index";


import PageWrapper from "../../../components/Wrappers/PageWrapper";
import PageHeader from "../../../components/PageHeader/PageHeader";

import AddOrEditProductForm from "../../../forms/ManageProducts";
import APIRequest from "./../../../helper/api";

const RenderPageHeader = () => {
  return (
    <PageHeader
      title="Manage Products"
      breadcrumbs={[
        { title: "Products", href: "/admin/dashboard/products" },
        { title: "Manage", href: "#" },
      ]}
    />
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
          onClick={() => {
            handleEditAction(false);
          }}
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
                    handleSaveAction(false);
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

function EditProductsContainer(props: any) {
  const productData = props.productData || null;
  const categoryData = props.categoryData || [];
  const editModeActive = props.editModeActive;
  const handleEditAction = props.handleEditAction;
  const modalType = props.modalType || "edit";
  const handleRefreshCalls = props.handleRefreshCalls;
  const handleSaveCallback = props.handleSaveCallback;
  const variantsData = props.variantsData || [];

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<any>(productData.status || "");
  const [selectedVariantData, setSelectedVariantData] =
    React.useState<any>(null);

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

  return (
    <PageWrapper
      PageHeader={() => <RenderPageHeader />}
      PageAction={() => (
        <RenderPageAction
          editModeActive={editModeActive}
          handleEditAction={handleEditAction}
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
                          <Group position="apart">
                            <List.Item>{d.name}</List.Item>

                            <ActionIcon
                              variant="outline"
                              color="gray"
                              size="sm"
                              sx={{
                                "&[data-disabled]": { opacity: 0.4 },
                              }}
                              onClick={() => {
                                setUpdateModalOpen(true);
                                setSelectedVariantData(d);
                              }}
                            >
                              <Pencil size={12} />
                            </ActionIcon>
                          </Group>
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

export default EditProductsContainer;
