import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from './Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Toaster, toast } from "react-hot-toast";
import { SyncLoader } from "react-spinners";

export default function AdminSetting() {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cheatData, setCheatData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch users on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://examination-center.onrender.com/api/users/users'); // Replace with your API endpoint
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Fetch cheat data for the selected user
  useEffect(() => {
    const fetchCheatData = async () => {
      if (selectedUser && selectedUser._id) {
        try {
          const response = await fetch(`https://examination-center.onrender.com/api/cheats/cheat/${selectedUser._id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('usersdatatoken')}` // Assuming token is stored in localStorage
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch cheat data');
          }

          const data = await response.json();
          setCheatData(data);
        } catch (err) {
          console.error(err.message);
        }
      }
    };

    fetchCheatData();
  }, [selectedUser]);

  const handleOpenDialog = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowActivityModal(true); // Open the modal
  };

  const handleCloseDialog = () => {
    setShowActivityModal(false); // Close the modal
    setSelectedUser(null); // Clear selected user
    setCheatData([]); // Clear cheat data
  };

  const handleNext = () => {
    if (currentIndex < cheatData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const promoteToAdmin = async (email) => {
    try {
      const response = await fetch("https://examination-center.onrender.com/api/users/promote-to-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("User promoted to admin successfully!");
      } else {
        toast.error("Failed to promote user to admin.");
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("An error occurred while promoting the user.");
    }
  };

  const handleResetCounts = async (userId) => {
    try {
      const response = await fetch(`https://examination-center.onrender.com/api/cheats/erase/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast.success("Exam attempt has been reset", { position: 'bottom-right' });

        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, Cheat: [] } : user))
        );
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to reset counts. Please try again.');
      console.error('Error resetting counts:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }

  const tableRows = users.map((user, index) => (
    <tr key={index} className="border-b">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photo} alt="User Avatar" />
            <AvatarFallback>{user.fname[0]}</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">
        <Badge>{user.Role}</Badge>
      </td>
      <td className="px-4 py-3">
        <Button size="sm" variant="outline" onClick={() => handleOpenDialog(user)}>
          Check Activity
        </Button>
      </td>
      <td className="px-4 py-3">
        <Button size="sm" variant="outline" onClick={() => handleResetCounts(user._id)}>
          Reset Exam
        </Button>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant="outline"
          disabled={user.role === "Admin"}
          onClick={() => promoteToAdmin(user.email)}
        >
          Promote to Admin
        </Button>
      </td>
    </tr>
  ));

  return (
    <div className="flex">
      <Toaster />
      <Navbar className="w-1/5 bg-gray-800 text-white h-screen" />
      <div className="ml-60 items-center justify-center main-content flex-1 p-8">
        <h1 className="text-3xl font-bold">User Settings</h1>
        <div className="mt-2 bg-background rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">Reset Exam</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
        {showActivityModal && (
          <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Activity Details for {selectedUser?.fname}</DialogTitle>
              </DialogHeader>
              {cheatData.length > 0 ? (
                <div className="modal-body">
                  <p>Type: {cheatData[currentIndex]?.type}</p>
                  <p>Time: {new Date(cheatData[currentIndex]?.timestamp).toLocaleString()}</p>
                  <div className="pagination">
                    <Button
                      className="m-5"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      className="m-5"
                      onClick={handleNext}
                      disabled={currentIndex === cheatData.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <p>No cheat data available</p>
              )}
              <DialogFooter>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
