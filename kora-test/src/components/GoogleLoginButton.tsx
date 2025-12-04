export function GoogleLoginButton() {
  const loginUrl = "http://localhost:3000/auth/google/redirect";

  return (
    <button
      className="google-btn"
      onClick={() => (window.location.href = loginUrl)}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google logo"
        width="22"
      />
      Continuar con Google
    </button>
  );
}
