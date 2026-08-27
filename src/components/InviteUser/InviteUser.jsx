import { useState } from "react";
import { api } from "../../Api/requests";
import { LEVEL } from "../../utils/constants";
import { Send, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";

const InviteUser = () => {
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState(LEVEL.EMP);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    setSuccessMsg("");
    setErrMsg("");
    setIsLoading(true);
    const res = await api.inviteUser({ email, level });
    setIsLoading(false);
    if (res && res.status === 200) {
      setSuccessMsg(`Invite sent to ${email}`);
      setEmail("");
      setLevel(LEVEL.EMP);
    } else {
      setErrMsg(res?.data?.error || "Failed to send invite. Please try again.");
    }
  };

  const validateForm = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && level !== "";

  return (
    <div className="max-w-lg animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Invite User</h2>

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
          <Label htmlFor="invite-email">Email Address</Label>
          <div className="flex items-center gap-3 border border-gray-300 rounded-md px-3 h-10 focus-within:ring-1 focus-within:ring-brand-blue focus-within:border-brand-blue transition-colors bg-white">
            <Mail size={16} className="text-gray-400 shrink-0" />
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LEVEL.EMP}>Employee (EMP)</SelectItem>
              <SelectItem value={LEVEL.MANAGER}>Manager</SelectItem>
              <SelectItem value={LEVEL.ADMIN}>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!validateForm() || isLoading}
          className="h-11 gap-2"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {isLoading ? "Sending..." : "Send Invite"}
        </Button>
      </div>
    </div>
  );
};

export default InviteUser;
