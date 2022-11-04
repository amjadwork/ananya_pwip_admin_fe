import React from "react";
import { SimpleGrid, ActionIcon } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";

import PageWrapper from "../../components/Wrappers/PageWrapper";

import Card from "../../components/Card/Card";
import PageHeader from "../../components/PageHeader/PageHeader";

import AddProductForm from "./AddProductForm";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return (
    <PageHeader
      title="Products"
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
  return <AddProductForm />;
};

function ProductsContainer() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);

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
      ModalContent={() => <RenderModalContent />}
    >
      <SimpleGrid cols={4} spacing="xl">
        <Card
          title="Rice"
          status="Live"
          onClickAction={() => navigate("/admin/dashboard/products/123")}
        />
      </SimpleGrid>
    </PageWrapper>
  );
}

export default ProductsContainer;
