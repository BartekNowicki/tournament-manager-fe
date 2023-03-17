import { useNavigate } from "react-router-dom";

const useCustomNavigation = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/");
  }, 2000);
};

export default useCustomNavigation;
