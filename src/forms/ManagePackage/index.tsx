import React, { useEffect } from "react";
import { Group, NumberInput, Space} from "@mantine/core";
import { Select, Button} from "../../components/index";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
    _id: "",
    bag: "",
    weight: "",
    unit: "kg",
    cost: "",
    currency: "INR",
    key: randomId(),
};

function EditPackageForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  //to show previous values while editing the row
  useEffect(() => {
  if (updateFormData && modalType === "update") {
    form.setValues(updateFormData);
  }
}, [updateFormData, modalType]);


  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

      return (
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
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
            {...form.getInputProps("bag")}
          />
    
    <Space h="sm" />

    <NumberInput
            required
            hideControls
            label="Weight (in KG)"
            placeholder="eg. 18"
            {...form.getInputProps("weight")}
          />
    
          <Space h="sm" />
    
          <NumberInput
            required
            hideControls
            label="Cost(in INR)/bag"
            placeholder="eg. 18"
            {...form.getInputProps("cost")}
          />
    
          <Group position="right" mt="md" spacing="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      );
    }

export default EditPackageForm;
