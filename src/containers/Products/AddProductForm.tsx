import React, { useState, useEffect, useRef } from "react";
import { Button, TextInput, Space, ActionIcon, Group } from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { arrayBuffer } from "stream/consumers";
import axios from "axios";
import { DialogBody } from "@mantine/core/lib/Dialog/Dialog";
// import ProductsContainer from "./index";

function AddProductForm(props: any) {
  const handleCloseModal = props.handleCloseModal;

  const inputRef: any = useRef(null);

  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [allValue, setAllValue] = useState({});
  // const [productId,setProductId]=React.useState<any>(null);
  // console.log(productId,"productId");

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      imageURL: "",
      categoriesList: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      imageURL: (value) =>
        value.length === 0
          ? null
          : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
              value
            )
          ? null
          : "Invalid URL",
    },
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleClick:any = () => {
    const arr: any = [...categoriesList];
    const categoryObj = {
      name: categoriesValue,
    };
    arr.push(categoryObj);
    setCategoriesList(arr);

    setCategoriesValue("");
    if (inputRef) {
      inputRef.current.value = "";
    }
    
  };

 

  const handleDeleteItem = (index: number) => {
    const arr: any = [...categoriesList];

    // logic to delete an item starts
    if (index > -1) {
      arr.splice(index, 1);
    }

    // logic to delete an item end

    setCategoriesList(arr);
    // console.log(arr);
  };

  const handleSubmit = (values: typeof form.values, props: any) => {
    const arr: any = [];
    arr.push(values);
    setAllValue(arr);

    //post productApi
    const payload = {
      name: values.name,
      image: values.imageURL,
      status: "live",
    };

    axios
      .post("http://localhost:8000/api/product", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response: any) => {
        console.log(response.data._id, "post");
        //  setProductId(response.data._id);
        //post categoryApi
        const payloadCategory = {
          _productId: response.data._id,
          category: categoriesList,
        };
        axios
          .post("http://localhost:8000/api/category", payloadCategory)
          .then((catRes: any) => {
            console.log("response cat", catRes);
            handleCloseModal(false);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Product name"
        placeholder="eg. Rice"
        {...form.getInputProps("name")}
      />

      <Space h="sm" />

      <TextInput
        label="Image Link"
        placeholder="eg. https://image-url.com/example-image.png"
        {...form.getInputProps("imageURL")}
      />

      <Space h="sm" />

      {categoriesList.map((k: any, i) => {
        return (
          <Group spacing="md">
            <TextInput
              defaultValue={k.name}
              size="md"
              onChange={(e: any) => setCatUpdateValue(e.target.value)}
              name={"cat_update"}
            />
            <Group spacing="md" position="right">
              <ActionIcon variant="filled" onClick={() => handleDeleteItem(i)}>
                <Minus size={20} />
              </ActionIcon>
            </Group>
          </Group>
        );
      })}

      <TextInput
        label="Categories"
        placeholder="eg. Categories"
        value={categoriesValue}
        onChange={(event) => {
          setCategoriesValue(event.target.value);
        }}
        ref={inputRef}
      />
      <Space h="md" />
      <Button onClick={handleClick}>+</Button>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit" leftIcon={<Plus size={14} />}>
          Add
        </Button>
      </Group>
    </form>
  );
}

export default AddProductForm;
