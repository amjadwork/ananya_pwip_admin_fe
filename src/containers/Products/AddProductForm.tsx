import React, { useState } from "react";
import { Button, TextInput, Space, ActionIcon, Group } from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { arrayBuffer } from "stream/consumers";

function AddProductForm(props: any) {
  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);


  const [allValue ,setAllValue]=useState({});

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
  const handleClick: any = () => {
    const arr: any = [...categoriesList];
    arr.push(categoriesValue);
    console.log(arr);
    setCategoriesList(arr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleUpdate = (index: number) => {
    const arr: any = [...categoriesList];
    arr[index] = catUpdateValue;
    

    setCategoriesList(arr);

    console.log(arr);
  };

  const handleDeleteItem = (index: number) => {
    const arr: any = [...categoriesList];

    // logic to delete an item starts
    if (index > -1) {
      arr.splice(index, 1);
    }


    // logic to delete an item end

    setCategoriesList(arr);
    console.log(arr);
  };

  const handleSubmit = (values: typeof form.values) => {
    // console.log(values);
    
   const arr:any =[];
   arr.push(values);
   console.log(arr);
   setAllValue(arr);
    

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

      {categoriesList.map((k, i) => {
        return (
          <Group spacing="md">
            <TextInput
              defaultValue={k}
              size="md"
              onChange={(e: any) => setCatUpdateValue(e.target.value)}
              name={"cat_update"}
            />
            <Group spacing="md" position="right">
              <ActionIcon variant="filled" onClick={() => handleDeleteItem(i)}>
                <Minus size={20} />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                disabled={false}
                onClick={() => handleUpdate(i)}
              >
                <Check size={19} />
              </ActionIcon>
            </Group>
          </Group>
        );
      })}

      <TextInput
        label="Categories"
        onChange={(event) => {
          console.log(event.target.value);
          setCategoriesValue(event.target.value);
        }}
        placeholder="eg. Categories"
      />

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
