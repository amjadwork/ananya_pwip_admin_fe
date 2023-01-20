import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { manageCha } from "../../../constants/var.constants";

function EditChaForm(props: any) {
  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const [allValue, setAllValue] = useState({});

  const form = useForm({
    clearInputErrorOnChange: true,
    // initialValues: {
    //   name: "",
    //   category: "",
    //   city: "",
    //   state: "",
    //   // destination: "",
    //   exmill: "",
    //   // transportation: "",
    // },

    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  const handleClick: any = () => {
    const arr: any = [...categoriesList];
    arr.push(categoriesValue);
    console.log(arr);
    setCategoriesList(arr);
  };

  const handleDeleteItem = (index: number) => {
    const arr: any = [...categoriesList];

    // logic to delete an item starts
    if (index > -1) {
      arr.splice(index, 1);
    }

    // logic to delete an item end

    setCategoriesList(arr);
    console.log(arr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };
  const handleUpdate = (index: number) => {
    const arr: any = [...categoriesList];
    arr[index] = catUpdateValue;

    setCategoriesList(arr);

    console.log(arr);
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log(values, "values");
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Enter Origin Port"
        placeholder="Eg. chennai"
        
        {...form.getInputProps("origin")}
      />

      <Space h="md" />

      

      <Space h="md" />
      {categoriesList.map((k, i) => {
        return (
          <Group spacing="md" key={i}>
            <Select
              required
              label="Enter Destination Port"
              placeholder="Eg. singapore"
              data={[]}
              {...form.getInputProps("destination")}
            />

            <NumberInput
              required
              label="Enter OFC Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("ofc")}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "bottom",
                // width: "100%",
                marginTop: `3%`,
              }}
            >
              <Group spacing="md" position="right" margin-bottom="10px">
                <ActionIcon
                  variant="filled"
                  onClick={() => handleDeleteItem(i)}
                >
                  <Minus size={20} />
                </ActionIcon>
              </Group>
            </div>
            {/* <Group spacing="md" position="right" margin-bottom="10px">
              <ActionIcon variant="filled" onClick={() => handleDeleteItem(i)}>
                <Minus size={20}/>
              </ActionIcon> */}
            {/* <ActionIcon
                variant="filled"
                disabled={false}
                onClick={() => handleUpdate(i)}
              >
                // {/* <Check size={20} /> */}
            {/* </ActionIcon> */}
            {/* </Group> */}
          </Group>
        );
      })}

      <Space h="md" />

      <Group spacing="md" grow>
        <Select
          required
          label="Enter Destination port"
          placeholder="Eg. Karnal"
          data={[]}
          {...form.getInputProps("destination")}
        />

        <NumberInput
          required
          label="Enter OFC charge"
          placeholder="Eg. 26500"
          {...form.getInputProps("ofc")}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            width: "100%",
            marginTop: `3%`,
          }}
        >
          <Button onClick={handleClick}>+</Button>
          {/* <ArrowRightCircle size={24} style={{ marginTop: `14%` }} />
          <Space w="md" /> */}
          {/* <Select
            required
            label="Destination Port"
            placeholder="Eg. SINGAPORE"
            style={{
              width: "100%",
            }}
            data={[]}
            {...form.getInputProps("destination")} 
           /> */}
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditChaForm;
