import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useNavigate();
    const { isAuthenticated, user } = useAuth0();

    useEffect(() => {
      if (isAuthenticated && user) {
        router("/admin/dashboard");
      } else {
        router("/");
      }
    }, [isAuthenticated, user]);

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
