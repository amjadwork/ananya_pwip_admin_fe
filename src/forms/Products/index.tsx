import React, { useState, useRef } from "react";
import {
  Button,
  TextInput,
  Space,
  ActionIcon,
  Group,
  Flex,
  Box,
  Text,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

function AddProductForm(props: any) {
  const handleCloseModal = props.handleCloseModal;

  const inputRef: any = useRef(null);

  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

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

  const handleAddCategory = () => {
    const arr: any = [...categoriesList];
    const categoryObj = {
      name: categoryInputValue,
    };
    arr.push(categoryObj);
    setCategoriesList(arr);

    setCategoryInputValue("");

    if (inputRef) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveCategory = (index: number) => {
    const arr: any = [...categoriesList];

    if (index > -1) {
      arr.splice(index, 1);
    }

    setCategoriesList(arr);
  };

  const handleSubmit = async (formValues: typeof form.values, props: any) => {
    const payload = {
      name: formValues.name,
      image: formValues.imageURL,
      status: "live",
    };

    const addProductResponse = await APIRequest("product", "POST", payload);

    if (addProductResponse) {
      const payloadCategory = {
        _productId: addProductResponse._id,
        category: categoriesList,
      };

      const addCategoryResponse = await APIRequest(
        "category",
        "POST",
        payloadCategory
      );
      if (addCategoryResponse) {
        handleCloseModal(false);
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Product name"
        placeholder="eg. Rice"
        size="sm"
        {...form.getInputProps("name")}
      />

      <Space h="sm" />

      <TextInput
        label="Image Link"
        placeholder="eg. https://image-url.com/example-image.png"
        size="sm"
        {...form.getInputProps("imageURL")}
      />

      <Space h="sm" />

      <Text
        component="span"
        size="sm"
        sx={() => ({
          marginBottom: 0,
          paddingBottom: 0,
        })}
      >
        Categories
      </Text>

      {categoriesList.map((k: any, i) => {
        return (
          <React.Fragment key={`${k.name}_${i}`}>
            <Flex justify="space-between" align="center" direction="row">
              <Box
                component="div"
                sx={() => ({
                  width: "80%",
                })}
              >
                <TextInput
                  defaultValue={k.name}
                  size="sm"
                  // onChange={(e: any) => setCatUpdateValue(e.target.value)}
                  name={"cat_update"}
                />
              </Box>
              <ActionIcon
                variant="filled"
                onClick={() => handleRemoveCategory(i)}
              >
                <Minus size={20} />
              </ActionIcon>
            </Flex>
            {i !== categoriesList.length - 1 && <Space h="sm" />}
          </React.Fragment>
        );
      })}

      {categoriesList.length ? <Space h="sm" /> : null}

      <Flex justify="space-between" align="flex-end" direction="row">
        <Box
          component="div"
          sx={() => ({
            width: "80%",
          })}
        >
          <TextInput
            placeholder="eg. Categories"
            value={categoryInputValue}
            size="sm"
            onChange={(event) => {
              setCategoryInputValue(event.target.value);
            }}
            ref={inputRef}
          />
        </Box>
        <ActionIcon
          disabled={!categoryInputValue}
          onClick={handleAddCategory}
          color="teal"
          variant="filled"
        >
          {categoryInputValue ? <Check size={20} /> : <Plus size={20} />}
        </ActionIcon>
      </Flex>

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
