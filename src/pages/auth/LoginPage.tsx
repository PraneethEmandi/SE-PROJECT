
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [role, setRole] = useState<string>("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to continue to the portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty Advisor</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com"
                  className="pl-10" 
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password"
                  className="pl-10" 
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
