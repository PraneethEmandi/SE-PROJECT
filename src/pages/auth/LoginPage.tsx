
// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Lock, Mail } from "lucide-react";

// const LoginPage = () => {
//   const [role, setRole] = useState<string>("");

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center dark-gradient p-4">
//       <div className="w-full max-w-md animate-fade-in">
//         <Card className="glass">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome back</CardTitle>
//             <CardDescription className="text-center">
//               Sign in to continue to the portal
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="role">Role</Label>
//               <Select value={role} onValueChange={setRole}>
//                 <SelectTrigger className="bg-secondary">
//                   <SelectValue placeholder="Select your role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="student">Student</SelectItem>
//                   <SelectItem value="faculty">Faculty Advisor</SelectItem>
//                   <SelectItem value="admin">Administrator</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Input 
//                   id="email" 
//                   type="email" 
//                   placeholder="m@example.com"
//                   className="pl-10 bg-secondary border-secondary" 
//                 />
//                 <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input 
//                   id="password" 
//                   type="password"
//                   className="pl-10 bg-secondary border-secondary" 
//                 />
//                 <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button className="w-full">
//               Sign In
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Mail } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const LoginPage = () => {
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!role) {
      toast.error("Please select your role.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // Send role in request
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success(`Welcome, ${data.user.name}!`);
        localStorage.setItem("token", data.token); // Store token in localStorage
        console.log("Login successful");

        // Redirect based on role with user ID
        switch (data.user.role) {
          case "Student":
            navigate(`/student/dashboard/${data.user.id}`);
            break;
          case "Faculty":
            navigate(`/faculty/dashboard/${data.user.id}`);
            break;
          case "Administrator":
            navigate(`/admin/dashboard/${data.user.id}`);
            break;
          default:
            toast.error("Invalid role detected.");
        }
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen w-full flex items-center justify-center dark-gradient p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-center">Sign in to continue to the portal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty Advisor</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="pl-10 bg-secondary border-secondary" 
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
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary border-secondary" 
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
