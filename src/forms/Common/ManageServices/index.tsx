import React, { useEffect } from "react";
import { Grid, Space, TextInput, Select, Group } from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";

const initialFormValues = {
  name: "",
  type: "",
};

function EditServicesForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const serviceTypes = [
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const updatedFormData = {
        ...updateFormData,
      };
      form.setValues(updatedFormData);
    }
  }, [updateFormData, modalType]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Grid gutter="sm">
        <Grid.Col span={6}>
          <TextInput
            required
            label="Name of Service"
            placeholder="eg. Enterprise"
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            required
            hideControls
            label="Type"
            data={serviceTypes}
            placeholder="eg. Service"
            {...form.getInputProps("type")}
          />
        </Grid.Col>
      </Grid>

      <Space h="sm" />
      <Group position="right" mt="md" spacing="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditServicesForm;
