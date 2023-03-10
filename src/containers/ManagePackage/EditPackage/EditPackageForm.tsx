import React, { useState, useEffect, useRef } from "react";
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
import APIRequest from "../../../helper/api";

function EditPackageForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveCallback = props.handleSaveCallback;

  const inputRef: any = useRef(null);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      bag: "",
      weight: "",
      unit: "",
      cost: "",
      currency: "",
    },
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill all field", color: "red" });
    }
  };

  const handleSubmit = async (formValues: typeof form.values) => {
    let obj: any = { ...formValues };
    obj.currency = "INR";

    const payload = { ...obj };

    const addPackagingResponse = await APIRequest("packaging", "POST", payload);

    if (addPackagingResponse) {
      handleSaveCallback();
      handleCloseModal(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Bag"
        placeholder="Eg. BOPP"
        data={[
          { value: "BOPP", label: "BOPP" },
          { value: "PPWOVEN", label: "PPWOVEN" },
          { value: "PE", label: "PE" },
          { value: "JUTE", label: "JUTE" },
        ]}
        ref={inputRef}
        {...form.getInputProps("bag")}
      />

      <Space h="md" />

      <NumberInput
        required
        label="Weight (in KG)"
        placeholder="eg. 18"
        ref={inputRef}
        {...form.getInputProps("weight")}
      />

      <Space h="md" />

      <Select
        required
        label="Select weight unit"
        placeholder="Eg. KG"
        data={[
          { value: "KG", label: "KG" },
          { value: "QUINTEL", label: "Quintel" },
          { value: "METRIC TON", label: "Metric Ton" },
        ]}
        ref={inputRef}
        {...form.getInputProps("unit")}
      />

      <Space h="md" />

      <NumberInput
        required
        label="Cost per bag"
        placeholder="eg. 18"
        ref={inputRef}
        {...form.getInputProps("cost")}
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

export default EditPackageForm;
