import React, { useState, useRef } from "react";
import {
  Group,
  TextInput,
  NumberInput,
  Space,
  Flex,
} from "@mantine/core";
import { Minus, Check, Plus } from "tabler-icons-react";
import { Button,Select,ActionIcon } from "../../components/index";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

function AddOrEditProductForm(props: any) {
  const inputRef: any = useRef(null);

  const handleCloseModal = props.handleCloseModal;
  const categoryData = props.categoryData || [];
  const handleSaveCallback = props.handleSaveCallback;
  const variantsData = props.variantsData;

  const [variantRegionCostingList, setVariantRegionCostingList] = useState<any>(
    variantsData?.costing || []
  );
  const [numberValue, setNumberValue] = useState(0);
  const [regionValue, setRegionValue] = useState("");
  const [regionOptions, setRegionOptions] = useState<any>([]);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: variantsData?.name || "",
      _categoryId: variantsData?._categoryId || "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const handleGetRegions: any = async () => {
    const regionResponse = await APIRequest(
      "location?filterType=source",
      "GET"
    );

    if (regionResponse) {
      const options: any = regionResponse[0].source.map((d: any) => ({
        label: d.region,
        value: d._id,
      }));
      setRegionOptions([...options]);
    }
  };

  const handleAddRegionCost: any = () => {
    let arr: any = [...variantRegionCostingList];
    const regionName = regionOptions.filter((d: any) => {
      if(d.value === regionValue) {
        return d
      }
    })[0].label
    const categoryObj = {
      regionName: regionName,
      region: regionValue,
      exMill: numberValue,
    };
    arr.push(categoryObj);
    setVariantRegionCostingList(arr);

    setRegionValue("");

    if (inputRef) {
      inputRef.current.value = "";
    }

    // setNumberValue(0);

    if (inputRef) {
      inputRef.current.value = " ";
    }
  };

  const handleRemoveRegionCost = (index: number) => {
    const arr: any = [...variantRegionCostingList];

    if (index > -1) {
      arr.splice(index, 1);
    }

    setVariantRegionCostingList(arr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleSubmit = async (formValues: typeof form.values) => {
    let obj: any = { ...formValues };
    handleSaveCallback();
    if (variantRegionCostingList.length) {
      obj.costing = variantRegionCostingList;
    }

    const payload = { ...obj };

    const addVariantResponse = await APIRequest("variant", "POST", payload);

    if (addVariantResponse) {
      handleCloseModal(false);
      // handleSaveCallback();

    }
  };

  const categoryOptions = categoryData.map((cat: any) => ({
    value: cat._id,
    label: cat.name,
  }));

  React.useEffect(() => {
    handleGetRegions();
  }, []);

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Category"
        placeholder="Eg. Non-Basmati"
        data={categoryOptions}
        {...form.getInputProps("_categoryId")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant name"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("name")}
      />

      <Space h="md" />
      {variantRegionCostingList.map((k: any, i: number) => {
        return (
          <Group spacing="md" key={i}>
            <Select
              required
              searchable
              defaultValue={k.region}
              label="Select Source"
              placeholder="Eg. Punjab"
              data={regionOptions}
            />

            <NumberInput
              required
              precision={2}
              hideControls
              type="number"
              defaultValue={k.exMill}
              label="Ex-Mill"
              placeholder="eg. 2650.00"
            />

            <Flex
              justify="space-between"
              align="flex-end"
              direction="row"
              sx={() => ({
                marginTop: `3%`,
              })}
            >
              <Group spacing="md" position="right" margin-bottom="10px">
                <ActionIcon
                  variant="filled"
                  onClick={() => handleRemoveRegionCost(i)}
                >
                  <Minus size={20} />
                </ActionIcon>
              </Group>
            </Flex>
          </Group>
        );
      })}

      <Space h="md" />

      <Group spacing="md" grow>
        <Select
          required
          searchable
          label="Select Region"
          placeholder="Eg. Karnal"
          data={regionOptions}
          value={regionValue}
          onChange={(event: any) => {
            setRegionValue(event);
          }}
          ref={inputRef}
        />

        <NumberInput
          required
          precision={2}
          hideControls
          type="number"
          label="Ex-Mill"
          placeholder="eg. 2650.00"
          value={numberValue}
          onChange={(val: number) => {
            setNumberValue(val);
          }}
          ref={inputRef}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            width: "100%",
            marginTop: `3%`,
          }}
        >
          <ActionIcon
            onClick={handleAddRegionCost}
            color="teal"
            variant="filled"
            disabled={!regionValue || !numberValue}
          >
            {regionValue ? <Check size={20} /> : <Plus size={20} />}
          </ActionIcon>
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
