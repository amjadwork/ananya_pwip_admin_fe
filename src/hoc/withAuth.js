import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setCookie, deleteCookie, getCookie } from "../helper/helper";
import APIRequest from "../helper/api";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [token, setToken] = useState("");
    const router = useNavigate();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const fetchToken = async () => {
      const _tok = await getAccessTokenSilently();
      setToken(_tok);
    };

    const handleGetUserData = async () => {
      const userResponse = await APIRequest("user", "GET", {}, {}, true);
      if (userResponse) {
        if (userResponse[0]?.role_id === 3) {
          router("/admin/dashboard");
        } else {
          router("/access-denied");
        }
      }
    };

    useEffect(() => {
      handleGetUserData();
    }, []);

    useEffect(() => {
      // if not authenticated,then we redirect to "/" page.
      if (!isAuthenticated) {
        window.location.href = "/";
        deleteCookie("access_token");
      } else {
        fetchToken();
      }
    }, []);

    useEffect(() => {
      const cookieToken = getCookie("access_token");

      if (token && !cookieToken) {
        setCookie("access_token", token);
      }
    }, [token]);

    if (isAuthenticated && token) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
