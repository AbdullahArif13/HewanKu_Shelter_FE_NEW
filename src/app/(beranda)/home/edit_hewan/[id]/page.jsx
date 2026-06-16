"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useNavigator } from "@/utils/helper";
import { useEditAnimalMutation, useGetAnimalDetails } from "@/hooks/animal.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/shared/custom_widget";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { IconAssets } from "@/common/constant/assets";

const emptyForm = {
  animalName: "",
  category: "",
  imageUrl: "",
  price: "",
  age: "",
  phone: "",
  gender: "",
  status: "",
  paymentMethod: "",
  rekening: "",
};

export default function EditHewanPage() {
  const params = useParams();
  const id = params?.id;
  const nav = useNavigator();
  const { animal, isLoading } = useGetAnimalDetails({ id });
  const [form, setForm] = useState(emptyForm);
  const [animalFile, setAnimalFile] = useState(null);
  const [qrisFile, setQrisFile] = useState(null);
  const [previewAnimalUrl, setPreviewAnimalUrl] = useState("");
  const [previewQrisName, setPreviewQrisName] = useState("");

  const { editAnimalMutation } = useEditAnimalMutation({
    successAction: () => {
      nav.push("/home");
    },
  });

  useEffect(() => {
    if (animal) {
      setForm({
        animalName: animal.namaHewan || animal.animalName || "",
        category: animal.kategori || animal.category || "",
        imageUrl: animal.imageUrl || animal.image || "",
        price: animal.harga || animal.price || "",
        age: animal.umur || animal.age || "",
        phone: animal.noTelepon || animal.phone || "",
        gender: animal.jenisKelamin || animal.gender || "",
        status: animal.status || "",
        paymentMethod: animal.metodePembayaran || animal.paymentMethod || "",
        rekening: animal.rekening || "",
      });
      if (animal.imageUrl || animal.image) setPreviewAnimalUrl(animal.imageUrl || animal.image);
    }
  }, [animal]);

  useEffect(() => {
    return () => {
      if (previewAnimalUrl && animalFile) URL.revokeObjectURL(previewAnimalUrl);
    };
  }, [previewAnimalUrl, animalFile]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onDropAnimal = useCallback((acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.warning("File terlalu besar. Maksimum 50MB");
      return;
    }
    if (previewAnimalUrl && animalFile) URL.revokeObjectURL(previewAnimalUrl);
    setAnimalFile(file);
    setPreviewAnimalUrl(URL.createObjectURL(file));
  }, [animalFile, previewAnimalUrl]);

  const onDropQris = useCallback((acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.warning("File terlalu besar. Maksimum 50MB");
      return;
    }
    setQrisFile(file);
    setPreviewQrisName(file.name);
  }, []);

  const { getRootProps: getRootAnimalProps, getInputProps: getInputAnimalProps, isDragActive: isDragActiveAnimal, open: openAnimalPicker } = useDropzone({
    onDrop: onDropAnimal,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const { getRootProps: getRootQrisProps, getInputProps: getInputQrisProps, isDragActive: isDragActiveQris, open: openQrisPicker } = useDropzone({
    onDrop: onDropQris,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const handleSubmit = () => {
    if (!form.animalName || !form.category || !form.price || !form.status) {
      toast.error("Lengkapi semua field penting terlebih dahulu");
      return;
    }

    const payload = new FormData();
    payload.append("namaHewan", form.animalName);
    payload.append("kategori", form.category);
    payload.append("harga", form.price);
    payload.append("umur", form.age);
    payload.append("noTelepon", form.phone);
    payload.append("jenisKelamin", form.gender);
    payload.append("status", form.status);
    payload.append("metodePembayaran", form.paymentMethod);
    payload.append("rekening", form.rekening);
    if (form.imageUrl) payload.append("imageUrl", form.imageUrl);
    if (animalFile) payload.append("hewan", animalFile);
    if (qrisFile) payload.append("file", qrisFile);

    editAnimalMutation.mutate({ id, payload });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat detail hewan...</div>;
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <Text className="text-xl font-semibold">Edit Hewan Kamu</Text>
          <Button type="button" variant="outline" onClick={() => nav.push("/home")}>Batal</Button>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="animalName">Nama Hewan dan Jenisnya</Label>
              <Input id="animalName" value={form.animalName} onChange={(e) => updateForm("animalName", e.target.value)} placeholder="Ali - Labrador Retriever" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" value={form.category} onChange={(e) => updateForm("category", e.target.value)} placeholder="Anjing" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={form.imageUrl} onChange={(e) => updateForm("imageUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Harga</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => updateForm("price", e.target.value)} placeholder="Rp2.000.000" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="age">Umur</Label>
              <Input id="age" value={form.age} onChange={(e) => updateForm("age", e.target.value)} placeholder="2 Tahun" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telephone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+62821xxxx" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Input id="gender" value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} placeholder="Jantan" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" value={form.status} onChange={(e) => updateForm("status", e.target.value)} placeholder="Tersedia" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
              <Select value={form.paymentMethod} onValueChange={(value) => updateForm("paymentMethod", value)}>
                <SelectTrigger className="w-full bg-white rounded-sm">
                  <SelectValue placeholder="Pilih Metode Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Metode Pembayaran</SelectLabel>
                    <SelectItem value="mandiri">Mandiri</SelectItem>
                    <SelectItem value="gopay">GoPay</SelectItem>
                    <SelectItem value="dana">Dana</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rekening">Rekening Kamu</Label>
            <Input id="rekening" value={form.rekening} onChange={(e) => updateForm("rekening", e.target.value)} placeholder="103012300249" />
          </div>

          <div className="grid gap-2">
            <Label>Upload Foto Hewan</Label>
            <div
              {...getRootAnimalProps()}
              className={`rounded-xl border border-dashed p-8 text-center cursor-pointer transition ${isDragActiveAnimal ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white"}`}
              onClick={openAnimalPicker}
            >
              <input {...getInputAnimalProps()} />
              {previewAnimalUrl ? (
                <div className="mx-auto w-48 h-48 relative rounded-3xl overflow-hidden">
                  <Image src={previewAnimalUrl} alt="Animal preview" fill className="object-cover" />
                </div>
              ) : (
                <>
                  <Image src={IconAssets.imageUpload} width={30} height={30} alt="Upload" className="mx-auto mb-3" />
                  <p className="font-medium">Pilih file atau seret & jatuhkan di sini</p>
                  <p className="text-sm text-gray-500">Format PNG dan JPEG hingga 50MB</p>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Upload QRIS (opsional)</Label>
            <div
              {...getRootQrisProps()}
              className={`rounded-xl border border-dashed p-8 text-center cursor-pointer transition ${isDragActiveQris ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white"}`}
              onClick={openQrisPicker}
            >
              <input {...getInputQrisProps()} />
              <Image src={IconAssets.imageUpload} width={30} height={30} alt="Upload" className="mx-auto mb-3" />
              <p className="font-medium">Pilih file atau seret & jatuhkan di sini</p>
              <p className="text-sm text-gray-500">Format PNG dan JPEG hingga 50MB</p>
              {previewQrisName && <p className="mt-3 text-sm text-gray-900">{previewQrisName}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => nav.push("/home")}>Batal</Button>
            <Button type="button" disabled={editAnimalMutation.isPending} onClick={handleSubmit}>
              {editAnimalMutation.isPending ? "Menyimpan..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
