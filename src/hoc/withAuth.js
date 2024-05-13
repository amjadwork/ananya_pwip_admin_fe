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
        let roleID = userResponse[0]?.role_id;
        sessionStorage.setItem("role", roleID);
        if (
          roleID === Number(process.env.REACT_APP_OPS_ROLE_ID) ||
          roleID === Number(process.env.REACT_APP_ADMIN_ROLE_ID) ||
          roleID === Number(process.env.REACT_APP_MARKETING_ROLE_ID)
        ) {
          router("/admin/dashboard");
          handleGetPermissionIds(roleID);
        } else {
          router("/access-denied");
        }
      }
    };

const handleGetPermissionIds = async (roleID) => {
  try {
    const permissionResponse = await APIRequest(
      `rolepermission?role_id=${roleID}`,
      "GET",
      {},
      {},
      false
    );

    if (permissionResponse && permissionResponse.length > 0) {
      let permissionIDs = permissionResponse.map(
        (response) => response.permission_id
      );
      sessionStorage.setItem("permissions", JSON.stringify(permissionIDs));
    } else {
      console.error(
        "No permissions found or empty response:",
        permissionResponse
      );
    }
  } catch (error) {
    console.error("Error fetching permissions:", error);
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
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("permissions");
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
