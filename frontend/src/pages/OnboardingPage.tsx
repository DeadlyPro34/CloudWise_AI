import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  ArrowRight,
  ArrowLeft,
  Shield,
  Key,
  Loader2,
  CheckCircle,
  Server,
  HardDrive,
  Package,
  Check,
} from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { connectAWS, scanAWS } from "../services/aws";
import { getApiErrorMessage } from "../services/apiClient";
import type { AWSConnectResponse, AWSScanResponse } from "../types";

const STEPS = ["Welcome", "Instructions", "Connect", "Scan"];

const REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "EU (Ireland)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
];

const IAM_PERMISSIONS = [
  "ec2:DescribeInstances",
  "ec2:DescribeVolumes",
  "ec2:DescribeSnapshots",
  "ebs:DescribeVolumes",
  "cloudwatch:GetMetricData",
  "ce:GetCostAndUsage",
];

export function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [scanError, setScanError] = useState("");
  const [connectResult, setConnectResult] = useState<AWSConnectResponse | null>(null);
  const [scanResult, setScanResult] = useState<AWSScanResponse | null>(null);

  async function handleConnect() {
    setIsConnecting(true);
    setConnectError("");
    try {
      const result = await connectAWS({
        aws_access_key_id: accessKey,
        aws_secret_access_key: secretKey,
        region,
      });
      setConnectResult(result);
      setStep(3);
      handleScan();
    } catch (err) {
      setConnectError(getApiErrorMessage(err));
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleScan() {
    setIsScanning(true);
    setScanError("");
    try {
      const result = await scanAWS();
      setScanResult(result);
    } catch (err) {
      setScanError(getApiErrorMessage(err));
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      {/* Back button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium transition-colors hover:text-(--color-text-primary) z-20"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 relative z-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500"
                style={{
                  backgroundColor:
                    i < step
                      ? "var(--color-success)"
                      : i === step
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  boxShadow:
                    i === step ? "0 0 20px rgba(79, 70, 229, 0.4)" : "none",
                }}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className="text-xs font-medium transition-colors duration-300"
                style={{
                  color:
                    i <= step
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-16 h-0.5 mb-5 transition-colors duration-500"
                style={{
                  backgroundColor:
                    i < step ? "var(--color-success)" : "var(--color-surface)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card w-full max-w-xl relative z-10" style={{ transition: "all 0.3s ease" }}>
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center animate-[fadeIn_0.5s_ease]">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                boxShadow: "0 8px 32px rgba(79, 70, 229, 0.3)",
              }}
            >
              <Cloud className="w-10 h-10 text-white" />
            </div>
            <h2 className="mb-2">
              Welcome{user?.first_name ? `, ${user.first_name}` : ""}! 👋
            </h2>
            <p className="caption mb-6 text-base leading-relaxed max-w-md mx-auto">
              CloudWise AI analyzes your AWS infrastructure to find cost-saving opportunities
              using AI-powered recommendations. Let's get your account connected in just a
              few minutes.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Server, label: "Resource Analysis", desc: "Scan EC2 & EBS" },
                { icon: Shield, label: "AI Insights", desc: "Smart Recommendations" },
                { icon: Package, label: "Cost Reports", desc: "Detailed Savings" },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <Icon className="w-6 h-6 mb-2 mx-auto" style={{ color: "var(--color-accent-hover)" }} />
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{desc}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => setStep(1)} className="flex items-center justify-center gap-2 w-full">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 1: Instructions */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.5s_ease]">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
              >
                <Shield className="w-6 h-6" style={{ color: "var(--color-accent-hover)" }} />
              </div>
              <div>
                <h3 className="mb-0">IAM Permissions</h3>
                <p className="caption">Read-only access required</p>
              </div>
            </div>

            <div
              className="rounded-xl p-4 mb-4"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-success)" }}>
                <Shield className="w-4 h-4" />
                CloudWise AI only requires <strong>read-only</strong> permissions. We never modify your resources.
              </p>
            </div>

            <p className="caption mb-4">
              Create an IAM user with the following permissions and generate access keys:
            </p>

            <div className="space-y-2 mb-6">
              {IAM_PERMISSIONS.map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-success)" }} />
                  <code className="text-sm font-mono">{perm}</code>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(0)} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2">
                I'm Ready <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Connect */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.5s_ease]">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
              >
                <Key className="w-6 h-6" style={{ color: "var(--color-accent-hover)" }} />
              </div>
              <div>
                <h3 className="mb-0">Connect AWS</h3>
                <p className="caption">Enter your IAM credentials</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <Input
                label="AWS Access Key ID"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
              />
              <Input
                label="AWS Secret Access Key"
                type="password"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  Region
                </label>
                <select
                  className="input-field cursor-pointer"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {REGIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {connectError && (
              <div
                className="rounded-lg p-3 mb-4 text-sm"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "var(--color-danger)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {connectError}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleConnect}
                isLoading={isConnecting}
                disabled={!accessKey || !secretKey}
                className="flex-1 flex items-center justify-center gap-2"
              >
                Connect Account <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Scan */}
        {step === 3 && (
          <div className="text-center animate-[fadeIn_0.5s_ease]">
            {isScanning ? (
              <>
                <Loader2
                  className="w-16 h-16 mx-auto mb-6 animate-spin"
                  style={{ color: "var(--color-accent-hover)" }}
                />
                <h3 className="mb-2">Scanning Your AWS Resources</h3>
                <p className="caption mb-4">
                  Discovering EC2 instances, EBS volumes, and analyzing costs...
                </p>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
                  <div
                    className="h-full rounded-full animate-[progressBar_2s_ease-in-out_infinite]"
                    style={{
                      background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-hover))",
                      width: "60%",
                    }}
                  />
                </div>
              </>
            ) : scanError ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                >
                  <Package className="w-8 h-8" style={{ color: "var(--color-danger)" }} />
                </div>
                <h3 className="mb-2">Scan Failed</h3>
                <p className="caption mb-4">{scanError}</p>
                <Button onClick={handleScan} className="flex items-center justify-center gap-2 mx-auto">
                  Retry Scan
                </Button>
              </>
            ) : scanResult ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)",
                  }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "var(--color-success)" }} />
                </div>
                <h3 className="mb-2">Scan Complete!</h3>
                <p className="caption mb-6">
                  {connectResult?.account_name
                    ? `Account: ${connectResult.account_name} (${connectResult.account_id})`
                    : "Your AWS resources have been discovered."}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Server, label: "EC2 Instances", count: scanResult.ec2_count, color: "var(--color-accent-hover)" },
                    { icon: HardDrive, label: "EBS Volumes", count: scanResult.ebs_count, color: "var(--color-warning)" },
                    { icon: Package, label: "Total Resources", count: scanResult.total_resources, color: "var(--color-success)" },
                  ].map(({ icon: Icon, label, count, color }) => (
                    <div
                      key={label}
                      className="p-4 rounded-xl transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    >
                      <Icon className="w-6 h-6 mb-2 mx-auto" style={{ color }} />
                      <p className="text-2xl font-bold mb-1">{count}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
