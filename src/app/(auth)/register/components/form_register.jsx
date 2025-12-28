"use client";

import { useState } from "react";
import { SizedBox, Row } from "@/components/shared/custom_widget";
import { FloatingInput } from "@/components/shared/floating_input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function FormRegister() {
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPass: "",
  });

  const [agree, setAgree] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPass
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    if (formData.password !== formData.confirmPass) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    if (!agree) {
      toast.error("Anda harus menyetujui Terms & Privacy Policy");
      return;
    }

    const payload = {
      email: formData.email,
      nama: `${formData.firstName} ${formData.lastName}`.trim(),
      noTelepon: formData.phone,
      password: formData.password,
    };

    const result = await register(payload);

    if (result?.success) {
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <div className="flex-1">
          <FloatingInput
            id="firstName"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <SizedBox width={15} />
        <div className="flex-1">
          <FloatingInput
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </Row>

      <SizedBox height={15} />

      <Row>
        <div className="flex-1">
          <FloatingInput
            id="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <SizedBox width={15} />
        <div className="flex-1">
          <FloatingInput
            id="phone"
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </Row>

      <SizedBox height={15} />

      <FloatingInput
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <SizedBox height={15} />

      <FloatingInput
        id="confirmPass"
        name="confirmPass"
        type="password"
        label="Confirm Password"
        value={formData.confirmPass}
        onChange={handleChange}
        required
      />

      <SizedBox height={15} />

      <div className="flex items-center gap-3">
        <Checkbox
          id="agreeTerms"
          checked={agree}
          onCheckedChange={(v) => setAgree(Boolean(v))}
          className="cursor-pointer data-[state=checked]:bg-[#FF8D28]"
        />
        <Label htmlFor="agreeTerms" className="text-sm font-[500]">
          I agree to{" "}
          <Link href="/terms" className="text-[#FF8D28] hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#FF8D28] hover:underline">
            Privacy Policies
          </Link>
        </Label>
      </div>

      <SizedBox height={30} />

      <Button
        type="submit"
        disabled={isLoading}
        className="h-[45px] w-full bg-[#FF8D28] hover:bg-[#FBA81F] rounded-sm disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <SizedBox height={12} />

      <p className="text-center font-[500] text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-[#FF8D28] hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
