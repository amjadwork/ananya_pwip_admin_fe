import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { managePwipService } from "../../../constants/var.constants";

function EditPwipServiceForm(props: any) {
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
    //   transportation: "",
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
    let arr: any = [];

  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Enter PWIP Services Charges"
        placeholder="Eg. chennai"
        {...form.getInputProps("originPort")}
      />

      <Space h="md" />

      <Space h="md" />
      {categoriesList.map((k, i) => {
        return (
          <Group spacing="md" key={i}>
            <NumberInput
              required
              label="Order value"
              placeholder="Eg. singapore"
              {...form.getInputProps("order")}
            />

            <NumberInput
              required
              label="Sourcing "
              placeholder="Eg. 26500"
              {...form.getInputProps("sourcing")}
            />
            <NumberInput
              required
              label="Logistics "
              placeholder="Eg. 26500"
              {...form.getInputProps("logistics")}
            />

            <NumberInput
              required
              label="Others"
              placeholder="Eg. 26500"
              {...form.getInputProps("others")}
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
           
          </Group>
        );
      })}

      <Space h="md" />

      <Group spacing="md" grow>
        <NumberInput
          required
          label="Order value"
          placeholder="Eg. 780"
          data={[]}
          {...form.getInputProps("order")}
        />

        <NumberInput
          required
          label="Sourcing"
          placeholder="Eg. 26500"
          {...form.getInputProps("sourcing")}
        />
        <NumberInput
          required
          label="Logistics"
          placeholder="Eg. 26500"
          {...form.getInputProps("logistics")}
        />
        <NumberInput
          required
          label="Others"
          placeholder="Eg. 26500"
          {...form.getInputProps("others")}
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
         
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditPwipServiceForm;
