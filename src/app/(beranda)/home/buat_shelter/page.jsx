"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  SizedBox,
  Text,
  Column,
  Container,
  Padding,
  Row,
} from "@/components/shared/custom_widget";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageAssets, IconAssets } from "@/common/constant/assets";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShelter } from "@/contexts/shelter-context";
import { useNavigator } from "@/utils/helper";

const shelterData = {
  shelterName: "",
  ownerName: "",
  email: "",
  noTelephone: "",
  metodePembayaran: "",
  negara: "",
  jalan: "",
  zipCode: "",
};

export default function BuatShelter() {
  const [shelter, setShelter] = useState(shelterData);
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { markShelterCreated } = useShelter();
  const nav = useNavigator();

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
      const selectedFile = acceptedFiles?.[0];
      if (!selectedFile) return;

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.warning("File terlalu besar. Maksimum 5MB");
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));

      if (errors.file) setErrors((prev) => ({ ...prev, file: null }));
    },
    [errors.file, previewUrl]
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

  const handleSubmit = () => {
    // 🔴 validasi minimal
    if (!shelter.shelterName || !shelter.ownerName || !shelter.email) {
      toast.error("Lengkapi data shelter terlebih dahulu");
      return;
    }

    if (!file) {
      toast.error("Upload foto shelter terlebih dahulu");
      return;
    }

    // ✅ simulasi submit sukses
    toast.success("Shelter berhasil dibuat");

    // 🔓 unlock sistem
    markShelterCreated();

    // 🔁 redirect ke home
    nav.replace("/home");
  };

  return (
    <Container className="bg-white border border-gray-200 rounded-lg">
      <Container className="border-b">
        <Text size={15} className="font-medium p-4">
          BUAT SHELTER
        </Text>
      </Container>

      <form>
        <Row crossAxisAlignment="start" className="gap-8 p-8">
          {/* Shelter Photo (Circle Upload) */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              {/* Circle */}
              <div
                {...getRootProps()}
                onClick={open}
                className={`w-32 h-32 rounded-full overflow-hidden border-2 cursor-pointer
        flex items-center justify-center text-center select-none
        ${errors.file ? "border-red-500" : "border-gray-300"}
        ${isDragActive ? "bg-muted/50" : "bg-gray-50"}
      `}
                title="Klik untuk upload / ganti foto"
              >
                <input {...getInputProps()} />

                {/* Preview if exists */}
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Shelter Photo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="px-3">
                    <Image
                      src={IconAssets.imageUpload}
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
          ${previewUrl ? "opacity-0 group-hover:opacity-100" : "opacity-0"}
        `}
                >
                  <p className="text-white text-xs font-medium">Ganti foto</p>
                </div>
              </div>

              {/* Trash button (hapus) */}
              {previewUrl && (
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
                  {/* icon sampah: pakai lucide kalau ada, atau svg kecil */}
                  <Trash2 color="#ff0000" />
                </button>
              )}
            </div>

            {errors.file && (
              <p className="text-red-500 text-xs">{errors.file}</p>
            )}
          </div>

          <Column className="w-full" crossAxisAlignment="start">
            <div className="w-full grid grid-cols-2 gap-8">
              <div className="grid w-full gap-2">
                <Label htmlFor="shelterName">Nama Shelter</Label>
                <Input
                  id="shelterName"
                  value={shelter.shelterName}
                  onChange={(e) => updateShelter("shelterName", e.target.value)}
                  className="bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="ownerName">Nama Owner</Label>
                <Input
                  id="ownerName"
                  value={shelter.ownerName}
                  onChange={(e) => updateShelter("ownerName", e.target.value)}
                  className="bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="noTelephone">Nomor Telephone</Label>
                <Input
                  id="noTelephone"
                  value={shelter.noTelephone}
                  onChange={(e) => updateShelter("noTelephone", e.target.value)}
                  className="bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={shelter.email}
                  onChange={(e) => updateShelter("email", e.target.value)}
                  className="bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                />
              </div>

              <div className="grid w-full gap-2">
                <Label>Metode Pembayaran</Label>
                <Select
                  value={shelter.metodePembayaran}
                  onValueChange={(v) => updateShelter("metodePembayaran", v)}
                >
                  <SelectTrigger className="w-full bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500">
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
                <Label>Negara/Daerah</Label>
                <Select
                  value={shelter.negara}
                  onValueChange={(v) => updateShelter("negara", v)}
                >
                  <SelectTrigger className="w-full bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500">
                    <SelectValue placeholder="Pilih Negara/Daerah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Negara/Daerah</SelectLabel>
                      <SelectItem value="indonesia">Indonesia</SelectItem>
                      <SelectItem value="malaysia">Malaysia</SelectItem>
                      <SelectItem value="singapure">Singapure</SelectItem>
                      <SelectItem value="thailand">Thailand</SelectItem>
                      <SelectItem value="myanmar">Myanmar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Row className="gap-4">
                <div className="grid w-full gap-2">
                  <Label>Jalan</Label>
                  <Select
                    value={shelter.jalan}
                    onValueChange={(v) => updateShelter("jalan", v)}
                  >
                    <SelectTrigger className="w-full bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500">
                      <SelectValue placeholder="Pilih Jalan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Jalan</SelectLabel>
                        <SelectItem value="telekomunikasi">
                          Telekomunikasi
                        </SelectItem>
                        <SelectItem value="marditomo">Mardi Utomo</SelectItem>
                        <SelectItem value="diponegoro">Diponegoro</SelectItem>
                        <SelectItem value="jendralSudirman">
                          Jendral Sudirman
                        </SelectItem>
                        <SelectItem value="bojongsoang">Bojongosang</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full grid gap-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={shelter.zipCode}
                    onChange={(e) => updateShelter("zipCode", e.target.value)}
                    className="bg-white rounded-sm focus-visible:ring-[3px] focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                  />
                </div>
              </Row>
            </div>
            <SizedBox height={25} />
            <Button
              type="button"
              onClick={handleSubmit}
              className="h-[40px] w-1/4 bg-[#FF8D28] hover:bg-[#FBA81F] cursor-pointer rounded-sm"
            >
              Buat Shelter
            </Button>
          </Column>
        </Row>
      </form>
    </Container>
  );
}
