import React, { useState, useEffect } from "react";
import { Center, AspectRatio, Image, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Container } from "@mantine/core";
import { TextInput, Grid, Box } from "@mantine/core";
import { Button, SimpleGrid, Loader, Space, Text } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Otp from "../otp";
import { Notification } from "@mantine/core";

import { showNotification } from "@mantine/notifications";
import { Card } from "../../components";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import { getValue } from "@testing-library/user-event/dist/utils";
import { setConstantValue } from "typescript";

const Login = () => {
  const Router = useNavigate();

  const [values, setValues] = useState("");
  // const [validation, setValidation] = useState(true);

  // console.log(api);

  const initialFormState: any = {
    clearInputErrorOnChange: true,
    initialValues: {
      values: "",
    },
    validate: {
      mobileNumber: (values: any) =>
        // const stringValue = `${values}`;
        values.length < 10 || values.length > 10
          ? " MobileNumber must have 10* digit "
          : null,
    },
  };

  const form: any = useForm(initialFormState);

  const handleError = (errors: typeof form.errors) => {
    if (errors.values) {
      showNotification({
        message: "Please fill valid mobileNumber",
        color: "red",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("values", typeof values);
    console.log("creating payload");
    const payload = {
      mobileNumber: values,
      userType: "admin",
    };

    console.log("hitting api");
    axios
      .post("https://uat.pwip.co/user/public/initiate/signin", payload)
      .then((res: any) => {
        console.log(res);
        if (res.data.data.data.type === "success") {
          console.log(res);

          showNotification({
            title: "OTP sent succesfully",
            message: "",
            autoClose: 1000,
          });

          Router("/otp");
        }
      })
      .catch((error) => {
        console.log("got error");
        console.log(error.res.data.error);
      });
  };

  return (
    <form
    // onSubmit={form.onSubmit(handleSubmit, handleError)}
    >
      <>
        <AspectRatio ratio={290 / 182} sx={{ maxWidth: 300 }} mx="auto">
          <img src="https://admin-uat.pwip.co/assets/logo.png"></img>
        </AspectRatio>
        <Space h={80} />

        <Card p="lg" component="div" radius="md" withBorder>
          <Grid>
            <Grid.Col span={6} offset={5}>
              <Text>Login on EC Admin</Text>
            </Grid.Col>
            <Space h={80} />
            <Grid.Col span={4} offset={4}>
              <TextInput
                placeholder="XXXXX-XXXXX"
                label="Enter Mobile Number"
                type="number"
                size="md"
                radius="lg"
                error={values.length > 10 || values.length < 10}
                onChange={(e) => {
                  // console.log("enter mobileNumber" , e.target.value);
                  setValues(e.target.value);
                  console.log(values, "setting value");
                }}
                // {...form.getInputProps(mobileNumber)}
              />
            </Grid.Col>

            <Grid.Col span={2} offset={4}>
              <Button
                radius="xl"
                size="xs"
                type="submit"
                variant="outline"
                onClick={handleSubmit}
              >
                Request Otp
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </>
    </form>
  );
};

export default Login;
