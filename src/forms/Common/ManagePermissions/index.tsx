import React, { useEffect, useState } from "react";
import { Grid, Space, TextInput, Group, Select } from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";

const initialFormValues = {
  string1: "",
  string2: "",
};

function EditPermissionsForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  //to show previous values while editing the row'
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const updatedFormData = { ...updateFormData };
      const [string1, string2] = updatedFormData.permission.split(":");

      form.setValues({
        string1,
        string2,
      });
    }
  }, [updateFormData, modalType]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    const permission = `${formValues.string1}:${formValues.string2}`;
    let payload;

    if (modalType === "update") {
      payload = {
        _id: updateFormData._id,
        permission,
      };
    } else {
      payload = {
        permission,
      };
    }

    console.log("payload", payload);
    handleSaveAction(payload);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Grid gutter="md">
        <Grid.Col span={5}>
          <TextInput
            required
            label="Resource Group"
            placeholder="eg. EC"
            {...form.getInputProps("string1")}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <br></br>
          <span
            style={{ fontSize: "1.2rem", fontWeight: "bold", padding: ".5rem" }}
          >
            :
          </span>
        </Grid.Col>
        <Grid.Col span={5}>
          <TextInput
            required
            label="Permission Type"
            placeholder="eg. read"
            {...form.getInputProps("string2")}
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

export default EditPermissionsForm;
