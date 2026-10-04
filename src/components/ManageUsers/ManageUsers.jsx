import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../Api/requests";
import { LOCAL_AUTH_KEY } from "../../utils/constants";
import { Loader2, CheckCircle, AlertCircle, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";

const emptyForm = {
  username: "",
  name: "",
  email: "",
  phn: "",
  address: "",
  password: "",
  isactive: "1",
};

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const loadUsers = async () => {
    const res = await api.getRegionalUsers();
    if (res?.data && Array.isArray(res.data)) {
      setUsers(res.data);
    } else {
      setErrMsg(res?.data?.error || "Failed to load users.");
    }
    setIsLoadingList(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSelect = async (id) => {
    setSelectedId(id);
    setSuccessMsg("");
    setErrMsg("");
    setIsLoadingUser(true);
    const res = await api.getUserById(id);
    setIsLoadingUser(false);
    if (res && res.status === 200) {
      const user = res.data.user;
      setForm({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        phn: user.phn || "",
        address: user.address || "",
        password: "",
        isactive: String(user.isactive === 0 || user.isactive === "0" ? 0 : 1),
      });
    } else {
      setForm(emptyForm);
      setErrMsg(res?.data?.error || "Failed to load user.");
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () =>
    selectedId !== "" &&
    form.username.trim().length > 2 &&
    form.name.trim().length > 0 &&
    (form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) &&
    (form.password === "" || form.password.length > 4);

  const handleSubmit = async () => {
    setSuccessMsg("");
    setErrMsg("");
    setIsSaving(true);
    const payload = {
      username: form.username.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phn: form.phn.trim(),
      address: form.address.trim(),
      isactive: Number(form.isactive),
    };
    if (form.password) payload.password = form.password;
    const res = await api.updateUser(selectedId, payload);
    setIsSaving(false);
    if (res && res.status === 200) {
      if (res.data.mustRelogin) {
        localStorage.removeItem(LOCAL_AUTH_KEY);
        navigate("/", { state: { message: "Username updated. Please log in again." } });
        return;
      }
      setSuccessMsg(
        res.data.usernameChanged
          ? "User updated. They must log in again with the new username."
          : "User updated."
      );
      setForm((prev) => ({ ...prev, password: "" }));
      await loadUsers();
    } else {
      setErrMsg(res?.data?.error || "Failed to update user.");
    }
  };

  const fieldClass =
    "flex items-center gap-3 border border-gray-300 rounded-md px-3 h-10 focus-within:ring-1 focus-within:ring-brand-blue focus-within:border-brand-blue transition-colors bg-white";

  return (
    <div className="max-w-lg animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Manage Users</h2>

      {successMsg && (
        <Alert variant="default" className="mb-4 border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}
      {errMsg && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errMsg}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>User</Label>
          <Select value={selectedId} onValueChange={handleSelect} disabled={isLoadingList}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={isLoadingList ? "Loading..." : "Select a user"} />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem value={String(user.id)} key={user.id}>
                  {user.name} ({user.username})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoadingUser && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Loading user...
          </div>
        )}

        {selectedId && !isLoadingUser && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="edit-username">Username</Label>
              <div className={fieldClass}>
                <input
                  id="edit-username"
                  value={form.username}
                  onChange={handleChange("username")}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <div className={fieldClass}>
                <input
                  id="edit-name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <div className={fieldClass}>
                <input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phn">Phone</Label>
              <div className={fieldClass}>
                <input
                  id="edit-phn"
                  value={form.phn}
                  onChange={handleChange("phn")}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-address">Address</Label>
              <div className={fieldClass}>
                <input
                  id="edit-address"
                  value={form.address}
                  onChange={handleChange("address")}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-password">Password</Label>
              <div className={fieldClass}>
                <input
                  id="edit-password"
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Leave blank to keep current password"
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.isactive}
                onValueChange={(value) => setForm((prev) => ({ ...prev, isactive: value }))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!validateForm() || isSaving}
              className="h-11 gap-2"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
