const userManagement = {
  getUser: (req, res) => {
    res.json({ message: "get user", status: 200 });
    console.log("get user login");
  },

  postUser: (req, res) => {
    res.json({ message: "post user", status: 200 });
    console.log("post user login");
  },

  logOutUser: (req, res) => {
    res.json({ message: "hasta luego" });
    console.log("logout");
  },
};
export default userManagement;
