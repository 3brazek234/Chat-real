import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

function UploadProfileImg() {
  const { user, updateUser, token: storedToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(
        "http://localhost:3001/api/update-profile-image",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token || storedToken}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      if (user) {
        const updatedUser = { ...user, avatar_url: data.avatarUrl };
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }

      const newAvatarData = { avatar_url: data.avatarUrl };
      updateUser(newAvatarData);
      toast.success("Profile picture updated!");
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!user) return null;
  return (
    <>
      <div className="flex flex-col items-center gap-4 py-4">
        <label
          htmlFor="avatar-upload"
          className="relative cursor-pointer group"
        >
          <Avatar className="h-28 w-28 text-3xl ring-1 ring-white/6">
            <AvatarImage src={previewUrl || user.avatar_url} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </label>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-center">
          <p className="text-sm text-gray-300">
            Click on the image to select a new picture.
          </p>
        </div>
      </div>
      <DialogFooter>
        {selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isUploading ? "Uploading..." : "Save Picture"}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

export default UploadProfileImg;
