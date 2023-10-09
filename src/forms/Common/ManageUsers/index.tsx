import React, { useEffect, useState } from "react";
import {
  Grid,
  NumberInput,
  Space,
  TextInput,
  Select,
  Group,
} from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";

const initialFormValues = {
  roll_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  phone: "",
};

function EditUsersForm(props: any) {
  const rolesData = props.rolesData;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const roleOptions = rolesData.map((list: any) => ({
    value: list._id,
    label: list.role.charAt(0).toUpperCase() + list.role.slice(1).toLowerCase(), 
  }));

  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const updatedFormData = {
        ...updateFormData,
      };

      if (updatedFormData.full_name) {
        const [first_name, ...rest] = updatedFormData.full_name.split(" ");
        const last_name = rest.pop() || "";
        const middle_name = rest.join(" ");

        form.setValues({
          ...updatedFormData,
          first_name,
          middle_name,
          last_name,
        });
      } else {
        form.setValues(updatedFormData);
      }
    }
  }, [updateFormData, modalType]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    const full_name = `${formValues.first_name} ${formValues.middle_name} ${formValues.last_name}`;
    const payload = {
      ...formValues,
      full_name,
    };

    handleSaveAction(payload);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <TextInput
            required
            label="First Name"
            placeholder=""
            {...form.getInputProps("first_name")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Middle Name"
            placeholder=""
            {...form.getInputProps("middle_name")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Last Name"
            placeholder=""
            {...form.getInputProps("last_name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            {...form.getInputProps("email")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            required
            label="Mobile"
            placeholder=""
            hideControls
            {...form.getInputProps("phone")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            required
            hideControls
            label="Role"
            data={roleOptions}
            placeholder="eg. admin"
            {...form.getInputProps("role_id")}
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

export default EditUsersForm;
