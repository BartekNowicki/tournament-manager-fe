import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface IErrorPageProps {}

export function ErrorPage(props: IErrorPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return <div>page not found, returning home...</div>;
}
