import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../Api/requests";
import { UserPlus, User, Lock, Phone, MapPin, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const FIELDS = [
  { id: "name", placeholder: "Full name", type: "text", Icon: User },
  { id: "username", placeholder: "Username", type: "text", Icon: User },
  { id: "password", placeholder: "Password", type: "password", Icon: Lock },
  { id: "confirmPassword", placeholder: "Confirm password", type: "password", Icon: Lock },
  { id: "phn", placeholder: "Phone number", type: "text", Icon: Phone },
  { id: "address", placeholder: "Address", type: "text", Icon: MapPin },
];

const Register = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phn: "",
    address: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () =>
    form.username.length > 2 &&
    form.password.length > 4 &&
    form.password === form.confirmPassword &&
    form.name.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setIsLoading(true);
    const { confirmPassword, ...payload } = form;
    const res = await api.registerViaToken(token, payload);
    setIsLoading(false);
    if (res && res.status === 200) {
      navigate("/", { state: { message: "Account created! Please log in." } });
    } else {
      setErrMsg(res?.data?.error || "Invalid or expired invite link.");
    }
  };

  return (
    <div className="bg-black min-h-dvh flex items-center justify-center px-4 py-8">
      <form className="w-full max-w-sm animate-fade-in" onSubmit={handleSubmit}>
        <div className="bg-stone-900/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white border border-stone-700/50">
          <div className="flex flex-col items-center mb-6">
            <UserPlus size={40} className="text-brand-blue mb-3" />
            <h1 className="text-xl font-semibold tracking-widest uppercase">Create Account</h1>
          </div>

          <div className="space-y-3">
            {FIELDS.map(({ id, placeholder, type, Icon }) => (
              <div
                key={id}
                className="flex items-center gap-3 bg-stone-800/60 rounded-lg px-4 h-12 border border-stone-700 focus-within:border-brand-blue transition-colors"
              >
                <Icon size={18} className="text-stone-400 shrink-0" />
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  className="bg-transparent flex-1 outline-none text-sm placeholder:text-stone-500 text-white"
                  onChange={handleChange}
                  value={form[id]}
                />
              </div>
            ))}
          </div>

          {errMsg && (
            <p className="text-red-400 text-sm text-center mt-3">{errMsg}</p>
          )}

          <Button
            type="submit"
            className="w-full h-12 mt-5 text-base font-semibold"
            disabled={!validateForm() || isLoading}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
