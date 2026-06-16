"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  SizedBox,
  Text,
  Column,
  Container,
  Row,
} from "@/components/shared/custom_widget";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IconAssets } from "@/common/constant/assets";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useGetShelterProfile, useUpdateShelterProfileMutation } from "@/hooks/shelter.hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfileShelterPage() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, refetch } = useGetShelterProfile();
  const updateProfileMutation = useUpdateShelterProfileMutation({
    successAction: () => {
      refetch();
    },
  });

  const [shelter, setShelter] = useState({
    shelterName: "",
    namaPemilik: "",
    noTelepon: "",
    email: "",
    metodePembayaran: "",
    negara: "",
    jalan: "",
    telekomunkasi: "",
    zipCode: "",
    deskripsi: "",
    nomorRekening: "",
    namaPemilikRekening: "",
  });
  const [shelterDraft, setShelterDraft] = useState({
    shelterName: "",
    namaPemilik: "",
    noTelepon: "",
    email: "",
    metodePembayaran: "",
    negara: "",
    jalan: "",
    telekomunkasi: "",
    zipCode: "",
    deskripsi: "",
    nomorRekening: "",
    namaPemilikRekening: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize shelter data from profile
  useEffect(() => {
    console.log("📋 [ProfileShelter] Profile received:", profile);
    console.log("📋 [ProfileShelter] Profile loading:", profileLoading);
    console.log("📋 [ProfileShelter] User email:", user?.email);
    if (profile && profile.shelterAcc) {
      console.log("📋 [ProfileShelter] Mapping profile data from shelterAcc...");
      const shelterAcc = profile.shelterAcc;
      const data = {
        shelterName: shelterAcc.namaShelter || "",
        namaPemilik: shelterAcc.namaPemilik || shelterAcc.namaOwner || "",
        noTelepon: shelterAcc.noTelepon || shelterAcc.nomorTelepon || "",
        email: profile.email || user?.email || "",
        metodePembayaran: shelterAcc.metodePembayaran || "",
        negara: shelterAcc.negara || "",
        jalan: shelterAcc.jalan || shelterAcc.alamatJalan || "",
        telekomunkasi: shelterAcc.telekomunkasi || shelterAcc.telekomunikasi || "",
        zipCode: shelterAcc.zipCode || shelterAcc.kodePos || "",
        deskripsi: shelterAcc.deskripsi || "",
        nomorRekening: shelterAcc.nomorRekening || "",
        namaPemilikRekening: shelterAcc.namaPemilikRekening || "",
      };
      console.log("✅ [ProfileShelter] Mapped data:", data);
      setShelter(data);
      // Also set preview URL if logo exists
      if (shelterAcc.urlLogo && !previewUrl) {
        console.log("📷 Setting logo preview:", shelterAcc.urlLogo);
        setPreviewUrl(shelterAcc.urlLogo);
      }
    } else {
      console.warn("⚠ [ProfileShelter] No profile or shelterAcc data received");
    }
  }, [profile, user]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const updateShelter = (key, value) => {
    setShelter((prev) => ({ ...prev, [key]: value }));
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!isEditing) return;

      const selectedFile = acceptedFiles?.[0];
      if (!selectedFile) return;

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.warning("File terlalu besar. Maksimum 5MB");
        return;
      }

      // revoke preview lama
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));

      if (errors.file) setErrors((prev) => ({ ...prev, file: null }));
    },
    [errors.file, previewUrl, isEditing]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const inputClass =
    "w-full bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500";

  const readonlyClass = "bg-gray-50 text-gray-600 cursor-not-allowed";

  const handleStartEdit = () => {
    setShelterDraft(shelter);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setShelter(shelterDraft);
    setIsEditing(false);

    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");

    setErrors({});
  };

  const handleSave = () => {
    const payload = new FormData();
    payload.append("namaShelter", shelter.shelterName);
    payload.append("namaPemilik", shelter.namaPemilik);
    payload.append("noTelepon", shelter.noTelepon);
    payload.append("email", shelter.email);
    payload.append("metodePembayaran", shelter.metodePembayaran);
    payload.append("negara", shelter.negara);
    payload.append("jalan", shelter.jalan);
    payload.append("telekomunkasi", shelter.telekomunkasi);
    payload.append("zipCode", shelter.zipCode);
    payload.append("deskripsi", shelter.deskripsi);
    payload.append("nomorRekening", shelter.nomorRekening);
    payload.append("namaPemilikRekening", shelter.namaPemilikRekening);
    
    if (file) {
      payload.append("logo", file);
      payload.append("foto", file);
    }

    updateProfileMutation.mutate({ payload });
    setIsEditing(false);
  };

  if (profileLoading) {
    return <div className="p-8 text-center">Memuat profil shelter...</div>;
  }

  return (
    <Container className="bg-white border border-gray-200 rounded-lg">
      <Container className="border-b">
        <Text size={15} className="font-medium p-4">
          PROFILE SHELTER
        </Text>
      </Container>

      <form>
        <Row crossAxisAlignment="start" className="gap-8 p-8">
          {/* Shelter Photo (Circle Upload) */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div
                {...getRootProps()}
                onClick={isEditing ? open : undefined}
                className={`relative w-32 h-32 rounded-full overflow-hidden border-2
                  flex items-center justify-center text-center select-none
                  ${errors.file ? "border-red-500" : "border-gray-300"}
                  ${isDragActive ? "bg-muted/50" : "bg-gray-50"}
                  ${
                    isEditing
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-70"
                  }
                `}
                title={
                  isEditing
                    ? "Klik untuk upload / ganti foto"
                    : "Klik Update Shelter untuk edit"
                }
              >
                <input {...getInputProps()} />

                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Shelter Photo"
                    fill
                    className="object-cover"
                  />
                ) : profile?.shelterAcc?.urlLogo ? (
                  <Image
                    src={profile.shelterAcc.urlLogo}
                    alt="Shelter Photo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="px-3">
                    <Image
                      src={
                        IconAssets.imageUpload || "/assets/icon/icon-upload.svg"
                      }
                      width={26}
                      height={26}
                      alt="upload"
                      className="mx-auto opacity-80"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {isDragActive ? "Lepas file di sini" : "Upload foto"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      JPG/PNG • Max 5MB
                    </p>
                  </div>
                )}

                {/* Overlay hover (ganti foto) */}
                <div
                  className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition
                    flex items-center justify-center
                    ${
                      isEditing && (previewUrl || profile?.shelterAcc?.urlLogo)
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-0"
                    }
                  `}
                >
                  <p className="text-white text-xs font-medium">Ganti foto</p>
                </div>
              </div>

              {/* Trash button (hapus) - hanya saat edit */}
              {(previewUrl || profile?.shelterAcc?.urlLogo) && isEditing && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl("");
                  }}
                  className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border shadow-sm
                    flex items-center justify-center hover:bg-red-50 transition"
                  title="Hapus foto"
                >
                  <Trash2 className="text-red-500" size={18} />
                </button>
              )}
            </div>

            {errors.file && (
              <p className="text-red-500 text-xs">{errors.file}</p>
            )}
          </div>

          {/* Form */}
          <Column className="w-full" crossAxisAlignment="start">
            <div className="w-full grid grid-cols-2 gap-8">
              {/* Nama Shelter */}
              <div className="grid w-full gap-2">
                <Label htmlFor="shelterName">Nama Shelter</Label>
                <Input
                  id="shelterName"
                  value={shelter.shelterName}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("shelterName", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Nama Owner */}
              <div className="grid w-full gap-2">
                <Label htmlFor="namaPemilik">Nama Owner</Label>
                <Input
                  id="namaPemilik"
                  value={shelter.namaPemilik}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("namaPemilik", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Nomor Telephone */}
              <div className="grid w-full gap-2">
                <Label htmlFor="noTelepon">Nomor Telephone</Label>
                <Input
                  id="noTelepon"
                  value={shelter.noTelepon}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("noTelepon", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Email (account) - always read-only */}
              <div className="grid w-full gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={shelter.email}
                  readOnly
                  className={`${inputClass} ${readonlyClass}`}
                />
              </div>

              {/* Metode Pembayaran */}
              <div className="grid w-full gap-2">
                <Label>Metode Pembayaran</Label>
                <Select
                  value={shelter.metodePembayaran}
                  onValueChange={(v) => updateShelter("metodePembayaran", v)}
                  disabled={!isEditing}
                >
                  <SelectTrigger
                    className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                  >
                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Metode Pembayaran</SelectLabel>
                      <SelectItem value="mandiri">Mandiri</SelectItem>
                      <SelectItem value="dana">Dana</SelectItem>
                      <SelectItem value="gopay">GoPay</SelectItem>
                      <SelectItem value="qris">QRIS</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <SizedBox />

              {/* Negara/Daerah */}
              <div className="grid w-full gap-2">
                <Label htmlFor="negara">Negara/Daerah</Label>
                <Input
                  id="negara"
                  value={shelter.negara}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("negara", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Jalan */}
              <div className="grid w-full gap-2">
                <Label htmlFor="jalan">Jalan</Label>
                <Input
                  id="jalan"
                  value={shelter.jalan}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("jalan", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Zip Code */}
              <div className="grid w-full gap-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={shelter.zipCode}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("zipCode", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Telekomunkasi */}
              <div className="grid w-full gap-2">
                <Label htmlFor="telekomunkasi">Telekomunkasi</Label>
                <Input
                  id="telekomunkasi"
                  value={shelter.telekomunkasi}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("telekomunkasi", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              <SizedBox />

              {/* Deskripsi */}
              <div className="grid w-full gap-2 col-span-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Input
                  id="deskripsi"
                  value={shelter.deskripsi}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("deskripsi", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Nomor Rekening */}
              <div className="grid w-full gap-2">
                <Label htmlFor="nomorRekening">Nomor Rekening</Label>
                <Input
                  id="nomorRekening"
                  value={shelter.nomorRekening}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("nomorRekening", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Nama Pemilik Rekening */}
              <div className="grid w-full gap-2">
                <Label htmlFor="namaPemilikRekening">Nama Pemilik Rekening</Label>
                <Input
                  id="namaPemilikRekening"
                  value={shelter.namaPemilikRekening}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("namaPemilikRekening", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>
            </div>

            <SizedBox height={25} />

            {/* Buttons */}
            <div className="flex gap-3">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={handleStartEdit}
                  className="h-[40px] bg-[#FF8D28] hover:bg-[#FBA81F] cursor-pointer rounded-sm"
                >
                  Update Shelter
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="h-[40px] bg-[#FF8D28] hover:bg-[#FBA81F] cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateProfileMutation.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={updateProfileMutation.isPending}
                    className="h-[40px] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </Button>
                </>
              )}
            </div>
          </Column>
        </Row>
      </form>
    </Container>
  );
}
