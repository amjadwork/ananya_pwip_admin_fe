import React, { useState } from "react";
import {
  Group,
  TextInput,
  NumberInput,
  Space,
} from "@mantine/core";
import { Button, Select, ActionIcon} from "../../../components/index";
// import { Plus, Minus, Check } from "tabler-icons-react";
// import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { manageOthers } from "../../../constants/var.constants";

function EditOthersForm(props: any) {
  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const [allValue, setAllValue] = useState({});
  const handleCloseModal=props.handleCloseModal;

  const form = useForm({
    clearInputErrorOnChange: true,
    // initialValues: {
    //   name: "",
    //   category: "",
    //   city: "",
    //   state: "",
    //   // destination: "",
    //   exmill: "",
    //   // transportation: "",
    // },

    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  const handleClick: any = () => {
    const arr: any = [...categoriesList];
    arr.push(categoriesValue);
    console.log(arr);
    setCategoriesList(arr);
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

  const handleSubmit = (values: typeof form.values) => {
    let arr: any = [];
    console.log(values, "values");
    handleCloseModal(false);


  
   };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Enter Others Charges"
        placeholder="Eg. 20% Export Duty"
        {...form.getInputProps("others")}
      />

      <Space h="md" />

      

      

      <Space h="md" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditOthersForm;
