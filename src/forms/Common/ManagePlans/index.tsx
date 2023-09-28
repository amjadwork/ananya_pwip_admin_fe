import React, { useEffect, useState } from "react";
import {
  Grid,
  NumberInput,
  Space,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Group,
  MultiSelect,
} from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";

const initialFormValues = {
  name: "",
  description: "",
  validity_type: "",
  validity: "",
  applicable_services: [],
  refund_policy: false,
  refund_policy_valid_day: 0,
  price: "",
  currency: "INR",
};

function EditPlansForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const servicesData = props.servicesData;
  const modalType = props.modalType || "add";

  const [applicableServices, setApplicableServices] = useState<string[]>([]);

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const validityType = [
    { value: "days", label: "Days" },
    { value: "hours", label: "Hours" },
    { value: "usage-cap", label: "Usage Cap" },
  ];

  const servicesOptions = servicesData
    .filter((option: any) => option.active === 1)
    .map((list: any) => ({
      value: list.id,
      label: list.name,
    }));

  const handleServiceChange = (newServiceValues: string[]) => {
    setApplicableServices(newServiceValues);
    form.setValues((prevValues: any) => ({
      ...prevValues,
      applicable_services: newServiceValues,
    }));
  };

  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const updatedFormData = {
        ...updateFormData,
        price: parseFloat(updateFormData.price),
      };

      // Set the applicable_services state and form values
      setApplicableServices(updatedFormData.applicable_services || []); // Ensure it's an array
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
        <Grid.Col span={12}>
          <TextInput
            required
            label="Name of Plan"
            placeholder="eg. EXIM Data Plan-399"
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            placeholder="Write here"
            label="Description(optional)"
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiSelect
            data={servicesOptions}
            required
            label="Applicable Services"
            placeholder="Pick all that you like"
            value={applicableServices}
            onChange={handleServiceChange}
            clearButtonLabel="Clear selection"
            clearable
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            required
            label="Price"
            placeholder="eg. 599.00"
            precision={2}
            hideControls
            {...form.getInputProps("price")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            required
            hideControls
            label="Validity Type"
            data={validityType}
            placeholder="eg. days"
            {...form.getInputProps("validity_type")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            required
            label="Valid for (in hours or days)"
            placeholder="eg. 30 days"
            hideControls
            {...form.getInputProps("validity")}
          />
        </Grid.Col>
        <Grid.Col span={12} mt="sm">
          <Checkbox
            label="Refund Policy Applicable"
            size="sm"
            checked={form.values.refund_policy}
            {...form.getInputProps("refund_policy")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            required
            hideControls
            label="Refundable for (in days)"
            placeholder="eg. 7 days"
            disabled={!form.values.refund_policy}
            {...form.getInputProps("refund_policy_valid_day")}
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

export default EditPlansForm;
