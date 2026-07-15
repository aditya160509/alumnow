"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  LoaderCircle,
  Plus,
  X,
  Video,
  Users,
  Upload,
} from "lucide-react";
import { signup, signupAlumni } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const inputLight =
  "bg-white border-border text-navy placeholder:text-navy/30 focus:border-gold focus:ring-gold/10";

const SESSION_TYPE_OPTIONS = [
  { value: "one_on_one_video", label: "1:1 Video Call", icon: <Video size={16} /> },
  { value: "group_session", label: "Group Session", icon: <Users size={16} /> },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Germany",
  "France",
  "Other",
];

type SessionTypeRow = {
  type: string;
  pricePaise: number;
  maxParticipants: number;
  descriptionOneLiner: string;
};
type AvailRow = { dayOfWeek: number; startTime: string; endTime: string };

function StudentForm({
  onStatusChange,
}: {
  onStatusChange: (s: string) => void;
}) {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setStatus("creating");
    onStatusChange("creating");
    const name = email
      .split("@")[0]!
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const r = await signup({
      email,
      password,
      fullName: name,
      phone: "+919876543210",
      dateOfBirth: null,
      currentGrade: "Other",
      school: "JBCN International School Borivali",
      confirmPassword: password,
      tosAccepted: true,
    });
    if (r.error) {
      setError(r.error);
      setStatus("idle");
      onStatusChange("idle");
      return;
    }
    setStatus("verifying");
    onStatusChange("verifying");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("verified");
    onStatusChange("verified");
    await new Promise((r) => setTimeout(r, 700));
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-navy/80">
        Email
        <Input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-2 ${inputLight}`}
          placeholder="you@example.com"
        />
      </label>
      <label className="block text-sm font-semibold text-navy/80">
        Password
        <Input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mt-2 ${inputLight}`}
          placeholder="At least 8 characters"
        />
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="submit"
        disabled={status !== "idle"}
        className="w-full"
        variant="primary"
      >
        {status === "idle" ? "Create account" : "Creating..."}
      </Button>
      <p className="text-center text-xs text-navy/30">
        By creating an account you agree to our{" "}
        <Link
          href="/terms"
          className="text-navy/60 hover:text-navy underline underline-offset-2"
        >
          Terms
        </Link>{" "}
        &{" "}
        <Link
          href="/privacy"
          className="text-navy/60 hover:text-navy underline underline-offset-2"
        >
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}

