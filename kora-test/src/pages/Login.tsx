import { GoogleLoginButton } from "../components/GoogleLoginButton";

export default function Login() {
  return (
    <div className="centered-layout">
      <div className="glass-card">
        <h1 className="title">KORA</h1>
        <p className="subtitle">Accede con tu cuenta de Google</p>

        <GoogleLoginButton />
      </div>
    </div>
  );
}
