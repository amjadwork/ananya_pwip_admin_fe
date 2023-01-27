
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';



const withAuth = (WrappedComponent) => {

  return (props) => {
    const navigate = useNavigate();
    
    const [authVerified, setAuthVerified] = useState(false);

    useEffect( () => {
      const accessToken = localStorage.getItem("access_token");
      // console.log(accessToken);
      // if no accessToken was found,then we redirect to "/" page.
      if (!accessToken) {
       
        window.location.href = '/'
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
}


  // 
  // const [authVerified, setAuthVerified] = useState(false);
  // console.log(authVerified)

  // // const PrivateRoute = ({ redirectTo, component , isAuth }) => {
  // //   return isAuth ?  component : <Navigate to={redirectTo} />;
  // // };
  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   // if no accessToken was found,then we redirect to "/" page.
  //   if (!accessToken) {
  //     navigate('/', { replace: true });

  //   } else {
  //     setAuthVerified(true);
  //     // navigate('/admin/dashboard', { replace: true });
  //   //  < Navigate to={<DashboardScreen/>}/>
  //   }
  // }, []);


  // return () => {
   

   

    // if (authVerified) {
    //   return <
    //       DashboardScreen 
    //        />;
    // } else {
    //   return null;
    // }
 





export default withAuth;



