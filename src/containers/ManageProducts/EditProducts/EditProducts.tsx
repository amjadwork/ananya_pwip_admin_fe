import React, { useState, useEffect } from "react";
import {
  SimpleGrid,
  Box,
  ActionIcon,
  Group,
  Popover,
  Text,
  Button,
  Select,
  Space,
  Title,
  Badge,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import axios from "axios";
// import { MyContext } from './context';
import { Pencil, X, Check, Plus } from "tabler-icons-react";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import PageHeader from "../../../components/PageHeader/PageHeader";

import EditProductForm from "./EditProductsForm";

import { riceCategory } from "../../../constants/var.constants";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

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
            console.log("here");
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
                  console.log("ttttt");
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
  return <EditProductForm handleCloseModal={handleCloseModal}/>;
};

function EditProductsContainer(props: any) {
  const editModeActive = props.editModeActive;
  const handleEditAction = props.handleEditAction;
  const modalType = props.modalType || "edit";
  const handleEditToUpdateAction = props.handleEditToUpdateAction;
  


  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [status, setStatus] = React.useState<any>("");
  const [productName, setProductName] = useState("");

  // console.log("name", productName);
  // const handleName=()=>{
  //   name:productName
  // }

  useEffect(() => {
    handleProductName();
  }, []);

  // console.log(window.location);
  const handleProductName = () => {
    const productId = window.location.pathname.split("products/")[1];
    axios
      .get(`http://localhost:8000/api/product/${productId}`) //single getproduct api for product name
      .then((response: any) => {
        setProductName(response.data.name);
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = (bool: boolean) => {
    const productId = window.location.pathname.split("products/")[1];

    handleEditAction(bool);
    console.log("updatestatus", status);
    
    const payload={
      "name": "Rice",
      "image": "https://images.unsplash.com/photo-1592997572594-34be01bc36c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "status": status,
    }

    axios
      .put(`http://localhost:8000/api/product/${productId}`, payload)
      .then((response: any) => {
        console.log(response, "putStatus");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <PageWrapper
      PageHeader={() => (
        <RenderPageHeader
          activeFilter={activeFilter}
          handleRadioChange={(value: any, index: number) =>
            setActiveFilter(index)
          }
        />
      )}
      PageAction={() => (
        <RenderPageAction
          editModeActive={editModeActive}
          handleEditAction={handleSave}
        />
      )}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "edit"
          ? "Add Product Variant"
          : "Update BASMATI 1121 SELLA"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "edit") {
          return <RenderModalContent 
          handleCloseModal={(bool: boolean) => setModalOpen(bool)} />;
        }

        if (modalType === "update") {
          return <RenderModalContent 
          handleCloseModal={(bool: boolean) => setModalOpen(bool)}/>;
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
          {/* //productName */}
          <Title order={1}>{productName}</Title>
          <Group spacing="md">
            <Select
              placeholder="Status"
              data={[
                { value: "live", label: "Live" },
                { value: "pending", label: "Pending" },
                { value: "disabled", label: "Disabled" },
                { value: "review", label: "Review" },
              ]}
              onChange={(e: any) => {
                setStatus(e);
              }}
            />
            <Button
              type="submit"
              leftIcon={<Plus size={14} />}
              onClick={() => setModalOpen(true)}
            >
              Add
            </Button>
          </Group>
        </Group>
      </Box>

      <Space h="lg" />

      <SimpleGrid cols={2}>
        {riceCategory.map((cat: any, index: number) => {
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
                  {cat.list.map((d: any, i: number) => (
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
                            handleEditToUpdateAction();
                            setModalOpen(true);
                            console.log(d);
                          }}
                        >
                          <Pencil size={12} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  ))}
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
