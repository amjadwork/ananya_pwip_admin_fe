import React, { useRef, useEffect } from "react";
import {
  Group,
  NumberInput,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {Select,Button} from "../../components/index"
import { showNotification } from "@mantine/notifications";

const initialFormValues: any ={
    bag: "",
    weight: "",
    unit: "",
    cost: "",
    currency: "",
  };
  

function EditPackageForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveCallback = props.handleSaveCallback;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";
  const modalOpen = props.modalOpen || false;

  const inputRef: any = useRef(null);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },

    validate: {
      bag: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
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
    handleSaveCallback(formValues);
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
        hideControls
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
        hideControls
        label="Cost(in INR)/bag"
        placeholder="eg. 18"
        ref={inputRef}
        {...form.getInputProps("cost")}
      />

      <Group position="right" mt="md" spacing="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditPackageForm;
