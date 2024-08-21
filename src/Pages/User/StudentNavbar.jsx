import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    SheetClose,
} from '@/components/ui/sheet';

const StudentNavbar = () => {
    const [userData, setUserData] = useState(null);
    const [hasToken, setHasToken] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigate = useNavigate()
    const fetchUserData = async () => {
        const token = localStorage.getItem("usersdatatoken");

        if (token) {
            setHasToken(true);
            try {
                const response = await fetch(`https://examination-center.onrender.com/validuser`, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.ValidUserOne); // Assuming `ValidUserOne` contains user data
                } else {
                    setUserData(null);
                    setHasToken(false);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setUserData(null);
                setHasToken(false);
            }
        } else {
            setHasToken(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("usersdatatoken");
        setUserData(null);
        setHasToken(false);
        navigate("/");
      };
    const handleSheetOpen = () => setIsSheetOpen(true);
    const handleSheetClose = () => setIsSheetOpen(false);

    return (
        <div>
            <header className="sticky top-0 z-30 flex w-full h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
                <Link to="#" className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Exam Tracker</span>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                width={32}
                                height={32}
                                className="rounded-full"
                                alt="Avatar"
                                style={{ aspectRatio: "32/32", objectFit: "cover" }}
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {userData ? (
                            <>
                                <DropdownMenuLabel>{userData.fname} {userData.lname}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSheetOpen}>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                            </>
                        ) : (
                            <DropdownMenuLabel>Loading...</DropdownMenuLabel>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Profile</SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4 place-items-center">
                        {userData ? (
                            <>
                                <img
                                    src={userData.photo}
                                    alt="Profile-pic"
                                    className="rounded-full mb-5 w-40 h-40 object-cover border-4 border-black"
                                />
                                <div className="w-[350px] p-6 bg-white shadow-md rounded-lg">
  <div className="grid grid-cols-1 gap-4">
    <div className="flex items-center justify-between">
      <label htmlFor="fname" className="text-lg font-medium">First Name</label>
      <span className="text-gray-700">{userData.fname}</span>
    </div>
    <div className="flex items-center justify-between">
      <label htmlFor="lname" className="text-lg font-medium">Last Name</label>
      <span className="text-gray-700">{userData.lname}</span>
    </div>
    <div className="flex items-center justify-between">
      <label htmlFor="email" className="text-lg font-medium">Email</label>
      <span className="text-gray-700">{userData.email}</span>
    </div>
    <div className="flex items-center justify-between">
      <label htmlFor="course" className="text-lg font-medium">Course</label>
      <span className="text-gray-700">{userData.course}</span>
    </div>
    <div className="flex items-center justify-between">
      <label htmlFor="phone" className="text-lg font-medium">Phone no</label>
      <span className="text-gray-700">{userData.phone}</span>
    </div>
  </div>
</div>

                            </>
                        ) : (
                            <p>Loading profile data...</p>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default StudentNavbar;
