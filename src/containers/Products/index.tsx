import React, { useState, useContext, useEffect } from "react";
import { SimpleGrid, Group } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import APIRequest from "./../../helper/api";
import { ErrorContext } from "./../../context/errorContext";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import { ProductCard as Card, ActionIcon, Alert } from "../../components/index";
import PageHeader from "../../components/PageHeader/PageHeader";

import AddProductForm from "../../forms/Products/index";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return (
    <PageHeader
      label="FILTER BY"
      radioOptions={[
        { label: "All", value: "all" },
        { label: "Live", value: "live" },
        { label: "Review", value: "review" },
        { label: "Pending", value: "pending" },
      ]}
      activeFilter={activeFilter}
      handleRadioChange={handleRadioChange}
    />
  );
};

const RenderPageAction = (props: any) => {
  const handleActionClick = props.handleActionClick;

  return (
    <ActionIcon
      variant="filled"
      color="blue"
      sx={{
        "&[data-disabled]": { opacity: 0.4 },
      }}
      onClick={handleActionClick}
    >
      <Plus size={16} />
    </ActionIcon>
  );
};

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  return <AddProductForm handleCloseModal={handleCloseModal} />;
};

function ProductsContainer() {
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const { error, setError } = useContext(ErrorContext);

  useEffect(() => {
    if (error === true) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error, setError]);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const productResponse: any = await APIRequest("product", "GET");
    if (productResponse) {
      setProductList(productResponse);
    }
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
        <RenderPageAction handleActionClick={() => setModalOpen(true)} />
      )}
      modalOpen={modalOpen}
      modalTitle="Add Product"
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => (
        <RenderModalContent
          handleCloseModal={(bool: boolean) => setModalOpen(bool)}
        />
      )}
    >
      <SimpleGrid cols={4} spacing="md">
        {productList.map((k: any, i: any) => {
          return (
            <Card
              key={i}
              title={k.name}
              status={k.status}
              onClickAction={() =>
                navigate(`/admin/dashboard/products/${k._id}`)
              }
            />
          );
        })}
      </SimpleGrid>
      <Group>
        {error ? (
          <Alert title="Bummer!" color="red">
            Something terrible happened! You made a mistake and there is no
            going back, your data was lost forever!
          </Alert>
        ) : null}
      </Group>
    </PageWrapper>
  );
}

export default ProductsContainer;
