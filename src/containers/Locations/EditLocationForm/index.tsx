import React, { useEffect } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
} from "@mantine/core";
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { locationCat } from "../../../constants/var.constants";

function EditLocationFormContainer(props: any) {
  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      category: "",
      source: "",
      origin: "",
      destination: "",
      exMillPrice: "",
      transportation: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    let arr:any=[];
    if (values.name=== "Source Location") {
      arr = [...locationCat[0].list];
      arr.push(values);
      console.log("arr 1", arr);
    } 
    if(values.name === "Origin Ports") 
    {
      arr = [...locationCat[1].list];
      arr.push(values);
      console.log("arr 1", arr);}
    else {
      arr = [...locationCat[2].list];
      arr.push(values);
      console.log("arr 3", arr);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select location type"
        placeholder="Eg. Source"
        data={[
          { value: "source", label: "Source" },
          { value: "origin", label: "Origin" },
          { value: "destination", label: "Destination" },
        ]}
        {...form.getInputProps("category")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Location name"
        placeholder="eg. Kolkata"
        {...form.getInputProps("name")}
      />

      <Space h="md" />

      <TextInput
        required
        label="City name"
        placeholder="eg. Kolkata"
        {...form.getInputProps("city")}
      />

      <Space h="md" />

      <Select
        required
        label="Select country"
        placeholder="Eg. Source"
        data={[
          { value: "india", label: "India" },
          { value: "singapore", label: "Singapore" },
          { value: "vietnam", label: "Vietnam" },
        ]}
        {...form.getInputProps("category")}
      />

      <Space h="lg" />

      <Group position="right" mt="md" spacing="md">
        <Button type="button" color="blue" variant="subtle">
          Save & add another
        </Button>
        <Button type="submit">Add</Button>
      </Group>
    </form>
  );
}

export default EditLocationFormContainer;
