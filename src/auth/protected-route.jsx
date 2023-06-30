import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
// import { Icon } from "../components/index";
// import { icons } from "../utils/theme/icons/index";

const ProtectedRoute = ({ element: Component, ...args }) => {
  return <Component {...args} />;
};

export default withAuthenticationRequired(ProtectedRoute, {
  onRedirecting: () => (
    <div className="h-full w-full absolute inline-flex flex-col items-center justify-center space-y-4">
      {/* <Icon color="#F29B00" svg={icons.general.spinnerLarge} /> */}
      <span className="text-[#212121] text-sm text-center">Logging you in</span>
    </div>
  ),
});
