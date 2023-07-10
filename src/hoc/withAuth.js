import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setCookie, deleteCookie, getCookie } from "../helper/helper";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [token, setToken] = useState("");
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const fetchToken = async () => {
      const _tok = await getAccessTokenSilently();
      setToken(_tok);
    };

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
