// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import DashboardLayout from "@/components/layout/DashboardLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// import { Users, UserPlus, BookUser } from "lucide-react";

// const AdminDashboard = () => {
//   // Student form state
//   const [studentName, setStudentName] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [studentPassword, setStudentPassword] = useState("");

//   // Faculty form state
//   const [facultyName, setFacultyName] = useState("");
//   const [facultyEmail, setFacultyEmail] = useState("");
//   const [facultyPassword, setFacultyPassword] = useState("");
//   const [facultyRole, setFacultyRole] = useState("");

//   const handleAddStudent = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation
//     if (!studentName || !studentEmail || !studentPassword) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     // Here you would typically send this data to your backend
//     console.log("Adding student:", { studentName, studentEmail, studentPassword });
    
//     toast.success(`Student ${studentName} added successfully`);
    
//     // Reset form
//     setStudentName("");
//     setStudentEmail("");
//     setStudentPassword("");
//   };

//   const handleAddFaculty = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation
//     if (!facultyName || !facultyEmail || !facultyPassword || !facultyRole) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     // Here you would typically send this data to your backend
//     console.log("Adding faculty:", { facultyName, facultyEmail, facultyPassword, facultyRole });
    
//     toast.success(`Faculty ${facultyName} added successfully`);
    
//     // Reset form
//     setFacultyName("");
//     setFacultyEmail("");
//     setFacultyPassword("");
//     setFacultyRole("");
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-8">
//         <section className="space-y-4">
//           <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
//           <p className="text-muted-foreground">
//             Add and manage users in the system
//           </p>
//         </section>

//         <Tabs defaultValue="students" className="w-full">
//           <TabsList className="grid w-full md:w-[400px] grid-cols-2">
//             <TabsTrigger value="students" className="flex items-center gap-2">
//               <Users className="h-4 w-4" />
//               <span>Students</span>
//             </TabsTrigger>
//             <TabsTrigger value="faculty" className="flex items-center gap-2">
//               <BookUser className="h-4 w-4" />
//               <span>Faculty</span>
//             </TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="students" className="mt-6">
//             <Card className="glass">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <UserPlus className="h-5 w-5" />
//                   Add New Student
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleAddStudent} className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="studentName">Full Name</Label>
//                       <Input 
//                         id="studentName"
//                         value={studentName}
//                         onChange={(e) => setStudentName(e.target.value)}
//                         className="bg-secondary" 
//                         placeholder="John Doe"
//                       />
//                     </div>
                    
//                     <div className="grid gap-2">
//                       <Label htmlFor="studentEmail">Email</Label>
//                       <Input 
//                         id="studentEmail"
//                         type="email"
//                         value={studentEmail}
//                         onChange={(e) => setStudentEmail(e.target.value)}
//                         className="bg-secondary" 
//                         placeholder="john.doe@university.edu"
//                       />
//                     </div>
                    
//                     <div className="grid gap-2">
//                       <Label htmlFor="studentPassword">Password</Label>
//                       <Input 
//                         id="studentPassword"
//                         type="password"
//                         value={studentPassword}
//                         onChange={(e) => setStudentPassword(e.target.value)}
//                         className="bg-secondary" 
//                         placeholder="••••••••"
//                       />
//                     </div>
//                   </div>
                  
//                   <Button type="submit" className="w-full">
//                     Add Student
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           <TabsContent value="faculty" className="mt-6">
//             <Card className="glass">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <UserPlus className="h-5 w-5" />
//                   Add New Faculty
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleAddFaculty} className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="facultyName">Full Name</Label>
//                       <Input 
//                         id="facultyName"
//                         value={facultyName}
//                         onChange={(e) => setFacultyName(e.target.value)}
//                         className="bg-secondary" 
//                         placeholder="Dr. Jane Smith"
//                       />
//                     </div>
                    
