"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
 

function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-main p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
        </div>

        <Card className="shadow-xl border-2 border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent main-text animate-gradient">
              Smart Communication Hub
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Connect, chat, and get AI insights    
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue="login"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-purple-950/30 rounded-lg">
                <TabsTrigger
                  value="login"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Login />
              </TabsContent>

              <TabsContent value="register">
                <Register />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}

export default LoginPage;
