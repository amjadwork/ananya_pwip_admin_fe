import React, { useState, useEffect } from "react";
import {
  Group,
  NumberInput,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {Select,Button} from "../../components/index"
import { showNotification } from "@mantine/notifications";

const initialFormValues: any = 
  {
    type: "",
    size: "",
    weight: "26",
    unit: "mt",
  }

function EditContainerForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";
  const [containerType, setContainerType] = useState([
    { value: 'Standard Dry', label: 'Standard Dry' },
    { value: 'Open top', label: 'Open top' },
    { value: 'Flat Rack', label: 'Flat Rack' },
    { value: 'ISO Tank', label: 'ISO Tank' },
    { value: 'Refrigerated (Reefer)', label: 'Refrigerated (Reefer)' },
    { value: 'Open side (One door open)', label: 'Open side (One door open)' },
   
  ]);

  const containerSize =[
    { value: "20 FT", label: "20 FT" },
    { value: "40 FT", label: "40 FT" },
    { value: "40 FT HC", label: "40 FT High Cube" },
    { value: "45 FT HC", label: "45 FT High Cube" },
  ]

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  useEffect(() => {
    if (updateFormData && modalType === "update") {
      form.setValues(updateFormData);
    }
  }, [updateFormData, modalType]);

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill all field", color: "red" });
    }
  };

  const handleSubmit = async (formValues: typeof form.values) => {
    handleCloseModal(false);
    handleSaveAction(formValues);
  };
console.log(form.values, "form")
  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        creatable
        searchable
        label="Container Type"
        data={containerType}
        placeholder="eg. Standard Dry"
        getCreateLabel={(query:any) => `+ Create ${query}`}
        onCreate={(query:any) => {
          const item = { value: query, label: query };
          setContainerType((current:any) => [...current, item]);
          return item;
        }}
        {...form.getInputProps("type")}
      />

<Space h="md" />

   <Select
        required
        hideControls
        label="Container Size"
        placeholder="eg. 20FT"
        data={containerSize}
        {...form.getInputProps("size")}
      />

     <Space h="md" />

     <NumberInput
        required
        hideControls
        label="Weight (in tonnes)"
        defaultValue={26}
        placeholder="eg. 26MT"
        {...form.getInputProps("weight")}
      />

      <Space h="md" />

      <Group position="right" mt="md" spacing="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditContainerForm;
