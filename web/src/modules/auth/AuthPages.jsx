import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout, ArrowRight, CheckCircle2, AlertCircle, Building2, User,
  Mail, Phone, Lock, MapPin, Loader2, ShieldCheck, Briefcase,
  FileSpreadsheet, Calculator, Receipt, UserCheck
} from "lucide-react";
import { apiRequest } from "../../lib/api";
import logoImg from "../../assets/branding/NurseryDeskLogo.png";

const quickLogins = [
  {
    role: "Super Admin",
    email: "superadmin@nurseryos.com",
    password: "Password@123",
    icon: ShieldCheck,
    color: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
  },
  {
    role: "Nursery Owner",
    email: "owner@greenvalleynursery.in",
    password: "Password@123",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
  },
  {
    role: "Branch Manager",
    email: "manager@greenvalleynursery.in",
    password: "Password@123",
    icon: Building2,
    color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
  },
  {
    role: "Accountant",
    email: "accountant@greenvalleynursery.in",
    password: "Password@123",
    icon: Calculator,
    color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
  },
  {
    role: "Billing Staff",
    email: "billing@greenvalleynursery.in",
    password: "Password@123",
    icon: Receipt,
    color: "bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200",
  },
  {
    role: "General Staff",
    email: "staff@greenvalleynursery.in",
    password: "Password@123",
    icon: UserCheck,
    color: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setError("");
    setIsPendingApproval(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsPendingApproval(false);
    setLoading(true);

    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.success && res.data) {
        localStorage.setItem("nursery_user", JSON.stringify(res.data.user));

        if (res.data.user?.isSuperAdmin) {
          localStorage.removeItem("nursery_current_org");
          localStorage.removeItem("nursery_current_branch");
          navigate("/admin/organizations");
        } else {
          if (res.data.workspaces && res.data.workspaces.length > 0) {
            const defaultWs = res.data.workspaces[0];
            localStorage.setItem("nursery_current_org", defaultWs.organization._id || defaultWs.organization.id);
            localStorage.setItem("nursery_current_branch", defaultWs.branchAccess?.[0]?.branchId || "");
          }
          navigate("/dashboard");
        }
      }
    } catch (err) {
      if (err.message && err.message.includes("pending approval")) {
        setIsPendingApproval(true);
      }
      setError(err.message || "Failed to sign in. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to manage your nursery business and sales.">
      {isPendingApproval ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-950">Registration Pending Super Admin Verification</h4>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                Your nursery business registration has been received and is currently under review by the platform Super Admin. Once approved, you will be able to sign in and access all business features.
              </p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
          <AlertCircle size={17} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Quick Login Icons */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Quick Demo Login
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {quickLogins.map((item) => {
            const Icon = item.icon;
            const isSelected = formData.email === item.email;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => handleQuickLogin(item.email, item.password)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition ${item.color} ${
                  isSelected ? "ring-2 ring-emerald-600 shadow-sm" : ""
                }`}
                title={`Click to fill ${item.role} credentials (${item.email})`}
              >
                <Icon size={16} />
                <span className="text-[10px] font-bold leading-tight">{item.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Business Email Address</label>
          <div className="relative">
            <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-3 text-sm focus:border-emerald-600 focus:outline-none"
              placeholder="you@nursery.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold uppercase text-slate-600">Password</label>
            <a href="#" className="text-xs font-semibold text-emerald-700 hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-3 text-sm focus:border-emerald-600 focus:outline-none"
              placeholder="Enter your account password"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b6840] py-3 text-sm font-bold text-white shadow-md hover:bg-[#155433] transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Sign in to Workspace <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New nursery?{" "}
        <Link className="font-semibold text-emerald-700 hover:underline" to="/register">
          Register your nursery business
        </Link>
      </p>
    </AuthShell>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setRegisteredSuccess(true);
        if (res.data?.organization?.id) {
          localStorage.setItem("nursery_current_org", res.data.organization.id);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to complete registration. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Register Your Nursery"
      subtitle="Join India's dedicated Nursery SaaS for managing plant inventory, branches, transport, and billing."
    >
      {registeredSuccess ? (
        <div className="space-y-5 text-center py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <ShieldCheck size={32} />
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              Status: Pending Admin Approval
            </span>
            <h2 className="text-xl font-bold text-slate-900">Registration Submitted Successfully!</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
              Your nursery <strong>{formData.businessName}</strong> has been registered on the platform and placed in <strong>Pending Approval</strong> status.
            </p>
            <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto">
              A platform Super Admin will verify your nursery details and approve access. You can sign in once approval is granted.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-[#1b6840] py-3 text-sm font-bold text-white shadow-md hover:bg-[#155433]"
          >
            Return to Sign in
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
              <AlertCircle size={17} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Nursery Business / Farm Name
              </label>
              <div className="relative">
                <Building2 size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. Green Valley Farm & Agro Nursery"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Owner Name</label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="owner@nursery.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Create Password</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Nursery / Farm Street Address
              </label>
              <div className="relative">
                <MapPin size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. Survey No. 42, Main Road, Near Canal"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">City / Hub</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. Kadiyam"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. AP"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g. 533126"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b6840] py-3 text-sm font-bold text-white shadow-md hover:bg-[#155433] transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Registering Nursery...
                </>
              ) : (
                "Submit Nursery Registration"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link className="font-semibold text-emerald-700 hover:underline" to="/">
              Sign in to workspace
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F1] p-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-[#E2EAE3] bg-white p-8 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <img
            src={logoImg}
            alt="NurseryDesk"
            className="h-12 w-auto max-w-[200px] object-contain"
          />
          <div className="text-right">
            <span className="rounded-md bg-[#A8C9A5]/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#123D2B] border border-[#A8C9A5]/40">
              SaaS Edition
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#1F2937]">{title}</h1>
        <p className="mb-6 mt-1.5 text-sm text-[#64748B]">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

