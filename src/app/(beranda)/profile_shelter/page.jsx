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
  const { profile, isLoading: profileLoading, refetch } = useGetShelterProfile();
  const updateProfileMutation = useUpdateShelterProfileMutation({
    successAction: () => {
      refetch();
    },
  });

  const [shelter, setShelter] = useState({
    shelterName: "",
    deskripsi: "",
    email: "",
    metodePembayaran: "",
    nomorRekening: "",
    namaPemilikRekening: "",
    alamatLengkap: "",
  });
  const [shelterDraft, setShelterDraft] = useState({
    shelterName: "",
    deskripsi: "",
    email: "",
    metodePembayaran: "",
    nomorRekening: "",
    namaPemilikRekening: "",
    alamatLengkap: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize shelter data from profile
  useEffect(() => {
    if (profile) {
      const data = {
        shelterName: profile.namaShelter || profile.shelterName || "",
        deskripsi: profile.deskripsi || profile.description || "",
        email: profile.email || "",
        metodePembayaran: profile.metodePembayaran || profile.paymentMethod || "",
        nomorRekening: profile.nomorRekening || profile.accountNumber || "",
        namaPemilikRekening: profile.namaPemilikRekening || profile.accountHolder || "",
        alamatLengkap: profile.alamatLengkap || profile.address || "",
      };
      setShelter(data);
    }
  }, [profile]);

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
    payload.append("deskripsi", shelter.deskripsi);
    payload.append("email", shelter.email);
    payload.append("metodePembayaran", shelter.metodePembayaran);
    payload.append("nomorRekening", shelter.nomorRekening);
    payload.append("namaPemilikRekening", shelter.namaPemilikRekening);
    payload.append("alamatLengkap", shelter.alamatLengkap);
    
    if (file) {
      // append both keys to be compatible with backend variations
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
                ) : profile?.foto ? (
                  <Image
                    src={profile.foto}
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
                      isEditing && (previewUrl || profile?.foto)
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-0"
                    }
                  `}
                >
                  <p className="text-white text-xs font-medium">Ganti foto</p>
                </div>
              </div>

              {/* Trash button (hapus) - hanya saat edit */}
              {(previewUrl || profile?.foto) && isEditing && (
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
              {/* Deskripsi Singkat */}
              <div className="grid w-full gap-2">
                <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                <Input
                  id="deskripsi"
                  value={shelter.deskripsi}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("deskripsi", e.target.value)}
                  className={`${inputClass} ${!isEditing ? readonlyClass : ""}`}
                />
              </div>

              {/* Email (account) - always read-only */}
              <div className="grid w-full gap-2">
                <Label htmlFor="email">Email Akun</Label>
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
                    className={`${inputClass} ${
                      !isEditing ? readonlyClass : ""
                    }`}
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

              <div className="grid w-full gap-2 col-span-2">
                <Label htmlFor="alamatLengkap">Alamat Lengkap Shelter</Label>
                <Input
                  id="alamatLengkap"
                  value={shelter.alamatLengkap}
                  readOnly={!isEditing}
                  onChange={(e) => updateShelter("alamatLengkap", e.target.value)}
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
