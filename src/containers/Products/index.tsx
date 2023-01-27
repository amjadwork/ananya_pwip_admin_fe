import React, { useState, useEffect } from "react";
import { SimpleGrid, ActionIcon } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { Alert } from '@mantine/core';
import api from './../../helper/api';

import PageWrapper from "../../components/Wrappers/PageWrapper";
import axios from "axios";
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
  const handleCloseModal = props.handleCloseModal;
  return <AddProductForm handleCloseModal={handleCloseModal} />;
};

function ProductsContainer(props: any) {
  const navigate = useNavigate();

  // const [stateValue, setStateValue] = useState("");

  const [productList, setProductList] = useState([]);
  const [productIds, setProductIds] = useState("");
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  // console.log(productList, "productList");
  const [error,setError] =useState('');


  useEffect(()=>{
    if(error){
      // return (
        <Alert  title="Bummer!" color="red">
          Something terrible happened! You made a mistake and there is no going back, your data was lost forever!
        </Alert>
      // );
    
    }
  }, [error]);

  // useEffect(() => {
  //   getProduct();
  // }, []);

  useEffect(() => {
    api.get('/product')
      .then((response:any) => {
        setProductList(response.data);
      })
      .catch((error:any) => {
        setError(error);
      });
  }, []);


  // const getProduct = () => {
  //   axios
  //     .get("http://localhost:8000/api/product")
  //     .then((response: any) => {
  //       console.log("response", response);
  //       setProductList(response.data);
        
  //     })
  //     .catch((error) => {
  //       // console.log(error);
  //       setError(error);

  //     });
  // };

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
              onClickAction={() => navigate(`/admin/dashboard/products/${k._id}`)}
            />
          );
        })}
      </SimpleGrid>
    </PageWrapper>
  );
}

export default ProductsContainer;
