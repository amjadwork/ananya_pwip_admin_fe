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
import { packagingBags } from "../../../constants/var.constants";

function EditPackagingFormContainer(props: any) {
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
    if (values.category === "ppwoven") {
      arr = [...packagingBags[0].list];
      arr.push(values);
      console.log("arr 1", arr);
    } else {
      arr = [...packagingBags[1].list];
      arr.push(values);
      console.log("arr 2", arr);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Bag"
        placeholder="Eg. BOPP"
        data={[
          { value: "bopp", label: "BOPP" },
          { value: "ppwoven", label: "PPWOVEN" },
        ]}
        {...form.getInputProps("category")}
      />

      <Space h="md" />

      <NumberInput
        required
        label="Weight (in KG)"
        placeholder="eg. 18"
        {...form.getInputProps("name")}
      />

      <Space h="md" />

      <NumberInput
        required
        label="Cost per bag"
        placeholder="eg. 18"
        {...form.getInputProps("costPerBag")}
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

export default EditPackagingFormContainer;
