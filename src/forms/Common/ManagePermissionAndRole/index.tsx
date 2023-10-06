import React, { useEffect, useState } from "react";
import { Grid, Space, Select, Group, MultiSelect } from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";

const initialFormValues = {
  permissionId: [],
  roleId: "",
};

function EditPermissionAndRoleForm(props: any) {
  const rolesData = props.rolesData;
  const permissionsData = props.permissionsData;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const [permissionsList, setPermissionsList] = useState<string[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const permissionOptions = permissionsData.map((list: any) => ({
    value: list._id,
    label: list.permission,
  }));
  const roleOptions = rolesData.map((list: any) => ({
    value: list._id,
    label: list.role,
  }));

  const validateForm = (formValues: typeof form.values) => {
    if (formValues.permissionId.length === 0) {
      setPermissionError("required");
      return false;
    }
    setPermissionError(null);
    return true;
  };

  const handlePermissionChange = (newPermissionValues: string[]) => {
    setPermissionsList(newPermissionValues);
    form.setValues((prevValues: any) => ({
      ...prevValues,
      permissionId: newPermissionValues,
    }));
    validateForm({ ...form.values, permissionId: newPermissionValues });
  };
  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const updatedFormData = {
        ...updateFormData,
      };
      setPermissionsList(updatedFormData.permissionId || []);
      form.setValues(updatedFormData);
    }
  }, [updateFormData, modalType]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    if (validateForm(formValues)) {
      handleSaveAction(formValues);
      handleCloseModal(false);
      form.setValues(initialFormValues);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <Select
            required
            hideControls
            label="Role"
            disabled={modalType === "update" ? true : false}
            data={roleOptions}
            placeholder="eg. admin"
            {...form.getInputProps("roleId")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiSelect
            required
            label="Permission"
            data={permissionOptions}
            value={permissionsList}
            onChange={handlePermissionChange}
            placeholder="select permission/s"
            clearButtonLabel="Clear selection"
            error={permissionError}
            clearable
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

export default EditPermissionAndRoleForm;
