import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from '@/components/component/Header';
import { Toaster , toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    dob: '',
    course: '',
    batch: '',
    password: '',
    cpassword: '',
    photo: null,
    sign: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const { id } = e.target;
    setFormData({ ...formData, [id]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`https://examination-center.onrender.com/register`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Registration successful!");
        setTimeout(()=>{
            navigate('/login')
        },2000)
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <div>
      <Header />
      <Toaster/>
      <div className="flex justify-center items-start mt-16">
        <Card className="w-full md:w-1/2 p-4 sm:p-6 md:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Register</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill out the form to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input id="fname" placeholder="Enter your first name" required onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input id="lname" placeholder="Enter your last name" required onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" required onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" required onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select id="course" required onValueChange={(value) => setFormData({ ...formData, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="business-administration">Business Administration</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input id="batch" placeholder="Enter your batch" required onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" required onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpassword">Confirm Password</Label>
                  <Input id="cpassword" type="password" placeholder="Confirm your password" required onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo</Label>
                <Input id="photo" type="file" accept="image/*" required onChange={handleFileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign">Upload Signature</Label>
                <Input id="sign" type="file" accept="image/*" required onChange={handleFileChange} />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
