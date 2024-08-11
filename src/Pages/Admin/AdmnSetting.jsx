import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/component/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Toaster, toast } from "react-hot-toast";

export default function AdminSetting() {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://examination-center.onrender.com/users'); // Replace with your API endpoint
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

  const handleCheckActivity = (user) => {
    console.log(user)
    setSelectedUser(user);
    setShowActivityModal(true);
  };


  const promoteToAdmin = async (email) => {
    try {
      const response = await fetch("https://examination-center.onrender.com/promote-to-admin", {
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
      const response = await fetch(`https://examination-center.onrender.com/resetCounts/${userId}`, {
        method: 'GET',
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

  if (loading) return <p>Loading...</p>;

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
        <Badge variant="outline" className={`bg-${user.role === 'Admin' ? 'accent' : 'primary'} text-${user.role === 'Admin' ? 'accent' : 'primary'}-foreground`}>
          {user.Score}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className={`bg-${user.role === 'Admin' ? 'accent' : 'primary'} text-${user.role === 'Admin' ? 'accent' : 'primary'}-foreground`}>
          {user.Role}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Button size="sm" variant="outline" onClick={() => handleCheckActivity(user)}>
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
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">Reset Exam</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>

        {showActivityModal && (
          <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Activity Details for {selectedUser?.fname}</DialogTitle>
              </DialogHeader>
              <a
                href={selectedUser.txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-xs overflow-hidden text-ellipsis font-bold"
                onClick={() => window.open(selectedUser.txUrl, '_blank')}
              >
                {selectedUser.txUrl}
              </a>

              <div className="modal-body">
                <span>
                  {selectedUser.Cheat.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((item, index) => (
                    <div key={index}>
                      <p>Type: {item.type}</p>
                      <p>Time: {item.timestamp}</p>
                    </div>
                  ))}
                </span>
                <div className="pagination">
                  <Button
                    className='m-5'
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}>
                    Previous
                  </Button>
                  <Button
                    className='m-5'
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={(currentPage + 1) * ITEMS_PER_PAGE >= selectedUser.Cheat.length}>
                    Next
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowActivityModal(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
