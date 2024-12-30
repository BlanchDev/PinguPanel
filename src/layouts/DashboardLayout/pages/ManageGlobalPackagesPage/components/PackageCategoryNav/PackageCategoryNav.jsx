import "./PackageCategoryNav.scss";
import { useParams } from "react-router-dom";
import TopNavBar from "../../../../../../components/TopNavBar/TopNavBar";

function PackageCategoryNav() {
  const { connectionId } = useParams();

  const buttons = [
    {
      text: "All",
      type: "navlink",
      link: `/dashboard/${connectionId}/manage-global-packages/all-packages`,
    },
    {
      text: "Required",
      type: "navlink",
      link: `/dashboard/${connectionId}/manage-global-packages/required-packages`,
    },
    {
      text: "Docker",
      type: "navlink",
      link: `/dashboard/${connectionId}/manage-global-packages/docker-packages`,
    },
    {
      text: "PM2",
      type: "navlink",
      link: `/dashboard/${connectionId}/manage-global-packages/pm2-packages`,
    },
    {
      text: "SSL",
      type: "navlink",
      link: `/dashboard/${connectionId}/manage-global-packages/ssl-packages`,
    },
    {
      text: "Security",
      type: "navlink",
      link: `/dashboard/${connectionId}/manage-global-packages/security-packages`,
    },
  ];

  return <TopNavBar buttons={buttons} direction='row' />;
}

export default PackageCategoryNav;
