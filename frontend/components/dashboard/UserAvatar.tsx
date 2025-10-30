import { useAuth } from "@/context/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils"; // 👈 (اتأكد إنك عامل import للـ cn utility)

// 1. بنقبل className كـ prop
interface UserAvatarProps {
  className?: string;
}

function UserAvatar({ className }: UserAvatarProps) {
  const { user } = useAuth();
  
  if (!user) return null; // (أو اعرض أفاتار ضيف)

  return (
    // 2. بنستخدم cn عشان ندمج الـ className اللي جاي
    //    مع الكلاسات الافتراضية. (تقدر تغير h-10 w-10 من بره)
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage 
        src={user.avatar_url || ''} 
        alt={user.name} 
        className="object-cover" // 👈 بيضمن إن الصورة تملى الفراغ
      />
      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        {user.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;