import React, { useState, useEffect, useCallback, useRef } from "react";
import { Center, AspectRatio, Image, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Container } from "@mantine/core";
import { TextInput, Grid, Box} from "@mantine/core";
import { Button, SimpleGrid, Loader, Space, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import DashboardScreen from "../dashboard";

import { showNotification } from "@mantine/notifications";
import { Card } from "../../components/index";

import axios from "axios";
import { OutputFileType } from "typescript";
// import { isDisabled } from "@testing-library/user-event/dist/utils";

const Otp = (props: any) => {
  const Router = useNavigate();
  const [timer, setTimer] = useState(60);

  const [otp, setOtp] = useState("");

  const [disable, setDisable] = useState(true);

  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );

  // useEffect(() => {
  //   setTimeout(() => {
  //     ref.currTimer.click();
  //   }, 60000); //miliseconds
  // }, []);

  // console.log(timer);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);

    timer === 0 ? setDisable(false) : setDisable(true);

    // if (timer === 0) {
    //   setDisable(false);
    // }else{
    //   setDisable(true);
    // }
  }, [timer, timeOutCallback]);

  // const handleClick = ()=>{
  //   Router("/Otp", { replace: true });
  // }

  const resetTimer = () => {
    if (!timer) {
      setTimer(60);
    }
  };

  // const [authVerified, setAuthVerified] = useState(false);
  // console.log("authVerified",authVerified);
  // let [modelOpen, setModelOpen] = useState(false);

  const initialFormState: any = {
    // clearInputErrorOnChange: true,
    // initialValues: {
    //   otp: "",
    // },
    validate: {
      otp: (values: any) =>
        values.length < 4 || values.length > 4
          ? "Otp must have 4* digit "
          : null,
    },
  };

  const form: any = useForm(initialFormState);

  const handleError = (errors: typeof form.errors) => {
    if (errors.otp) {
      showNotification({
        message: "otp have only 4* digit number",
        color: "red",
      });
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      mobileNumber: "9902156864",
      userType: "admin",
    };

    axios
      .post("https://uat.pwip.co/user/public/resendotp", payload)
      .then((res: any) => {
        console.log(res);
        if (res.data.type === "success") {
          console.log(res);

          showNotification({
            title: "OTP sent succesfully again",
            message: "",
            autoClose: 1500,
          });
        }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      otp: otp,
      userType: "admin",
      grant_type: "password",
      username: "9902156864",
    };
    let formData = new FormData(); //formdata object

    formData.append("otp", otp); //append the values with key, value pair
    formData.append("userType", "admin");
    formData.append("grant_type", "password");
    formData.append("username", "9902156864");

    axios
      .post("https://uat.pwip.co/oauth/token", formData, {
        headers: {
          Authorization: "Basic YW5ndWxhci1jbGllbnQ6YW5ndWxhci1zZWNyZXQ=",
        },
      })
      .then((res: any) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem("access_token", res.data.access_token);
          showNotification({
            title: "Logged In Succesfully",
            message: "",
            autoClose: 1000,
          });

          Router("/admin/dashboard");
        }
        //  else if (res.status === 400) {
        //     showNotification({
        //       title: "Otp Wrong",
        //       message: "error",
        //        autoClose: 1000,
        //     })
        //   }
      })
      .catch((error) => {
        console.log("got error");
        showNotification({
          title: "Your OTP is incorrect, Please try again",
          message: "",
          autoClose: 1000,
        });
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

        <Card withBorder p="xl" component="div">
          <Grid>
            <Grid.Col span={6} offset={5}>
              <Text>Login on EC Admin</Text>
            </Grid.Col>
            <Space h={80} />
            <Grid.Col span={4} offset={4}>
              <TextInput
                placeholder="xxxx"
                label="Enter OTP"
                type="number"
                size="md"
                radius="lg"
                // maxLength="4"
                error={otp.length > 4 || otp.length < 4}
                onChange={(e) => {
                  console.log("enter otp", e.target.value);
                  setOtp(e.target.value);
                }}
                // {...form.getInputProps("otp")}
              />
            </Grid.Col>

            <Grid.Col span={2} offset={4}>
              <Button
                radius="xl"
                size="xs"
                type="button"
                onClick={handleSubmit}
              >
                submit
              </Button>
            </Grid.Col>

            <Grid.Col span={1}>
              <Button
                disabled={disable}
                radius="xl"
                size="xs"
                type="button"
                onClick={handleReset}
              >
                Resend Otp
              </Button>
            </Grid.Col>
            <Grid.Col span={5} offset={4}>
              <Text>Resend OTP in ({timer})</Text>
            </Grid.Col>
          </Grid>
        </Card>
      </>
    </form>
  );
};

export default Otp;