//                     <div className="grid gap-2">
//                       <Label htmlFor="facultyEmail">Email</Label>
//                       <Input 
//                         id="facultyEmail"
//                         type="email"
//                         value={facultyEmail}
//                         onChange={(e) => setFacultyEmail(e.target.value)}
//                         className="bg-secondary" 
//                         placeholder="jane.smith@university.edu"
//                       />
//                     </div>
                    
//                     <div className="grid gap-2">
//                       <Label htmlFor="facultyPassword">Password</Label>
//                       <Input 
//                         id="facultyPassword"
//                         type="password"
//                         value={facultyPassword}
//                         onChange={(e) => setFacultyPassword(e.target.value)}
//                         className="bg-secondary" 
//                         placeholder="••••••••"
//                       />
//                     </div>
                    
//                     <div className="grid gap-2">
//                       <Label htmlFor="facultyRole">Role</Label>
//                       <Select value={facultyRole} onValueChange={setFacultyRole}>
//                         <SelectTrigger id="facultyRole" className="bg-secondary">
//                           <SelectValue placeholder="Select role" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="professor">Professor</SelectItem>
//                           <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
//                           <SelectItem value="associate_professor">Associate Professor</SelectItem>
//                           <SelectItem value="department_head">Department Head</SelectItem>
//                           <SelectItem value="dean">Dean</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
                  
//                   <Button type="submit" className="w-full">
//                     Add Faculty
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default AdminDashboard;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Users, UserPlus, BookUser } from "lucide-react";

const AdminDashboard = () => {
  // Student form state
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // Faculty form state
  const [facultyName, setFacultyName] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [facultyRole, setFacultyRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [clubName, setClubName] = useState("");
  const isClubCoordinator = facultyRole === "1"; 

  // Fetch roles from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data.roles))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName || !studentEmail || !studentPassword) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
        }),
      });
      console.log("Response:", response);
      const data = await response.json();
      if (response.ok) {
        toast.success(`Student ${studentName} added successfully`);
        setStudentName("");
        setStudentEmail("");
        setStudentPassword("");
      } else {
        toast.error(data.error || "Error adding student");
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facultyName || !facultyEmail || !facultyPassword || !facultyRole) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: facultyName,
          email: facultyEmail,
          password: facultyPassword,
          role_id: facultyRole,
          club_name: isClubCoordinator ? clubName : null, // Only send club name if the role is Club Coordinator
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Faculty ${facultyName} added successfully`);
        setFacultyName("");
        setFacultyEmail("");
        setFacultyPassword("");
        setFacultyRole("");
      } else {
        toast.error(data.error || "Error adding faculty");
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Add and manage users in the system</p>
        </section>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <BookUser className="h-4 w-4" />
              <span>Faculty</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddStudent} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="studentName">Full Name</Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studentEmail">Email</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="john.doe@university.edu"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studentPassword">Password</Label>
                    <Input
                      id="studentPassword"
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Student
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Faculty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFaculty} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="facultyName">Full Name</Label>
                    <Input
                      id="facultyName"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facultyEmail">Email</Label>
                    <Input
                      id="facultyEmail"
                      type="email"
                      value={facultyEmail}
                      onChange={(e) => setFacultyEmail(e.target.value)}
                      placeholder="jane.smith@university.edu"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facultyPassword">Password</Label>
                    <Input
                      id="facultyPassword"
                      type="password"
                      value={facultyPassword}
                      onChange={(e) => setFacultyPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facultyRole">Role</Label>
                    <Select value={facultyRole} onValueChange={setFacultyRole}>
                      <SelectTrigger id="facultyRole">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {isClubCoordinator && (
  <div className="grid gap-2">
    <Label htmlFor="clubName">Club Name</Label>
    <Input 
      id="clubName"
      value={clubName}
      onChange={(e) => setClubName(e.target.value)}
      className="bg-secondary"
      placeholder="Enter club name"
    />
  </div>
)}
                  <Button type="submit" className="w-full">
                    Add Faculty
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
