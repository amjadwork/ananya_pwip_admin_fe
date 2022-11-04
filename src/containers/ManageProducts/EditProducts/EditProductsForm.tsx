import React from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
} from "@mantine/core";
import { Plus, ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { riceCategory } from "../../../constants/var.constants";

function EditProductForm(props: any) {
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
    let arr: any = [];

    if (values.category === "Basmati") {
      arr = [...riceCategory[0].list];
      arr.push(values);
      console.log("arr 1", arr);
    } else {
      arr = [...riceCategory[1].list];
      arr.push(values);
      console.log("arr 2", arr);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Category"
        placeholder="Eg. Non-Basmati"
        data={[
          { value: "non-basmati", label: "Non-Basmati" },
          { value: "basmati", label: "Basmati" },
        ]}
        {...form.getInputProps("category")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant name"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("name")}
      />

      <Space h="md" />

      <Group spacing="md" grow>
        <Select
          required
          label="Source Location"
          placeholder="Eg. Kolkata"
          data={[]}
          {...form.getInputProps("source")}
        />

        <NumberInput
          required
          label="Ex-Mill Price"
          placeholder="Eg. 26500"
          {...form.getInputProps("exMillPrice")}
        />
        <Select
          required
          label="Origin Port"
          placeholder="Eg. CHENNAI"
          data={[]}
          {...form.getInputProps("origin")}
        />
        <NumberInput
          required
          label="Transportation"
          placeholder="Eg. 1600"
          {...form.getInputProps("transportation")}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <ArrowRightCircle size={24} style={{ marginTop: `14%` }} />
          <Space w="md" />
          <Select
            required
            label="Destination Port"
            placeholder="Eg. SINGAPORE"
            style={{
              width: "100%",
            }}
            data={[]}
            {...form.getInputProps("destination")}
          />
        </div>
      </Group>

      <Space h="md" />

      <NumberInput
        required
        label="Ex-Mill Price (INR)"
        placeholder="Eg. 26500"
        {...form.getInputProps("exmill")}
      />

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditProductForm;
