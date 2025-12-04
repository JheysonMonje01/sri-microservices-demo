import { useSearchParams } from "react-router-dom";

export default function LoginSuccess() {
  const [params] = useSearchParams();

  return (
    <div className="centered-layout">
      <div className="glass-card" style={{ width: "600px" }}>
        <h1 className="title"> ¡Login Exitoso!</h1>
       
      </div>
    </div>
  );
}
