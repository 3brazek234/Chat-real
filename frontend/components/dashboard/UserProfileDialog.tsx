import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EditProfile from "./EditProfile";
import UploadProfileImg from "./UploadProfileImg";
import UserAvatar from "./UserAvatar";
import { ChevronDown } from "lucide-react";

export const UserProfileDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
     <Button
          variant="ghost"
          className="flex items-center gap-1.5 px-2 py-1 h-10 rounded-full 
                     ring-1 ring-white/10 hover:bg-white/10 
                     hover:ring-purple-400/30 transition-all"
        >
          {/* 2. الأفاتار (بحجم أصغر شوية عشان يناسب) */}
          <UserAvatar className="h-8 w-8" />
          
          {/* 3. 💡 الأيقونة الجديدة (جوه الزرار) */}
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] bg-black/60 backdrop-blur-lg border border-purple-600/10 shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-red-400">
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-purple-900/10 rounded-md">
            <TabsTrigger
              value="profile"
              className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Edit Profile
            </TabsTrigger>
            <TabsTrigger
              value="avatar"
              className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Change Picture
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <EditProfile />
          </TabsContent>

          <TabsContent value="avatar">
            <UploadProfileImg />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