function AlumniWizard({
  onStatusChange,
}: {
  onStatusChange: (s: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const [acc, setAcc] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [profile, setProfile] = useState({
    universityName: "",
    course: "",
    country: "",
    graduationYearJbcn: 2023,
    bio: "",
    profilePhotoUrl: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const [sessions, setSessions] = useState<SessionTypeRow[]>([
    {
      type: "one_on_one_video",
      pricePaise: 99900,
      maxParticipants: 1,
      descriptionOneLiner: "",
    },
  ]);
  const addSession = () =>
    setSessions((p) => [
      ...p,
      {
        type: "one_on_one_video",
        pricePaise: 99900,
        maxParticipants: 1,
        descriptionOneLiner: "",
      },
    ]);
  const updSession = (i: number, k: keyof SessionTypeRow, v: string | number) =>
    setSessions((p) =>
      p.map((s, j) => (j === i ? { ...s, [k]: v } : s))
    );
  const delSession = (i: number) =>
    setSessions((p) => p.filter((_, j) => j !== i));

  const [avail, setAvail] = useState<AvailRow[]>([
    { dayOfWeek: 0, startTime: "09:00", endTime: "10:00" },
  ]);
  const addAvail = () =>
    setAvail((p) => [
      ...p,
      { dayOfWeek: 0, startTime: "09:00", endTime: "10:00" },
    ]);
  const updAvail = (i: number, k: keyof AvailRow, v: string | number) =>
    setAvail((p) =>
      p.map((a, j) => (j === i ? { ...a, [k]: v } : a))
    );
  const delAvail = (i: number) =>
    setAvail((p) => p.filter((_, j) => j !== i));

  const handleSubmit = async () => {
    if (acc.password !== acc.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setError("");
    setStatus("creating");
    onStatusChange("creating");
    const r = await signupAlumni({
      ...acc,
      ...profile,
      sessionTypes: sessions,
      availability: avail,
    });
    if (r.error) {
      setError(r.error);
      setStatus("idle");
      onStatusChange("idle");
      return;
    }
    setStatus("verifying");
    onStatusChange("verifying");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("verified");
    onStatusChange("verified");
    await new Promise((r) => setTimeout(r, 700));
    window.location.href = "/alumni/dashboard";
  };

  const totalSteps = 4;
  const canNext = () => {
    if (step === 1)
      return (
        acc.fullName &&
        acc.email &&
        acc.password &&
        acc.confirmPassword
      );
    if (step === 2)
      return (
        profile.universityName && profile.course && profile.country
      );
    if (step === 3)
      return (
        sessions.length > 0 &&
        sessions.every((s) => s.type && s.pricePaise > 0)
      );
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center">
            {s > 1 && (
              <div
                className={`mx-2 h-px w-8 transition-colors ${
                  step >= s ? "bg-navy/40" : "bg-border"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => s < step && setStep(s)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step > s
                  ? "bg-navy/20 text-navy"
                  : step === s
                    ? "bg-navy text-white"
                    : "bg-border text-navy/30"
              }`}
            >
              {step > s ? <Check size={12} /> : s}
            </button>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/30">
          Step {step} of {totalSteps}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-navy">
          {step === 1 && "Create your alumni account"}
          {step === 2 && "Complete your profile"}
          {step === 3 && "Set up session types & pricing"}
          {step === 4 && "Set your availability"}
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-navy/80">
            Full name{" "}
            <Input
              required
              value={acc.fullName}
              onChange={(e) =>
                setAcc((p) => ({ ...p, fullName: e.target.value }))
              }
              className={`mt-2 ${inputLight}`}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-navy/80">
              Email{" "}
              <Input
                required
                type="email"
                value={acc.email}
                onChange={(e) =>
                  setAcc((p) => ({ ...p, email: e.target.value }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
            <label className="block text-sm font-semibold text-navy/80">
              Phone{" "}
              <Input
                required
                placeholder="+919876543210"
                value={acc.phone}
                onChange={(e) =>
                  setAcc((p) => ({ ...p, phone: e.target.value }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-navy/80">
              Password{" "}
              <Input
                required
                minLength={8}
                type="password"
                value={acc.password}
                onChange={(e) =>
                  setAcc((p) => ({ ...p, password: e.target.value }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
            <label className="block text-sm font-semibold text-navy/80">
              Confirm{" "}
              <Input
                required
                type="password"
                value={acc.confirmPassword}
                onChange={(e) =>
                  setAcc((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-navy/20">
                  <Upload size={20} />
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-[10px] border border-border bg-white px-4 py-2 text-sm text-navy/60 hover:bg-cream transition-all">
              Upload photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhoto}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-navy/80">
              University{" "}
              <Input
                required
                value={profile.universityName}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    universityName: e.target.value,
                  }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
            <label className="block text-sm font-semibold text-navy/80">
              Course{" "}
              <Input
                required
                value={profile.course}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, course: e.target.value }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-navy/80">
              Country
              <select
                value={profile.country}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, country: e.target.value }))
                }
                className={`mt-2 w-full ${inputLight} rounded-[10px] px-3 py-2.5 outline-none`}
              >
                <option value="" className="bg-white text-navy/30">
                  Select country
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c} className="bg-white text-navy" value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-navy/80">
              Grad year{" "}
              <Input
                required
                type="number"
                min={2000}
                max={2030}
                value={profile.graduationYearJbcn}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    graduationYearJbcn:
                      parseInt(e.target.value) || 2023,
                  }))
                }
                className={`mt-2 ${inputLight}`}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-navy/80">
            Bio{" "}
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
              rows={3}
              className={`mt-2 w-full resize-none ${inputLight} rounded-[10px] px-3 py-2.5 text-sm outline-none`}
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-white p-4 space-y-3 relative"
            >
              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={() => delSession(i)}
                  className="absolute top-3 right-3 text-navy/20 hover:text-navy/60"
                >
                  <X size={14} />
                </button>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-navy/50">
                  Type
                  <select
                    value={s.type}
                    onChange={(e) =>
                      updSession(i, "type", e.target.value)
                    }
                    className="mt-1 w-full rounded-[8px] bg-white border border-border text-navy px-3 py-2 text-sm outline-none"
                  >
                    {SESSION_TYPE_OPTIONS.map((o) => (
                      <option
                        key={o.value}
                        className="bg-white text-navy"
                        value={o.value}
                      >
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-navy/50">
                  Price (₹)
                  <Input
                    type="number"
                    min={0}
                    value={s.pricePaise}
                    onChange={(e) =>
                      updSession(
                        i,
                        "pricePaise",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className={`mt-1 ${inputLight}`}
                  />
                </label>
              </div>
              <label className="block text-xs font-medium text-navy/50">
                Description{" "}
                <Input
                  value={s.descriptionOneLiner}
                  onChange={(e) =>
                    updSession(i, "descriptionOneLiner", e.target.value)
                  }
                  className={`mt-1 ${inputLight}`}
                  placeholder="Brief description"
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={addSession}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-cream/50 px-4 py-3 text-sm text-navy/40 hover:text-navy/60 hover:border-navy/20 hover:bg-cream transition-all"
          >
            <Plus size={16} /> Add another session type
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          {avail.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
            >
              <select
                value={a.dayOfWeek}
                onChange={(e) =>
                  updAvail(i, "dayOfWeek", parseInt(e.target.value))
                }
                className="rounded-[8px] bg-white border border-border text-navy px-2 py-2 text-sm outline-none"
              >
                {DAYS.map((d, di) => (
                  <option key={d} className="bg-white text-navy" value={di}>
                    {d}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                value={a.startTime}
                onChange={(e) =>
                  updAvail(i, "startTime", e.target.value)
                }
                className={`flex-1 ${inputLight}`}
              />
              <span className="text-navy/20">—</span>
              <Input
                type="time"
                value={a.endTime}
                onChange={(e) =>
                  updAvail(i, "endTime", e.target.value)
                }
                className={`flex-1 ${inputLight}`}
              />
              {avail.length > 1 && (
                <button
                  type="button"
                  onClick={() => delAvail(i)}
                  className="text-navy/20 hover:text-navy/60 shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAvail}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-cream/50 px-4 py-3 text-sm text-navy/40 hover:text-navy/60 hover:border-navy/20 hover:bg-cream transition-all"
          >
            <Plus size={16} /> Add time slot
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((p) => p - 1)}
            className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-navy/60 hover:bg-cream transition-all"
          >
            Back
          </button>
        )}
        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep((p) => p + 1)}
            disabled={!canNext()}
            className="flex-1 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canNext() || status !== "idle"}
            className="flex-1 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "idle"
              ? "Create alumni account"
              : "Creating..."}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState<"student" | "alumni">("student");
  const [status, setStatus] = useState("idle");

  if (status !== "idle") {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6 bg-cream">
        <div className="relative z-10 rounded-2xl border border-border bg-white p-10 shadow-lg text-center max-w-sm w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream mx-auto">
            {status === "verified" ? (
              <Check size={30} className="text-navy" />
            ) : (
              <LoaderCircle className="animate-spin text-navy" size={28} />
            )}
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-navy">
            {status === "creating"
              ? "Creating your account..."
              : status === "verifying"
                ? "Verifying your email..."
                : "Email verified!"}
          </h1>
          <p className="mt-2 text-navy/50">
            {status === "verified"
              ? "Redirecting you..."
              : "This will only take a moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div className="relative mx-auto max-w-xl px-6 py-14">
        <div className="rounded-2xl border border-border bg-white shadow-lg p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy/50">
            Join the network
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-navy">
            Create your account
          </h1>

          <div className="mt-6 flex gap-1.5 rounded-xl bg-cream p-1 border border-border">
            {(["student", "alumni"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-all ${
                  role === r
                    ? "bg-navy text-white shadow-sm"
                    : "text-navy/40 hover:text-navy/70"
                }`}
              >
                {r === "student" ? "Student" : "Alumni"}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {role === "student" ? (
              <StudentForm onStatusChange={setStatus} />
            ) : (
              <AlumniWizard onStatusChange={setStatus} />
            )}
          </div>

          <p className="mt-8 text-center text-sm text-navy/40">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-navy/80 hover:text-navy underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
