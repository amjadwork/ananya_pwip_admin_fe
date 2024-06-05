import React, { useEffect, useState } from "react";
import { Group, NumberInput, Space, Grid, Box } from "@mantine/core";
import { Select, Button, ActionIcon } from "../../components/index";
import { Trash, CurrencyDollar, CurrencyRupee } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
  _originPortId: "",
  destinations: [
    {
      _destinationPortId: "",
      _containerId: "",
      ofcCharge: "",
      ofcChargeInDollars: "",
      key: randomId(),
    },
  ],
};

const CONVERSION_RATE= 83;


function EditOfcForm(props: any) {
  const originSelectOptions = props.originSelectOptions;
  const containerSelectOptions = props.containerSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";
  const { handleGetDestinationDataByOrigin } = props;
  const [destinationOptions, setDestinationOptions] = useState<any>([]);
  
  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

    const forexRateFromStorage = sessionStorage.getItem("forexRate");
    const CONVERSION_RATE = forexRateFromStorage? parseFloat(forexRateFromStorage): 83;

  useEffect(() => {
    if (updateFormData && modalType === "update") {
      form.setValues(updateFormData);
    }
  }, [updateFormData, modalType]);

  const handleRupeesChange = (value: number | undefined, index: number) => {
    const rupees = value || 0;
    form.setFieldValue(`destinations.${index}.ofcCharge`, rupees);
    form.setFieldValue(
      `destinations.${index}.ofcChargeInDollars`,
      (rupees / CONVERSION_RATE).toFixed(2)
    );
  };

  const handleDollarsChange = (value: number | undefined, index: number) => {
    const dollars = value || 0;
    form.setFieldValue(`destinations.${index}.ofcChargeInDollars`, dollars);
    form.setFieldValue(
      `destinations.${index}.ofcCharge`,
      (dollars * CONVERSION_RATE).toFixed(2)
    );
  };

  // Listen for changes in the ofcCharge (Rupees) field and update the corresponding Dollars field
  useEffect(() => {
    form.values.destinations.forEach((item: any, index: number) => {
      if (item.ofcCharge !== undefined) {
        const rupees = item.ofcCharge;
        const dollars = (rupees / CONVERSION_RATE).toFixed(2);
        if (item.ofcChargeInDollars !== dollars) {
          form.setFieldValue(
            `destinations.${index}.ofcChargeInDollars`,
            dollars
          );
        }
      }
    });
  }, [form.values.destinations]);

  // Listen for changes in the ofcChargeInDollars (Dollars) field and update the corresponding Rupees field
  useEffect(() => {
    form.values.destinations.forEach((item: any, index: number) => {
      if (item.ofcChargeInDollars !== undefined) {
        const dollars = item.ofcChargeInDollars;
        const rupees = (dollars * CONVERSION_RATE).toFixed(2);
        if (item.ofcCharge !== rupees) {
          form.setFieldValue(`destinations.${index}.ofcCharge`, rupees);
        }
      }
    });
  }, [form.values.destinations]);

  const handleAddItem = () => {
    form.insertListItem("destinations", {
      ...initialFormValues.destinations[0],
      key: randomId(),
    });
  };

  const handleRemoveItem = (index: number) => {
    form.removeListItem("destinations", index);
  };

  useEffect(() => {
    const fetchDestinationOptions = async () => {
      if (form.values._originPortId) {
        try {
          const response = await handleGetDestinationDataByOrigin(
            form.values._originPortId
          );
          setDestinationOptions(response);
        } catch (error) {
          console.error("Error fetching destination data:", error);
        }
      }
    };
    fetchDestinationOptions();
  }, [form.values._originPortId]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

  const fields = form.values.destinations.map((item: any, index: number) => (
    <React.Fragment key={item.key}>
      <Group
        spacing="md"
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[2]}`,
          borderRadius: 12,
          padding: 12,
          backgroundColor: theme.colors.gray[0],
        })}
      >
        <Grid>
          <Grid.Col span={10}>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  required
                  searchable
                  label="Select Destination Port"
                  placeholder="eg. Singapore"
                  data={destinationOptions}
                  disabled={modalType === "update"}
                  {...form.getInputProps(
                    `destinations.${index}._destinationPortId`
                  )}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <Select
                  required
                  searchable
                  label="Select Container Type"
                  placeholder="eg. Standard Dry"
                  data={containerSelectOptions}
                  disabled={modalType === "update"}
                  {...form.getInputProps(`destinations.${index}._containerId`)}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <NumberInput
                  required
                  precision={2}
                  hideControls
                  label="OFC Charges"
                  description="in Rupees"
                  icon={<CurrencyRupee size={18} />}
                  placeholder="2515.29"
                  value={parseFloat(form.values.destinations[index].ofcCharge)}
                  onChange={(value) => handleRupeesChange(value, index)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  precision={2}
                  hideControls
                  label=" "
                  description="in Dollars"
                  icon={<CurrencyDollar size={18} />}
                  placeholder="30.02"
                  value={parseFloat(
                    form.values.destinations[index].ofcChargeInDollars
                  )}
                  onChange={(value) => handleDollarsChange(value, index)}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={2}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
              }}
            >
              {form.values.destinations.length > 1 && modalType !== "update" ? (
                <Group spacing="md" position="right" margin-bottom="5px">
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash size="1rem" />
                  </ActionIcon>
                </Group>
              ) : null}
            </div>
          </Grid.Col>
        </Grid>
      </Group>
      <Space h="md" />
    </React.Fragment>
  ));

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Select
        required
        searchable
        label="Select Origin Port"
        placeholder="eg. Chennai"
        data={originSelectOptions}
        disabled={modalType === "update"}
        {...form.getInputProps("_originPortId")}
        sx={() => ({
          marginBottom: 18,
        })}
      />

      {fields}

      {modalType === "add" ? (
        <Group
          sx={(theme) => ({
            borderRadius: 12,
            padding: 12,
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          <Box
            style={{
              textAlign: "right",
              width: "auto",
              color: "blue",
            }}
          >
            <div onClick={handleAddItem}>+ Add More</div>
          </Box>
        </Group>
      ) : null}

      <Group position="right" mt="sm">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditOfcForm;
