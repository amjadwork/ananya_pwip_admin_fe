import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [authVerified, setAuthVerified] = useState(false);
    const { isAuthenticated } = useAuth0();

    useEffect(() => {
      // if not authenticated,then we redirect to "/" page.
      if (!isAuthenticated) {
        window.location.href = "/";
      } else {
        setAuthVerified(true);
      }
    }, []);

    if (authVerified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
