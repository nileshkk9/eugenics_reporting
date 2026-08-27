import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../../Api/requests";
import { AlertTriangle, MapPin, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { Alert, AlertDescription } from "../ui/alert";

const initialState = {
  docname: "",
  locname: "",
  qualification: "",
  miscellaneous: "",
  sample: "",
  partner: "",
  chemists: "",
};

const TakeInput = () => {
  const [form, setForm] = useState(initialState);
  const [doctors, setDoctors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [gpsLocation, setGpsLocation] = useState({ geolocation: "", fullgeolocation: "" });
  const [gpsErrorMsg, setGpsErrorMsg] = useState("");
  const [isLocating, setIsLocating] = useState(true);
  const [qualifications, setQualifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const watchIdRef = useRef(null);
  const hasLocationRef = useRef(false);
  const geocodingRef = useRef(false);
  const locateTimeoutRef = useRef(null);

  const clearLocateTimeout = () => {
    if (locateTimeoutRef.current) {
      clearTimeout(locateTimeoutRef.current);
      locateTimeoutRef.current = null;
    }
  };

  const applyCoordinateFallback = (latitude, longitude) => {
    hasLocationRef.current = true;
    const label = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    setGpsLocation({ fullgeolocation: label, geolocation: label });
    setGpsErrorMsg("");
    setIsLocating(false);
  };

  const resolveLocation = async (latitude, longitude) => {
    if (geocodingRef.current || hasLocationRef.current) return;

    geocodingRef.current = true;
    stopWatching();
    clearLocateTimeout();
    setIsLocating(true);

    try {
      const res = await api.getGeoLocation(latitude, longitude);
      if (res?.data?.display_name) {
        hasLocationRef.current = true;
        setGpsLocation({
          fullgeolocation: res.data.display_name,
          geolocation:
            res.data.address?.suburb || res.data.address?.county || "",
        });
        setGpsErrorMsg("");
      } else {
        applyCoordinateFallback(latitude, longitude);
      }
    } catch {
      applyCoordinateFallback(latitude, longitude);
    } finally {
      geocodingRef.current = false;
      setIsLocating(false);
    }
  };

  const validateForm = () =>
    form.docname.length > 1 &&
    form.locname.length > 1 &&
    form.qualification.length > 1 &&
    form.partner.length > 1 &&
    gpsLocation.fullgeolocation;

  const stopWatching = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const getGeoLocation = () => {
    if (!navigator.geolocation) {
      setIsLocating(false);
      setGpsErrorMsg("Geolocation is not supported by this browser.");
      return;
    }

    stopWatching();
    clearLocateTimeout();
    setIsLocating(true);
    setGpsErrorMsg("");
    hasLocationRef.current = false;
    geocodingRef.current = false;

    locateTimeoutRef.current = setTimeout(() => {
      if (hasLocationRef.current) return;
      stopWatching();
      setIsLocating(false);
      setGpsErrorMsg(
        "Location timed out. Allow location for this site, then tap Retry."
      );
    }, 25000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        resolveLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        if (hasLocationRef.current) return;

        stopWatching();
        clearLocateTimeout();
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsErrorMsg(
              "Location permission denied. Allow location access for this site in browser settings."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsErrorMsg(
              "Location unavailable. Enable Location Services for your browser, or tap Retry."
            );
            break;
          case error.TIMEOUT:
            setGpsErrorMsg("Location request timed out. Tap Retry.");
            break;
          default:
            setGpsErrorMsg("Could not get location. Tap Retry.");
            break;
        }
      },
      { enableHighAccuracy: true, maximumAge: 1800000, timeout: 20000 }
    );
  };

  useEffect(() => {
    getGeoLocation();
    fetchAutocomplete();
    return () => {
      stopWatching();
      clearLocateTimeout();
    };
    // eslint-disable-next-line
  }, []);

  const fetchAutocomplete = async () => {
    const doctorsRes = await api.getDoctors();
    const locationsRes = await api.getDocLocation();
    const qualificationsRes = await api.getQualification();

    if (doctorsRes.status === 200) setDoctors(doctorsRes.data);
    else console.log("error", doctorsRes);

    if (locationsRes.status === 200) setLocations(locationsRes.data);
    else console.log("error", locationsRes);

    if (qualificationsRes.status === 200) setQualifications(qualificationsRes.data);
    else console.log("error", qualificationsRes);
  };

  const resetStates = () => setForm(initialState);

  const notify = (msg, type) => {
    if (type === "SUCCESS") {
      toast.info(msg, { position: "bottom-center" });
    } else if (type === "ERROR") {
      toast.error(msg, { position: "bottom-center" });
    }
  };

  const handleSubmit = async () => {
    const formData = { ...form, ...gpsLocation };
    console.log(formData);
    setIsLoading(true);
    const res = await api.publishReport(formData);
    if (res.status === 200) {
      notify(res.data.message, "SUCCESS");
    } else {
      notify(res.data.error, "ERROR");
    }
    setIsLoading(false);
    resetStates();
  };

  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-lg animate-fade-in pb-20 md:pb-0">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Upload Entry</h2>

      {gpsErrorMsg ? (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p>{gpsErrorMsg}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={getGeoLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              {isLocating ? "Retrying..." : "Retry location"}
            </Button>
          </AlertDescription>
        </Alert>
      ) : gpsLocation.fullgeolocation ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4 truncate">
          Location: {gpsLocation.geolocation || gpsLocation.fullgeolocation}
        </p>
      ) : (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4 flex items-center gap-2">
          {isLocating && <Loader2 size={14} className="animate-spin shrink-0" />}
          {isLocating ? "Acquiring location..." : "Waiting for location..."}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Doctor's Name *</Label>
          <Combobox
            value={form.docname}
            onChange={setField("docname")}
            options={doctors}
            placeholder="Search or type doctor name"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Place *</Label>
          <Combobox
            value={form.locname}
            onChange={setField("locname")}
            options={locations}
            placeholder="Search or type location"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Qualification *</Label>
          <Combobox
            value={form.qualification}
            onChange={setField("qualification")}
            options={qualifications}
            placeholder="Search or type qualification"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="partner">Worked With *</Label>
          <Input
            id="partner"
            placeholder="Ramesh, Pankaj..."
            value={form.partner}
            onChange={(e) => setField("partner")(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sample">Sample</Label>
          <Input
            id="sample"
            placeholder="Eugevita, Eunacgen"
            value={form.sample}
            onChange={(e) => setField("sample")(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="chemists">Chemists</Label>
          <Input
            id="chemists"
            placeholder="chemist1, chemist2, chemist3"
            value={form.chemists}
            onChange={(e) => setField("chemists")(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="miscellaneous">Miscellaneous</Label>
          <Input
            id="miscellaneous"
            placeholder="Any extra information you want to provide"
            value={form.miscellaneous}
            onChange={(e) => setField("miscellaneous")(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!validateForm() || isLoading}
          className="h-12 w-full gap-2"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <PlusCircle size={18} />
          )}
          {isLoading ? "Submitting..." : "Submit Entry"}
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TakeInput;
